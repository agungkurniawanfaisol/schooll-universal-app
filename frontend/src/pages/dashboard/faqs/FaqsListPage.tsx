import { endpoints } from '@/api/endpoints'
import { mapFaqListRow } from '@/api/mappers'
import { CmsListPage } from '@/components/common/CmsListPage'

export function FaqsListPage() {
  return (
    <CmsListPage
      title="Kelola FAQ"
      description="Daftar pertanyaan yang sering diajukan"
      breadcrumbLabel="FAQ"
      basePath="/dashboard/faqs"
      queryKey="faqs"
      listUrl={endpoints.faqs.list}
      bulkDeleteUrl={endpoints.faqs.bulkDelete}
      deleteUrl={endpoints.faqs.delete}
      mapper={mapFaqListRow}
    />
  )
}
