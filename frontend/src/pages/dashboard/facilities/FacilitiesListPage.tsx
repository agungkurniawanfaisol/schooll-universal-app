import { endpoints } from '@/api/endpoints'
import { mapFacilityListRow } from '@/api/mappers'
import { CmsListPage } from '@/components/common/CmsListPage'

export function FacilitiesListPage() {
  return (
    <CmsListPage
      title="Kelola Fasilitas"
      description="Daftar fasilitas sekolah"
      breadcrumbLabel="Fasilitas"
      basePath="/dashboard/facilities"
      queryKey="facilities"
      listUrl={endpoints.facilities.list}
      bulkDeleteUrl={endpoints.facilities.bulkDelete}
      deleteUrl={endpoints.facilities.delete}
      mapper={mapFacilityListRow}
    />
  )
}
