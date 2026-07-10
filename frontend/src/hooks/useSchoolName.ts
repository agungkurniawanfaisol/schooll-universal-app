import { DEFAULT_SCHOOL_NAME } from '@/config/schoolDefaults'
import { useLandingData } from '@/hooks/useApiQueries'
import { useGeneralSettings } from '@/hooks/useSettingsApi'
import { useAuthStore } from '@/stores/authStore'

/** Resolves the current school name from settings API (admin) or public landing data. */
export function useSchoolName(override?: string): string {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const { data: generalSettings } = useGeneralSettings({ enabled: isAuthenticated })
  const { data: landingData } = useLandingData()

  if (override) return override

  if (generalSettings?.schoolName) {
    return generalSettings.schoolName
  }

  const landingName = landingData?.settings?.school_name
  if (landingName) {
    return String(landingName)
  }

  return DEFAULT_SCHOOL_NAME
}
