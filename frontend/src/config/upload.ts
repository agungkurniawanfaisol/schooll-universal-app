export const UPLOAD_MAX_SIZE_MB = 5

export const UPLOAD_MAX_SIZE_BYTES = UPLOAD_MAX_SIZE_MB * 1024 * 1024

export const UPLOAD_ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'] as const

export const UPLOAD_ACCEPT = 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp'

export const UPLOAD_HINT = `JPG, PNG, WEBP — maks. ${UPLOAD_MAX_SIZE_MB} MB`

export const UPLOAD_MAX_ALBUM_ITEMS = 20

export function isAllowedUploadFile(file: File): boolean {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!UPLOAD_ALLOWED_EXTENSIONS.includes(extension as (typeof UPLOAD_ALLOWED_EXTENSIONS)[number])) {
    return false
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  return allowedTypes.includes(file.type)
}
