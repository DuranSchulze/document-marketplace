import { google } from "googleapis";
import { Readable } from "node:stream";
import { env } from "@/env";

function parsePrivateKey(raw: string): string {
  if (!raw.includes("-----BEGIN")) {
    return Buffer.from(raw, "base64").toString("utf-8").trim();
  }
  return raw.replace(/\\n/g, "\n").trim();
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
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
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
  });

  return created.data.id!;
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
  });

  const fileId = uploaded.data.id!;

  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return {
    fileId,
    fileName: uploaded.data.name ?? fileName,
    directUrl: getDriveDirectUrl(fileId),
  };
}
