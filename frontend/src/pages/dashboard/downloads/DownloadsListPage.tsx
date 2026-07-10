import { endpoints } from '@/api/endpoints'
import { mapDownloadDocumentListRow } from '@/api/mappers'
import { CmsListPage } from '@/components/common/CmsListPage'

export function DownloadsListPage() {
  return (
    <CmsListPage
      title="Kelola Unduhan"
      description="Daftar dokumen unduhan website"
      breadcrumbLabel="Unduhan"
      basePath="/dashboard/downloads"
      queryKey="download-documents"
      listUrl={endpoints.downloadDocuments.list}
      bulkDeleteUrl={endpoints.downloadDocuments.bulkDelete}
      deleteUrl={endpoints.downloadDocuments.delete}
      mapper={mapDownloadDocumentListRow}
    />
  )
}
