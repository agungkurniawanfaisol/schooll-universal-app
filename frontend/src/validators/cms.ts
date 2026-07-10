import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const userSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter').optional(),
  roleId: z.string().min(1, 'Role wajib dipilih'),
  avatar: z.string().optional(),
  isActive: z.boolean(),
})

export type UserFormData = z.infer<typeof userSchema>

export const roleSchema = z.object({
  name: z.string().min(2, 'Nama role minimal 2 karakter'),
  slug: z.string().min(2, 'Slug minimal 2 karakter'),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, 'Minimal 1 permission'),
})

export type RoleFormData = z.infer<typeof roleSchema>

export const teacherSchema = z.object({
  name: z.string().min(2, 'Nama wajib diisi'),
  nip: z.string().optional(),
  position: z.string().optional(),
  subject: z.string().min(2, 'Mata pelajaran wajib diisi'),
  photo: z.string().optional(),
  bio: z.string().optional(),
  email: z.email('Email tidak valid').optional().or(z.literal('')),
  isPublished: z.boolean(),
  order: z.number().int().min(0).optional(),
})

export type TeacherFormData = z.infer<typeof teacherSchema>

export const agendaSchema = z.object({
  title: z.string().min(3, 'Judul wajib diisi'),
  slug: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
  endDate: z.string().optional(),
  location: z.string().optional(),
  image: z.string().optional(),
  publishStartAt: z.string().optional(),
  publishEndAt: z.string().optional(),
  isPublished: z.boolean(),
})

export type AgendaFormData = z.infer<typeof agendaSchema>

export const gallerySchema = z.object({
  title: z.string().min(2, 'Judul wajib diisi'),
  description: z.string().optional(),
  coverImage: z.string().min(1, 'Foto cover wajib diupload'),
  albumImages: z.array(z.string()).max(20, 'Maksimal 20 foto album').optional(),
  category: z.string().min(1, 'Kategori wajib diisi'),
  isPublished: z.boolean(),
  order: z.number().int().min(0).optional(),
})

export type GalleryFormData = z.infer<typeof gallerySchema>

export const testimonialSchema = z.object({
  name: z.string().min(2, 'Nama wajib diisi'),
  role: z.string().min(2, 'Peran wajib diisi'),
  content: z.string().min(10, 'Testimoni minimal 10 karakter'),
  photo: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  isPublished: z.boolean(),
  order: z.number().int().min(0).optional(),
})

export type TestimonialFormData = z.infer<typeof testimonialSchema>

export const activitySchema = z.object({
  title: z.string().min(3, 'Judul wajib diisi'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  image: z.string().optional(),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  category: z.string().min(1, 'Kategori wajib diisi'),
  isPublished: z.boolean(),
})

export type ActivityFormData = z.infer<typeof activitySchema>

export const facilitySchema = z.object({
  name: z.string().min(2, 'Nama fasilitas wajib diisi'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  icon: z.string().optional(),
  image: z.string().optional(),
  isPublished: z.boolean(),
  order: z.number().int().min(0).optional(),
})

export type FacilityFormData = z.infer<typeof facilitySchema>

export const achievementSchema = z.object({
  title: z.string().min(3, 'Judul wajib diisi'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  year: z.number().int().min(1900).max(2100),
  category: z.string().min(1, 'Kategori wajib diisi'),
  image: z.string().optional(),
  isPublished: z.boolean(),
})

export type AchievementFormData = z.infer<typeof achievementSchema>

export const newsSchema = z.object({
  title: z.string().min(5, 'Judul wajib diisi'),
  slug: z.string().min(3, 'Slug wajib diisi'),
  excerpt: z.string().min(10, 'Ringkasan minimal 10 karakter'),
  content: z.string().min(20, 'Konten minimal 20 karakter'),
  coverImage: z.string().optional(),
  author: z.string().optional(),
  publishedAt: z.string().optional(),
  publishStartAt: z.string().optional(),
  publishEndAt: z.string().optional(),
  isPublished: z.boolean(),
  tags: z.array(z.string()),
})

export type NewsFormData = z.infer<typeof newsSchema>

export const heroSettingsSchema = z.object({
  title: z.string().min(3),
  subtitle: z.string().min(3),
  description: z.string().min(10),
  ctaText: z.string().min(2),
  ctaLink: z.string().min(1),
  backgroundImage: z.string().optional(),
  stats: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
      suffix: z.string().optional(),
    }),
  ),
})

export const aboutSettingsSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(20),
  image: z.string().optional(),
  highlights: z.array(z.string()),
})

export const visionMissionSchema = z.object({
  vision: z.string().min(10),
  mission: z.array(z.string().min(5)),
  values: z.array(z.string().min(3)),
})

export const contactSettingsSchema = z.object({
  address: z.string().min(5),
  phone: z.string().min(8),
  email: z.email(),
  whatsapp: z.string().optional(),
  mapEmbedUrl: z.string().optional(),
  officeHours: z.string().min(3),
})

export const seoSettingsSchema = z.object({
  siteTitle: z.string().min(3),
  siteDescription: z.string().min(10),
  keywords: z.array(z.string()),
  ogImage: z.string().optional(),
  favicon: z.string().optional(),
})

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Nama wajib diisi'),
  email: z.email('Email tidak valid'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subjek wajib diisi'),
  message: z.string().min(10, 'Pesan minimal 10 karakter'),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
