import { endpoints } from '@/api/endpoints'
import { mapAchievementListRow } from '@/api/mappers'
import { CmsListPage } from '@/components/common/CmsListPage'

export function AchievementsListPage() {
  return (
    <CmsListPage
      title="Kelola Prestasi"
      description="Daftar prestasi sekolah"
      breadcrumbLabel="Prestasi"
      basePath="/dashboard/achievements"
      queryKey="achievements"
      listUrl={endpoints.achievements.list}
      bulkDeleteUrl={endpoints.achievements.bulkDelete}
      deleteUrl={endpoints.achievements.delete}
      mapper={mapAchievementListRow}
    />
  )
}
