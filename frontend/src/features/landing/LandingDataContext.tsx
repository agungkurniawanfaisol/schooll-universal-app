import { createContext, useContext, type ReactNode } from 'react'

import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { DEFAULT_SCHOOL_NAME, DEFAULT_SCHOOL_TAGLINE } from '@/config/schoolDefaults'
import { useLandingData, type LandingData } from '@/hooks/useApiQueries'
import type { ApiRecord } from '@/api/utils'

export interface LandingSettings {
  schoolName: string
  schoolTagline: string
  schoolLogo: string
  ppdbUrl: string
  heroStats: Array<{ label: string; value: number; suffix: string }>
}

export interface LandingContextValue {
  data: LandingData | undefined
  settings: LandingSettings
  isLoading: boolean
  isError: boolean
}

const defaultSettings: LandingSettings = {
  schoolName: DEFAULT_SCHOOL_NAME,
  schoolTagline: DEFAULT_SCHOOL_TAGLINE,
  schoolLogo: '',
  ppdbUrl: '',
  heroStats: [
    { label: 'Siswa Aktif', value: 900, suffix: '+' },
    { label: 'Guru Profesional', value: 40, suffix: '+' },
    { label: 'Prestasi Nasional', value: 20, suffix: '+' },
    { label: 'Tingkat Kelulusan', value: 98, suffix: '%' },
  ],
}

const LandingDataContext = createContext<LandingContextValue | null>(null)

function parseSettings(raw: ApiRecord | undefined): LandingSettings {
  if (!raw) return defaultSettings

  const stats = raw.hero_stats as Array<{ label: string; value: number; suffix: string }> | undefined

  return {
    schoolName: String(raw.school_name ?? defaultSettings.schoolName),
    schoolTagline: String(raw.school_tagline ?? defaultSettings.schoolTagline),
    schoolLogo: String(raw.school_logo ?? defaultSettings.schoolLogo),
    ppdbUrl: String(raw.ppdb_url ?? defaultSettings.ppdbUrl),
    heroStats: stats?.length ? stats : defaultSettings.heroStats,
  }
}

export function LandingDataProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, isError } = useLandingData()
  const settings = parseSettings(data?.settings as ApiRecord | undefined)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-center text-muted-foreground">
        Gagal memuat konten website. Pastikan API backend berjalan.
      </div>
    )
  }

  return (
    <LandingDataContext.Provider value={{ data, settings, isLoading, isError }}>
      {children}
    </LandingDataContext.Provider>
  )
}

export function useLandingContext() {
  const ctx = useContext(LandingDataContext)
  if (!ctx) {
    throw new Error('useLandingContext must be used within LandingDataProvider')
  }
  return ctx
}

/** @deprecated Use useLandingContext().data */
export function useLandingContent() {
  return useLandingContext().data
}
