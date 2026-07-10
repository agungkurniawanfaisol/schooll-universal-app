import { endpoints } from '@/api/endpoints'
import { mapUserListRow } from '@/api/mappers'
import { CmsListPage } from '@/components/common/CmsListPage'

export function UsersListPage() {
  return (
    <CmsListPage
      title="Kelola Pengguna"
      description="Daftar pengguna admin CMS"
      breadcrumbLabel="Pengguna"
      basePath="/dashboard/users"
      queryKey="users"
      listUrl={endpoints.users.list}
      bulkDeleteUrl={endpoints.users.bulkDelete}
      deleteUrl={endpoints.users.delete}
      mapper={mapUserListRow}
      extraColumns={[
        {
          key: 'email',
          header: 'Email',
          render: (item) => (item as ReturnType<typeof mapUserListRow>).email,
        },
      ]}
    />
  )
}
