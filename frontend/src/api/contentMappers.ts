import type { HeroStat } from '@/hooks/useSettingsApi'
import type { ApiRecord } from '@/api/utils'
import { isPublishedStatus, publishStatus } from '@/api/utils'

export function parseSettingText(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'text' in value) {
    return String((value as { text: unknown }).text ?? fallback)
  }
  return fallback
}

export function parseSettingUrl(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'url' in value) {
    const url = (value as { url: unknown }).url
    return url ? String(url) : fallback
  }
  return fallback
}

export function parseSettingBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value
  if (value && typeof value === 'object' && 'enabled' in value) {
    return Boolean((value as { enabled: unknown }).enabled)
  }
  return fallback
}

export function mapWebsiteSettings(items: ApiRecord[]): {
  schoolName: string
  schoolTagline: string
  schoolLogo: string
  ppdbUrl: string
  splashScreenEnabled: boolean
  heroStats: HeroStat[]
} {
  const byKey = Object.fromEntries(items.map((item) => [String(item.key), item.value]))
  const stats = byKey.hero_stats as HeroStat[] | undefined

  return {
    schoolName: parseSettingText(byKey.school_name),
    schoolTagline: parseSettingText(byKey.school_tagline),
    schoolLogo: parseSettingUrl(byKey.school_logo),
    ppdbUrl: parseSettingUrl(byKey.ppdb_url),
    splashScreenEnabled: parseSettingBoolean(byKey.splash_screen_enabled, true),
    heroStats: stats?.length
      ? stats
      : [
          { label: 'Siswa Aktif', value: 900, suffix: '+' },
          { label: 'Guru Profesional', value: 40, suffix: '+' },
          { label: 'Prestasi Nasional', value: 20, suffix: '+' },
          { label: 'Tingkat Kelulusan', value: 98, suffix: '%' },
        ],
  }
}

export function toPublishedStatus(isPublished: boolean): 'published' | 'draft' {
  return publishStatus(isPublished)
}

export function fromPublishedStatus(status: unknown): boolean {
  return isPublishedStatus(status)
}
