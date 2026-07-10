export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface HeroSettings extends BaseEntity {
  title: string
  subtitle: string
  description: string
  ctaText: string
  ctaLink: string
  backgroundImage?: string
  stats: HeroStat[]
}

export interface HeroStat {
  label: string
  value: number
  suffix?: string
}

export interface AboutSettings extends BaseEntity {
  title: string
  content: string
  image?: string
  highlights: string[]
}

export interface VisionMissionSettings extends BaseEntity {
  vision: string
  mission: string[]
  values: string[]
}

export interface ContactSettings extends BaseEntity {
  address: string
  phone: string
  email: string
  whatsapp?: string
  mapEmbedUrl?: string
  officeHours: string
}

export interface SeoSettings extends BaseEntity {
  siteTitle: string
  siteDescription: string
  keywords: string[]
  ogImage?: string
  favicon?: string
}

export interface NavigationItem {
  id: string
  label: string
  href: string
  order: number
  isExternal: boolean
}

export interface FooterSettings extends BaseEntity {
  description: string
  copyright: string
  links: NavigationItem[]
}

export interface SocialSettings extends BaseEntity {
  facebook?: string
  instagram?: string
  youtube?: string
  twitter?: string
  tiktok?: string
}

export interface Teacher extends BaseEntity {
  name: string
  nip?: string
  subject: string
  photo?: string
  bio?: string
  email?: string
  isPublished: boolean
  order: number
}

export interface Agenda extends BaseEntity {
  title: string
  description?: string
  startDate: string
  endDate?: string
  location?: string
  image?: string
  isPublished: boolean
}

export interface GalleryItem extends BaseEntity {
  title: string
  description?: string
  imageUrl: string
  category: string
  isPublished: boolean
  order: number
}

export interface Testimonial extends BaseEntity {
  name: string
  role: string
  content: string
  photo?: string
  rating: number
  isPublished: boolean
  order: number
}

export interface Activity extends BaseEntity {
  title: string
  description: string
  image?: string
  date: string
  category: string
  isPublished: boolean
}

export interface Facility extends BaseEntity {
  name: string
  description: string
  icon?: string
  image?: string
  isPublished: boolean
  order: number
}

export interface Achievement extends BaseEntity {
  title: string
  description: string
  year: number
  category: string
  image?: string
  isPublished: boolean
}

export interface News extends BaseEntity {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  author?: string
  publishedAt?: string
  isPublished: boolean
  tags: string[]
}

export interface Principal extends BaseEntity {
  name: string
  title: string
  photo?: string
  message: string
  signature?: string
}

export interface MediaFile extends BaseEntity {
  filename: string
  originalName: string
  url: string
  mimeType: string
  size: number
  alt?: string
  folder?: string
}

export type CmsModule =
  | 'teachers'
  | 'agenda'
  | 'gallery'
  | 'testimonials'
  | 'activities'
  | 'facilities'
  | 'achievements'
  | 'news'
  | 'users'
  | 'roles'
  | 'media'
  | 'settings'
