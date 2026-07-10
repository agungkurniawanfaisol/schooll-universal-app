import { endpoints } from '@/api/endpoints'
import { mapExtracurricularListRow } from '@/api/mappers'
import { CmsListPage } from '@/components/common/CmsListPage'

export function ExtracurricularsListPage() {
  return (
    <CmsListPage
      title="Kelola Ekstrakurikuler"
      description="Daftar kegiatan ekstrakurikuler sekolah"
      breadcrumbLabel="Ekstrakurikuler"
      basePath="/dashboard/extracurriculars"
      queryKey="extracurriculars"
      listUrl={endpoints.extracurriculars.list}
      bulkDeleteUrl={endpoints.extracurriculars.bulkDelete}
      deleteUrl={endpoints.extracurriculars.delete}
      mapper={mapExtracurricularListRow}
    />
  )
}
