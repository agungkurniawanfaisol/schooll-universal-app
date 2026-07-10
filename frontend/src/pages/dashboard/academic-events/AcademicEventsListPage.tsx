import { endpoints } from '@/api/endpoints'
import { mapAcademicEventListRow } from '@/api/mappers'
import { CmsListPage } from '@/components/common/CmsListPage'

export function AcademicEventsListPage() {
  return (
    <CmsListPage
      title="Kelola Kalender Akademik"
      description="Daftar kegiatan dan jadwal akademik"
      breadcrumbLabel="Kalender Akademik"
      basePath="/dashboard/academic-events"
      queryKey="academic-events"
      listUrl={endpoints.academicEvents.list}
      bulkDeleteUrl={endpoints.academicEvents.bulkDelete}
      deleteUrl={endpoints.academicEvents.delete}
      mapper={mapAcademicEventListRow}
    />
  )
}
