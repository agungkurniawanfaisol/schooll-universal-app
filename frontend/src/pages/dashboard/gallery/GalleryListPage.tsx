import { endpoints } from '@/api/endpoints'
import { mapGalleryListRow } from '@/api/mappers'
import { CmsListPage } from '@/components/common/CmsListPage'

export function GalleryListPage() {
  return (
    <CmsListPage
      title="Kelola Galeri"
      description="Daftar album galeri sekolah"
      breadcrumbLabel="Galeri"
      basePath="/dashboard/gallery"
      queryKey="galleries"
      listUrl={endpoints.galleries.list}
      bulkDeleteUrl={endpoints.galleries.bulkDelete}
      deleteUrl={endpoints.galleries.delete}
      mapper={mapGalleryListRow}
    />
  )
}
