import { Download, Upload } from 'lucide-react'
import { useRef } from 'react'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { mapTeacherListRow } from '@/api/mappers'
import { CmsListPage } from '@/components/common/CmsListPage'
import { Button } from '@/components/ui/button'
import { useNotificationStore } from '@/stores/notificationStore'

export function TeachersListPage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const { success, error } = useNotificationStore()

  const handleExport = async () => {
    const response = await apiClient.get(endpoints.teachers.export, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = `teachers-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const handleImport = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await apiClient.post(endpoints.teachers.import, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const imported = response.data?.data?.imported ?? 0
      success(`Berhasil mengimpor ${imported} guru`)
    } catch {
      error('Gagal', 'Import CSV gagal')
    }
  }

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleImport(file)
          e.target.value = ''
        }}
      />
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
        headerActions={
          <>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => void handleExport()}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Import CSV
            </Button>
          </>
        }
      />
    </>
  )
}
