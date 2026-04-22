import { google } from "googleapis";
import { Readable } from "node:stream";
import { env } from "@/env";
import { getGoogleDriveDownloadUrl } from "@/lib/google-drive";

function parsePrivateKey(raw: string): string {
  // Strip surrounding quotes — `.env` parsers usually handle this, but Vercel
  // sometimes preserves them when the value is pasted manually.
  let key = raw.trim().replace(/^['"]|['"]$/g, "");

  // If this doesn't already look like a PEM, assume it's base64-encoded and
  // decode it first. (Common Vercel-friendly storage format because the raw
  // PEM has newlines that the dashboard mangles.)
  if (!key.includes("-----BEGIN")) {
    key = Buffer.from(key, "base64").toString("utf-8");
  }

  // Always normalize escaped newlines to real ones — applies whether the key
  // came in as raw PEM with literal `\n` or as a base64-decoded JSON-escaped
  // string. Without this, OpenSSL throws `error:1E08010C:DECODER unsupported`
  // because the BEGIN/END lines aren't on their own lines.
  key = key.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").trim();

  if (!key.includes("-----BEGIN") || !key.includes("-----END")) {
    throw new Error(
      "Parsed GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY does not look like a PEM. " +
        "Expected either a raw PEM (with literal newlines or escaped \\n) or a base64-encoded PEM."
    );
  }

  return key;
}

function getDriveClient() {
  const privateKey = parsePrivateKey(env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? "");
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  return google.drive({ version: "v3", auth });
}

export function isDriveConfigured(): boolean {
  return !!(
    env.GOOGLE_DRIVE_ROOT_FOLDER_ID &&
    env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  );
}

export async function checkDriveConnection(): Promise<{
  ok: boolean;
  error?: string;
  folderName?: string;
}> {
  if (!isDriveConfigured()) {
    return {
      ok: false,
      error:
        "Missing env vars (GOOGLE_DRIVE_ROOT_FOLDER_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)",
    };
  }
  try {
    const drive = getDriveClient();
    const res = await drive.files.get({
      fileId: env.GOOGLE_DRIVE_ROOT_FOLDER_ID!,
      fields: "id, name, mimeType",
      supportsAllDrives: true,
    });
    return { ok: true, folderName: res.data.name ?? undefined };
  } catch (err: unknown) {
    const raw = err instanceof Error ? err.message : "Unknown Drive error";
    const message =
      raw.includes("401") || raw.toLowerCase().includes("invalid authentication")
        ? "401 — Share the Drive folder with your service account email, or check GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in Vercel env vars"
        : raw;
    return { ok: false, error: message };
  }
}

export function getDriveDirectUrl(fileId: string): string {
  return getGoogleDriveDownloadUrl(fileId);
}

async function getOrCreateCategoryFolder(
  categoryName: string,
): Promise<string> {
  const drive = getDriveClient();
  const rootFolderId = env.GOOGLE_DRIVE_ROOT_FOLDER_ID!;

  const search = await drive.files.list({
    q: `name='${categoryName}' and '${rootFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: "files(id, name)",
    spaces: "drive",
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  const existing = search.data.files?.[0];
  if (existing?.id) return existing.id;

  const created = await drive.files.create({
    requestBody: {
      name: categoryName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [rootFolderId],
    },
    fields: "id",
    supportsAllDrives: true,
  });

  return created.data.id!;
}

/**
 * Resolve a Drive file's thumbnail URL via the service account, fetch it,
 * and return the bytes. The public `drive.google.com/thumbnail?id=…` endpoint
 * only works when the file is shared as anyone-can-read AND Drive has had
 * time to render a thumbnail; for service-account-only files it 404s. Going
 * through the API ensures we always have access.
 *
 * Returns null when Drive hasn't generated a thumbnail yet (common right
 * after upload — caller should fall back to a placeholder).
 */
export async function fetchDriveThumbnail(
  fileId: string,
  size = 1600,
): Promise<{ bytes: ArrayBuffer; contentType: string } | null> {
  const drive = getDriveClient()
  const meta = await drive.files.get({
    fileId,
    fields: 'id, thumbnailLink',
    supportsAllDrives: true,
  })
  const link = meta.data.thumbnailLink
  if (!link) return null

  // Drive's thumbnailLink includes a `=sNNN` size suffix (e.g. =s220). Swap
  // it for our requested width so the image isn't tiny when zoomed.
  const sized = link.replace(/=s\d+$/, `=s${size}`)

  // The thumbnailLink is itself a signed URL — no Authorization header needed.
  const res = await fetch(sized)
  if (!res.ok) return null

  return {
    bytes: await res.arrayBuffer(),
    contentType: res.headers.get('content-type') ?? 'image/jpeg',
  }
}

/**
 * Fetch a Drive file's bytes via the service account. Returns a Web ReadableStream
 * suitable for handing back to a Next.js Response, so we can serve the file with
 * `Content-Disposition: attachment` and force the browser to save it (instead of
 * 302-redirecting to Drive's viewer, which renders inline).
 */
export async function streamDriveFile(fileId: string): Promise<{
  stream: ReadableStream<Uint8Array>
  fileName: string
  mimeType: string
  size?: number
}> {
  const drive = getDriveClient()

  const meta = await drive.files.get({
    fileId,
    fields: 'id, name, mimeType, size',
    supportsAllDrives: true,
  })

  const fileName = meta.data.name ?? `download-${fileId}`
  const mimeType = meta.data.mimeType ?? 'application/octet-stream'
  const size = meta.data.size ? Number(meta.data.size) : undefined

  const res = await drive.files.get(
    { fileId, alt: 'media', supportsAllDrives: true },
    { responseType: 'stream' },
  )

  // googleapis returns a Node Readable; convert to a Web ReadableStream for
  // Response. Node 18+ provides Readable.toWeb.
  const nodeStream = res.data as Readable
  const stream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>

  return { stream, fileName, mimeType, size }
}

export async function uploadFileToDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  category: string,
): Promise<{ fileId: string; fileName: string; directUrl: string }> {
  const drive = getDriveClient();
  const folderId = await getOrCreateCategoryFolder(category);

  const uploaded = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: Readable.from(fileBuffer),
    },
    fields: "id, name",
    supportsAllDrives: true,
  });

  const fileId = uploaded.data.id!;

  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
    supportsAllDrives: true,
  });

  return {
    fileId,
    fileName: uploaded.data.name ?? fileName,
    directUrl: getDriveDirectUrl(fileId),
  };
}
