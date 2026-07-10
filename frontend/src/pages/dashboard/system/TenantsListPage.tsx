import { endpoints } from '@/api/endpoints'
import { mapTenantListRow } from '@/api/mappers'
import { CmsListPage } from '@/components/common/CmsListPage'

export function TenantsListPage() {
  return (
    <CmsListPage
      title="Kelola Tenants"
      description="Daftar tenant multi-sekolah"
      breadcrumbLabel="Tenants"
      basePath="/dashboard/tenants"
      queryKey="tenants"
      listUrl={endpoints.tenants.list}
      deleteUrl={endpoints.tenants.delete}
      mapper={mapTenantListRow}
    />
  )
}
