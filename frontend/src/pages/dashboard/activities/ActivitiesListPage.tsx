import { endpoints } from '@/api/endpoints'
import { mapActivityListRow } from '@/api/mappers'
import { CmsListPage } from '@/components/common/CmsListPage'

export function ActivitiesListPage() {
  return (
    <CmsListPage
      title="Kelola Kegiatan"
      description="Daftar kegiatan sekolah"
      breadcrumbLabel="Kegiatan"
      basePath="/dashboard/activities"
      queryKey="activities"
      listUrl={endpoints.activities.list}
      bulkDeleteUrl={endpoints.activities.bulkDelete}
      deleteUrl={endpoints.activities.delete}
      mapper={mapActivityListRow}
    />
  )
}
