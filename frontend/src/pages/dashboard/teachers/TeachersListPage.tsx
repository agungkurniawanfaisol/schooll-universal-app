import { endpoints } from '@/api/endpoints'
import { mapTeacherListRow } from '@/api/mappers'
import { CmsListPage } from '@/components/common/CmsListPage'

export function TeachersListPage() {
  return (
    <CmsListPage
      title="Kelola Guru"
      description="Daftar guru website sekolah"
      breadcrumbLabel="Guru"
      basePath="/dashboard/teachers"
      queryKey="teachers"
      listUrl={endpoints.teachers.list}
      bulkDeleteUrl={endpoints.teachers.bulkDelete}
      deleteUrl={endpoints.teachers.delete}
      mapper={mapTeacherListRow}
    />
  )
}
