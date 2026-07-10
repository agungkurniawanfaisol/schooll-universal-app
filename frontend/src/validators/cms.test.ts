import { describe, expect, it } from 'vitest'
import { gallerySchema, loginSchema, teacherSchema } from './cms'

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: 'secret1' })
    expect(result.success).toBe(true)
  })

  it('rejects short password', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: '123' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'secret1' })
    expect(result.success).toBe(false)
  })
})

describe('gallerySchema', () => {
  it('requires cover image', () => {
    const result = gallerySchema.safeParse({
      title: 'Galeri',
      coverImage: '',
      category: 'general',
      isPublished: true,
    })

    expect(result.success).toBe(false)
  })

  it('rejects more than 20 album images', () => {
    const result = gallerySchema.safeParse({
      title: 'Galeri',
      coverImage: '/storage/media/cover.jpg',
      albumImages: Array.from({ length: 21 }, (_, i) => `/storage/media/${i}.jpg`),
      category: 'general',
      isPublished: true,
    })

    expect(result.success).toBe(false)
  })

  it('accepts valid gallery data', () => {
    const result = gallerySchema.safeParse({
      title: 'Galeri',
      coverImage: '/storage/media/cover.jpg',
      albumImages: ['/storage/media/a.jpg'],
      category: 'general',
      isPublished: true,
      order: 0,
    })

    expect(result.success).toBe(true)
  })
})

describe('teacherSchema', () => {
  it('requires name and subject', () => {
    const result = teacherSchema.safeParse({
      name: 'A',
      subject: 'X',
      isPublished: true,
    })

    expect(result.success).toBe(false)
  })

  it('accepts valid teacher data', () => {
    const result = teacherSchema.safeParse({
      name: 'Budi Santoso',
      subject: 'Matematika',
      isPublished: true,
    })

    expect(result.success).toBe(true)
  })
})
