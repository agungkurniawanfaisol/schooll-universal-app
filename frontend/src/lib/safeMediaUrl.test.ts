import { describe, expect, it } from 'vitest'

import { isSafeMediaUrl } from './safeMediaUrl'

describe('isSafeMediaUrl', () => {
  it('allows internal storage media paths', () => {
    expect(isSafeMediaUrl('/storage/media/2026/07/logo.jpg')).toBe(true)
  })

  it('allows absolute same-origin media urls', () => {
    expect(isSafeMediaUrl(`${window.location.origin}/storage/media/2026/07/logo.jpg`)).toBe(true)
  })

  it('rejects external urls', () => {
    expect(isSafeMediaUrl('https://evil.example.com/storage/media/logo.jpg')).toBe(false)
  })

  it('rejects javascript urls', () => {
    expect(isSafeMediaUrl('javascript:alert(1)')).toBe(false)
  })

  it('rejects data urls', () => {
    expect(isSafeMediaUrl('data:image/png;base64,abc')).toBe(false)
  })
})
