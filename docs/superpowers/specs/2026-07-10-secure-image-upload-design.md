# Secure Image Upload — Design Spec

**Date:** 2026-07-10  
**Status:** Approved for implementation

## Goal

Enable photo upload for Guru, User (avatar), Hero (existing), and Galeri (cover + album) via a single secured media pipeline with consistent size/extension limits and URL validation.

## Upload policy

| Rule | Value |
|------|-------|
| Max file size | 5 MB (5120 KB) |
| Extensions | jpg, jpeg, png, webp |
| MIME types | image/jpeg, image/png, image/webp |
| Max input dimensions | 4096 × 4096 px |
| Output | JPEG, max width 1920 px, quality 85 |
| Stored URLs | Internal `/storage/media/...` only |

## Architecture

- **Upload:** `POST /api/v1/media` → `UploadMediaRequest` → `MediaService` (decode, validate dimensions, re-encode JPEG, store UUID filename)
- **Forms:** Store returned media URL in entity fields; validate with `SafeMediaUrl` on save
- **Frontend:** `ImageUploader` / `MultiImageUploader` → `uploadMediaFile` → set form field

## Security controls

1. Server-side MIME + extension validation (Laravel `File::image()` + `MediaService`)
2. Re-encode to JPEG (mitigates polyglot payloads)
3. Dimension limits (mitigates decompression bombs)
4. UUID filenames (no path traversal)
5. `SafeMediaUrl` on stored image URL fields (blocks external/javascript/data URLs)
6. Auth + `media.create` permission on upload endpoint
7. Feature tests for valid/reject cases

## Components changed

### Backend
- `config/media.php`
- `MediaService`, `UploadMediaRequest`
- `SafeMediaUrl` rule
- Form requests: Teacher, User, Gallery, Activity, Facility, Achievement, Testimonial, News, Agenda, Hero, About, SEO
- `tests/Feature/MediaUploadSecurityTest.php`

### Frontend
- `config/upload.ts`
- `ImageUploader`, `MultiImageUploader`
- `TeacherFormPage`, `UserFormPage`, `GalleryFormPage`, `HeroSettingsPage`
- `validators/cms.ts`, `api/mappers.ts`

## Out of scope

- Public (unauthenticated) upload
- External URL import / hotlinking
- Image CDN integration
