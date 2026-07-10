import { describe, expect, it } from 'vitest'
import { galleryFromApi, galleryToApi, userFromApi, userToApi } from './mappers'

describe('galleryToApi', () => {
  it('maps cover and album without duplicating cover', () => {
    const result = galleryToApi({
      title: 'Album',
      coverImage: '/storage/media/cover.jpg',
      albumImages: ['/storage/media/cover.jpg', '/storage/media/a.jpg', '/storage/media/b.jpg'],
      category: 'general',
      isPublished: true,
      order: 0,
    })

    expect(result.cover_image).toBe('/storage/media/cover.jpg')
    expect(result.images).toEqual(['/storage/media/a.jpg', '/storage/media/b.jpg'])
  })

  it('falls back to cover as sole image when album is empty', () => {
    const result = galleryToApi({
      title: 'Album',
      coverImage: '/storage/media/cover.jpg',
      albumImages: [],
      category: 'general',
      isPublished: true,
      order: 0,
    })

    expect(result.images).toEqual(['/storage/media/cover.jpg'])
  })
})

describe('galleryFromApi', () => {
  it('splits cover from album images', () => {
    const result = galleryFromApi({
      title: 'Album',
      cover_image: '/storage/media/cover.jpg',
      images: ['/storage/media/cover.jpg', '/storage/media/a.jpg'],
      status: 'published',
      sort_order: 1,
    })

    expect(result.coverImage).toBe('/storage/media/cover.jpg')
    expect(result.albumImages).toEqual(['/storage/media/a.jpg'])
  })
})

describe('userToApi / userFromApi', () => {
  it('round-trips avatar', () => {
    const form = {
      name: 'Admin',
      email: 'admin@test.com',
      roleId: '1',
      avatar: '/storage/media/avatar.jpg',
      isActive: true,
    }

    const api = userToApi(form, 'Super Admin')
    expect(api.avatar).toBe('/storage/media/avatar.jpg')

    const restored = userFromApi({
      name: 'Admin',
      email: 'admin@test.com',
      avatar: '/storage/media/avatar.jpg',
      status: 'active',
      roles: ['Super Admin'],
    })

    expect(restored.avatar).toBe('/storage/media/avatar.jpg')
    expect(restored.isActive).toBe(true)
  })
})
