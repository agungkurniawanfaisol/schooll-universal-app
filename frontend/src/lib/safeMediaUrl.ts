const BLOCKED_PROTOCOL = /^\s*(javascript|data|vbscript):/i

export function isSafeMediaUrl(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed || BLOCKED_PROTOCOL.test(trimmed)) {
    return false
  }

  if (trimmed.startsWith('/storage/media/')) {
    return true
  }

  try {
    const parsed = new URL(trimmed, window.location.origin)
    if (parsed.origin !== window.location.origin) {
      return false
    }

    return parsed.pathname.startsWith('/storage/media/')
  } catch {
    return false
  }
}

export function resolveSafeMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null
  return isSafeMediaUrl(url) ? url : null
}
