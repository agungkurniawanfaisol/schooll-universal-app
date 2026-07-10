import { isPublishedStatus, publishStatus, toId, type ApiRecord } from '@/api/utils'
import type { User } from '@/types/auth'
import type {
  AcademicEventFormData,
  AchievementFormData,
  ActivityFormData,
  AgendaFormData,
  ApiTokenFormData,
  CustomPageFormData,
  DownloadDocumentFormData,
  ExtracurricularFormData,
  FacilityFormData,
  FaqFormData,
  GalleryFormData,
  NewsFormData,
  TeacherFormData,
  TenantFormData,
  TestimonialFormData,
  UserFormData,
  WebhookFormData,
} from '@/validators/cms'

export interface ListRow {
  id: string
  title: string
  isPublished: boolean
  createdAt: string
  publishStartAt?: string
  publishEndAt?: string
}

function baseListRow(item: ApiRecord, titleKey = 'title'): ListRow {
  return {
    id: toId(item.id),
    title: String(item[titleKey] ?? item.name ?? '-'),
    isPublished: isPublishedStatus(item.status),
    createdAt: String(item.created_at ?? ''),
    publishStartAt: item.publish_start_at ? String(item.publish_start_at) : undefined,
    publishEndAt: item.publish_end_at ? String(item.publish_end_at) : undefined,
  }
}

