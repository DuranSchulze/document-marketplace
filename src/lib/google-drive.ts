export function extractGoogleDriveFileId(input: string): string | null {
  const value = input.trim()
  if (!value) return null

  const directIdMatch = value.match(/^[a-zA-Z0-9_-]{10,}$/)
  if (directIdMatch) return directIdMatch[0]

  try {
    const url = new URL(value)
    const idFromQuery = url.searchParams.get('id')
    if (idFromQuery) return idFromQuery

    const pathMatch = url.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/)
    if (pathMatch?.[1]) return pathMatch[1]

    const filePathMatch = url.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (filePathMatch?.[1]) return filePathMatch[1]
  } catch {
    return null
  }

  return null
}

export function getGoogleDriveDownloadUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`
}

export function normalizeGoogleDriveFile(input: {
  driveFileId?: string | null
  driveFileUrl?: string | null
  driveFileName?: string | null
  fallbackFileName?: string | null
}) {
  const rawId = input.driveFileId?.trim() ?? ''
  const rawUrl = input.driveFileUrl?.trim() ?? ''
  const fileId = rawId || extractGoogleDriveFileId(rawUrl) || ''
  const driveFileUrl = fileId ? getGoogleDriveDownloadUrl(fileId) : rawUrl
  const driveFileName = (input.driveFileName?.trim() || input.fallbackFileName?.trim() || (fileId ? `google-drive-file-${fileId}` : '')).trim()

  return {
    driveFileId: fileId,
    driveFileUrl,
    driveFileName,
  }
}
