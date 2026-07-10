import { endpoints } from '@/api/endpoints'
import { mapRoleListRow } from '@/api/mappers'
import { CmsListPage } from '@/components/common/CmsListPage'

export function RolesListPage() {
  return (
    <CmsListPage
      title="Kelola Role"
      description="Daftar role dan permission"
      breadcrumbLabel="Role"
      basePath="/dashboard/roles"
      queryKey="roles"
      listUrl={endpoints.roles.list}
      deleteUrl={endpoints.roles.delete}
      mapper={mapRoleListRow}
    />
  )
}