function toDatetimeLocal(value: unknown): string | undefined {
  if (!value) return undefined
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return undefined
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function mapTeacherListRow(item: ApiRecord): ListRow {
  return {
    ...baseListRow(item, 'name'),
    title: String(item.name ?? '-'),
  }
}

export const mapAgendaListRow = (item: ApiRecord) => baseListRow(item)
export const mapGalleryListRow = (item: ApiRecord) => baseListRow(item)
export const mapTestimonialListRow = (item: ApiRecord) => ({
  ...baseListRow(item, 'name'),
  title: String(item.name ?? '-'),
})
export const mapActivityListRow = (item: ApiRecord) => baseListRow(item)
export const mapFacilityListRow = (item: ApiRecord) => baseListRow(item)
export const mapAchievementListRow = (item: ApiRecord) => baseListRow(item)
export const mapNewsListRow = (item: ApiRecord) => baseListRow(item)
export const mapCustomPageListRow = (item: ApiRecord) => baseListRow(item)
export const mapAcademicEventListRow = (item: ApiRecord) => baseListRow(item)
export const mapDownloadDocumentListRow = (item: ApiRecord) => baseListRow(item)
export const mapFaqListRow = (item: ApiRecord) => ({
  ...baseListRow(item, 'question'),
  title: String(item.question ?? '-'),
})
export const mapExtracurricularListRow = (item: ApiRecord) => baseListRow(item)
export const mapWebhookListRow = (item: ApiRecord) => ({
  id: toId(item.id),
  title: String(item.name ?? '-'),
  isPublished: Boolean(item.is_active),
  createdAt: String(item.created_at ?? ''),
})
export const mapApiTokenListRow = (item: ApiRecord) => ({
  id: toId(item.id),
  title: String(item.name ?? '-'),
  isPublished: Boolean(item.is_active),
  createdAt: String(item.created_at ?? ''),
})
export const mapTenantListRow = (item: ApiRecord) => ({
  id: toId(item.id),
  title: String(item.name ?? '-'),
  isPublished: Boolean(item.is_active),
  createdAt: String(item.created_at ?? ''),
})

export function mapUserListRow(item: ApiRecord): ListRow & { email: string } {
  return {
    id: toId(item.id),
    title: String(item.name ?? '-'),
    email: String(item.email ?? ''),
    isPublished: item.status === 'active',
    createdAt: String(item.created_at ?? ''),
  }
}

export function mapRoleListRow(item: ApiRecord): ListRow {
  return {
    id: toId(item.id),
    title: String(item.name ?? '-'),
    isPublished: true,
    createdAt: String(item.created_at ?? ''),
  }
}

export function mapMediaListRow(item: ApiRecord) {
  return {
    id: toId(item.id),
    title: String(item.original_name ?? item.filename ?? '-'),
    url: String(item.url ?? ''),
    mimeType: String(item.mime_type ?? ''),
    size: Number(item.size ?? 0),
    createdAt: String(item.created_at ?? ''),
  }
}

export function mapUserFromApi(raw: ApiRecord): User {
  const roles = raw.roles as string[] | undefined
  return {
    id: toId(raw.id),
    name: String(raw.name ?? ''),
    email: String(raw.email ?? ''),
    avatar: raw.avatar ? String(raw.avatar) : undefined,
    roleId: roles?.[0] ?? '',
    permissions: (raw.permissions as string[]) ?? [],
    isActive: raw.status === 'active',
    createdAt: String(raw.created_at ?? ''),
    updatedAt: String(raw.updated_at ?? raw.created_at ?? ''),
  }
}

export function teacherToApi(data: TeacherFormData) {
  return {
    name: data.name,
    subject: data.subject,
    biography: data.bio,
    photo: data.photo || undefined,
    position: data.position || undefined,
    sort_order: data.order ?? 0,
    status: publishStatus(data.isPublished),
  }
}

export function teacherFromApi(item: ApiRecord): TeacherFormData {
  return {
    name: String(item.name ?? ''),
    subject: String(item.subject ?? ''),
    bio: String(item.biography ?? ''),
    photo: item.photo ? String(item.photo) : undefined,
    position: item.position ? String(item.position) : undefined,
    nip: undefined,
    email: undefined,
    isPublished: isPublishedStatus(item.status),
    order: Number(item.sort_order ?? 0),
  }
}

export function agendaToApi(data: AgendaFormData) {
  const [datePart, timePart] = data.startDate.includes('T')
    ? data.startDate.split('T')
    : [data.startDate, undefined]

  return {
    title: data.title,
    slug: data.slug,
    description: data.description,
    date: datePart,
    end_date: data.endDate ? data.endDate.split('T')[0] : undefined,
    time: timePart?.slice(0, 5),
    location: data.location,
    thumbnail: data.image,
    publish_start_at: data.publishStartAt,
    publish_end_at: data.publishEndAt || null,
    status: publishStatus(data.isPublished),
  }
}

export function agendaFromApi(item: ApiRecord): AgendaFormData {
  const date = item.date ? String(item.date) : ''
  const time = item.time ? String(item.time) : ''
  const endDate = item.end_date ? String(item.end_date) : undefined
  return {
    title: String(item.title ?? ''),
    slug: String(item.slug ?? ''),
    description: item.description ? String(item.description) : undefined,
    startDate: time ? `${date}T${time}` : date,
    endDate,
    location: item.location ? String(item.location) : undefined,
    image: item.thumbnail ? String(item.thumbnail) : undefined,
    publishStartAt: toDatetimeLocal(item.publish_start_at),
    publishEndAt: toDatetimeLocal(item.publish_end_at),
    isPublished: isPublishedStatus(item.status),
  }
}

export function galleryToApi(data: GalleryFormData) {
  const album = (data.albumImages ?? []).filter((url) => url && url !== data.coverImage)

  return {
    title: data.title,
    description: data.description,
    cover_image: data.coverImage,
    images: album.length ? album : data.coverImage ? [data.coverImage] : [],
    sort_order: data.order ?? 0,
    status: publishStatus(data.isPublished),
  }
}

export function galleryFromApi(item: ApiRecord): GalleryFormData {
  const images = (item.images as string[] | undefined) ?? []
  const cover = String(item.cover_image ?? images[0] ?? '')
  const albumImages = images.filter((url) => url !== cover)

  return {
    title: String(item.title ?? ''),
    description: item.description ? String(item.description) : undefined,
    coverImage: cover,
    albumImages,
    category: 'general',
    isPublished: isPublishedStatus(item.status),
    order: Number(item.sort_order ?? 0),
  }
}

export function testimonialToApi(data: TestimonialFormData) {
  return {
    name: data.name,
    occupation: data.role,
    comment: data.content,
    photo: data.photo,
    rating: data.rating,
    sort_order: data.order ?? 0,
    status: publishStatus(data.isPublished),
  }
}

export function testimonialFromApi(item: ApiRecord): TestimonialFormData {
  return {
    name: String(item.name ?? ''),
    role: String(item.occupation ?? ''),
    content: String(item.comment ?? ''),
    photo: item.photo ? String(item.photo) : undefined,
    rating: Number(item.rating ?? 5),
    isPublished: isPublishedStatus(item.status),
    order: Number(item.sort_order ?? 0),
  }
}

export function activityToApi(data: ActivityFormData) {
  return {
    title: data.title,
    description: data.description,
    image: data.image,
    date: data.date,
    sort_order: 0,
    status: publishStatus(data.isPublished),
  }
}

export function activityFromApi(item: ApiRecord): ActivityFormData {
  return {
    title: String(item.title ?? ''),
    description: String(item.description ?? ''),
    image: item.image ? String(item.image) : undefined,
    date: item.date ? String(item.date) : '',
    category: 'general',
    isPublished: isPublishedStatus(item.status),
  }
}

export function facilityToApi(data: FacilityFormData) {
  return {
    title: data.name,
    description: data.description,
    image: data.image,
    icon: data.icon,
    sort_order: data.order ?? 0,
    status: publishStatus(data.isPublished),
  }
}

export function facilityFromApi(item: ApiRecord): FacilityFormData {
  return {
    name: String(item.title ?? ''),
    description: String(item.description ?? ''),
    image: item.image ? String(item.image) : undefined,
    icon: item.icon ? String(item.icon) : undefined,
    isPublished: isPublishedStatus(item.status),
    order: Number(item.sort_order ?? 0),
  }
}

export function achievementToApi(data: AchievementFormData) {
  return {
    title: data.title,
    description: data.description,
    year: data.year,
    category: data.category,
    image: data.image,
    sort_order: 0,
    status: publishStatus(data.isPublished),
  }
}

export function achievementFromApi(item: ApiRecord): AchievementFormData {
  return {
    title: String(item.title ?? ''),
    description: String(item.description ?? ''),
    year: Number(item.year ?? new Date().getFullYear()),
    category: String(item.category ?? 'general'),
    image: item.image ? String(item.image) : undefined,
    isPublished: isPublishedStatus(item.status),
  }
}

export function newsToApi(data: NewsFormData) {
  const publishStart = data.publishStartAt ?? data.publishedAt
  return {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    thumbnail: data.coverImage,
    published_at: publishStart,
    publish_start_at: publishStart,
    publish_end_at: data.publishEndAt || null,
    status: publishStatus(data.isPublished),
  }
}

export function newsFromApi(item: ApiRecord): NewsFormData {
  return {
    title: String(item.title ?? ''),
    slug: String(item.slug ?? ''),
    excerpt: String(item.excerpt ?? ''),
    content: String(item.content ?? ''),
    coverImage: item.thumbnail ? String(item.thumbnail) : undefined,
    author: item.author ? String(item.author) : undefined,
    publishedAt: toDatetimeLocal(item.published_at ?? item.publish_start_at),
    publishStartAt: toDatetimeLocal(item.publish_start_at ?? item.published_at),
    publishEndAt: toDatetimeLocal(item.publish_end_at),
    isPublished: isPublishedStatus(item.status),
    tags: [],
  }
}

export function userToApi(data: UserFormData, roleName?: string) {
  return {
    name: data.name,
    email: data.email,
    password: data.password,
    avatar: data.avatar || undefined,
    status: data.isActive ? 'active' : 'inactive',
    roles: roleName ? [roleName] : undefined,
  }
}

export function userFromApi(item: ApiRecord): UserFormData {
  const roles = item.roles as string[] | undefined
  return {
    name: String(item.name ?? ''),
    email: String(item.email ?? ''),
    roleId: roles?.[0] ?? '',
    avatar: item.avatar ? String(item.avatar) : undefined,
    isActive: item.status === 'active',
    password: undefined,
  }
}

export function customPageToApi(data: CustomPageFormData) {
  return {
    title: data.title,
    slug: data.slug,
    content: data.content,
    meta_title: data.metaTitle,
    meta_description: data.metaDescription,
    publish_start_at: data.publishStartAt,
    publish_end_at: data.publishEndAt || null,
    sort_order: data.order ?? 0,
    status: publishStatus(data.isPublished),
  }
}

export function customPageFromApi(item: ApiRecord): CustomPageFormData {
  return {
    title: String(item.title ?? ''),
    slug: item.slug ? String(item.slug) : undefined,
    content: String(item.content ?? ''),
    metaTitle: item.meta_title ? String(item.meta_title) : undefined,
    metaDescription: item.meta_description ? String(item.meta_description) : undefined,
    publishStartAt: toDatetimeLocal(item.publish_start_at),
    publishEndAt: toDatetimeLocal(item.publish_end_at),
    isPublished: isPublishedStatus(item.status),
    order: Number(item.sort_order ?? 0),
  }
}

export function academicEventToApi(data: AcademicEventFormData) {
  return {
    title: data.title,
    slug: data.slug,
    description: data.description,
    event_type: data.eventType || 'activity',
    start_date: data.startDate,
    end_date: data.endDate || null,
    color: data.color,
    sort_order: data.order ?? 0,
    status: publishStatus(data.isPublished),
  }
}

export function academicEventFromApi(item: ApiRecord): AcademicEventFormData {
  return {
    title: String(item.title ?? ''),
    slug: item.slug ? String(item.slug) : undefined,
    description: item.description ? String(item.description) : undefined,
    eventType: item.event_type ? String(item.event_type) : undefined,
    startDate: item.start_date ? String(item.start_date) : '',
    endDate: item.end_date ? String(item.end_date) : undefined,
    color: item.color ? String(item.color) : undefined,
    isPublished: isPublishedStatus(item.status),
    order: Number(item.sort_order ?? 0),
  }
}

export function downloadDocumentToApi(data: DownloadDocumentFormData) {
  return {
    title: data.title,
    slug: data.slug,
    description: data.description,
    file_path: data.filePath,
    category: data.category || 'general',
    sort_order: data.order ?? 0,
    status: publishStatus(data.isPublished),
  }
}

export function downloadDocumentFromApi(item: ApiRecord): DownloadDocumentFormData {
  return {
    title: String(item.title ?? ''),
    slug: item.slug ? String(item.slug) : undefined,
    description: item.description ? String(item.description) : undefined,
    filePath: String(item.file_path ?? item.file_url ?? ''),
    category: item.category ? String(item.category) : undefined,
    isPublished: isPublishedStatus(item.status),
    order: Number(item.sort_order ?? 0),
  }
}

export function faqToApi(data: FaqFormData) {
  return {
    question: data.question,
    answer: data.answer,
    category: data.category || 'general',
    sort_order: data.order ?? 0,
    status: publishStatus(data.isPublished),
  }
}

export function faqFromApi(item: ApiRecord): FaqFormData {
  return {
    question: String(item.question ?? ''),
    answer: String(item.answer ?? ''),
    category: item.category ? String(item.category) : undefined,
    isPublished: isPublishedStatus(item.status),
    order: Number(item.sort_order ?? 0),
  }
}

export function extracurricularToApi(data: ExtracurricularFormData) {
  return {
    title: data.title,
    slug: data.slug,
    description: data.description,
    image: data.image,
    schedule: data.schedule,
    coach: data.coach,
    members: data.members,
    sort_order: data.order ?? 0,
    status: publishStatus(data.isPublished),
  }
}

export function extracurricularFromApi(item: ApiRecord): ExtracurricularFormData {
  return {
    title: String(item.title ?? ''),
    slug: item.slug ? String(item.slug) : undefined,
    description: item.description ? String(item.description) : undefined,
    image: item.image ? String(item.image) : item.image_url ? String(item.image_url) : undefined,
    schedule: item.schedule ? String(item.schedule) : undefined,
    coach: item.coach ? String(item.coach) : undefined,
    members: (item.members as string[] | undefined) ?? [],
    isPublished: isPublishedStatus(item.status),
    order: Number(item.sort_order ?? 0),
  }
}

export function webhookToApi(data: WebhookFormData) {
  return {
    name: data.name,
    url: data.url,
    events: data.events,
    secret: data.secret,
    is_active: data.isActive,
  }
}

export function webhookFromApi(item: ApiRecord): WebhookFormData {
  return {
    name: String(item.name ?? ''),
    url: String(item.url ?? ''),
    events: (item.events as string[] | undefined) ?? [],
    secret: item.secret ? String(item.secret) : undefined,
    isActive: Boolean(item.is_active),
  }
}

export function apiTokenToApi(data: ApiTokenFormData) {
  return {
    name: data.name,
    abilities: data.abilities,
    is_active: data.isActive,
  }
}

export function apiTokenFromApi(item: ApiRecord): ApiTokenFormData {
  return {
    name: String(item.name ?? ''),
    abilities: (item.abilities as string[] | undefined) ?? [],
    isActive: Boolean(item.is_active),
  }
}

export function tenantToApi(data: TenantFormData) {
  return {
    name: data.name,
    slug: data.slug,
    domain: data.domain,
    is_active: data.isActive,
  }
}

export function tenantFromApi(item: ApiRecord): TenantFormData {
  return {
    name: String(item.name ?? ''),
    slug: item.slug ? String(item.slug) : undefined,
    domain: item.domain ? String(item.domain) : undefined,
    isActive: Boolean(item.is_active),
  }
}
