import { describe, expect, it } from 'vitest'
import { isAllowedUploadFile } from './upload'

function mockFile(name: string, type: string, size = 1024): File {
  return new File([new Uint8Array(size)], name, { type })
}

describe('isAllowedUploadFile', () => {
  it('accepts valid jpeg', () => {
    expect(isAllowedUploadFile(mockFile('photo.jpg', 'image/jpeg'))).toBe(true)
  })

  it('accepts valid png', () => {
    expect(isAllowedUploadFile(mockFile('photo.png', 'image/png'))).toBe(true)
  })

  it('accepts valid webp', () => {
    expect(isAllowedUploadFile(mockFile('photo.webp', 'image/webp'))).toBe(true)
  })

  it('rejects gif extension', () => {
    expect(isAllowedUploadFile(mockFile('photo.gif', 'image/gif'))).toBe(false)
  })

  it('rejects php extension even with image mime', () => {
    expect(isAllowedUploadFile(mockFile('evil.php', 'image/jpeg'))).toBe(false)
  })

  it('rejects disallowed mime type', () => {
    expect(isAllowedUploadFile(mockFile('photo.jpg', 'application/octet-stream'))).toBe(false)
  })
})
