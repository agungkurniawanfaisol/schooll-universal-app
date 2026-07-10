import { endpoints } from '@/api/endpoints'
import { mapWebhookListRow } from '@/api/mappers'
import { CmsListPage } from '@/components/common/CmsListPage'

export function WebhooksListPage() {
  return (
    <CmsListPage
      title="Kelola Webhooks"
      description="Daftar webhook integrasi eksternal"
      breadcrumbLabel="Webhooks"
      basePath="/dashboard/webhooks"
      queryKey="webhooks"
      listUrl={endpoints.webhooks.list}
      deleteUrl={endpoints.webhooks.delete}
      mapper={mapWebhookListRow}
    />
  )
}
