import { endpoints } from '@/api/endpoints'
import { mapApiTokenListRow } from '@/api/mappers'
import { CmsListPage } from '@/components/common/CmsListPage'

export function ApiTokensListPage() {
  return (
    <CmsListPage
      title="Kelola API Tokens"
      description="Daftar token akses API"
      breadcrumbLabel="API Tokens"
      basePath="/dashboard/api-tokens"
      queryKey="api-tokens"
      listUrl={endpoints.apiTokens.list}
      deleteUrl={endpoints.apiTokens.delete}
      mapper={mapApiTokenListRow}
    />
  )
}
