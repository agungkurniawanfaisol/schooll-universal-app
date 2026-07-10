import { endpoints } from '@/api/endpoints'
import { mapCustomPageListRow } from '@/api/mappers'
import { CmsListPage } from '@/components/common/CmsListPage'

export function CustomPagesListPage() {
  return (
    <CmsListPage
      title="Kelola Halaman Kustom"
      description="Daftar halaman konten kustom website"
      breadcrumbLabel="Halaman Kustom"
      basePath="/dashboard/custom-pages"
      queryKey="custom-pages"
      listUrl={endpoints.customPages.list}
      bulkDeleteUrl={endpoints.customPages.bulkDelete}
      deleteUrl={endpoints.customPages.delete}
      mapper={mapCustomPageListRow}
    />
  )
}
