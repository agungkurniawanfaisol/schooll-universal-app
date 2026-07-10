import { useMutation } from '@tanstack/react-query'
import { Download, HardDrive } from 'lucide-react'
import { useState } from 'react'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { PageHeader } from '@/components/common/PageHeader'
import { SEOHead } from '@/components/common/SEOHead'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useNotificationStore } from '@/stores/notificationStore'
import type { ApiResponse } from '@/types/api'

export function BackupPage() {
  const { success, error } = useNotificationStore()
  const [backupPath, setBackupPath] = useState<string | null>(null)

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<ApiResponse<{ path: string }>>(
        endpoints.backup.create,
      )
      return response.data.data?.path ?? null
    },
    onSuccess: (path) => {
      setBackupPath(path)
      success('Backup berhasil dibuat')
    },
    onError: () => error('Gagal', 'Tidak dapat membuat backup'),
  })

  const handleDownload = async () => {
    try {
      const response = await apiClient.get(endpoints.backup.download, {
        params: backupPath ? { path: backupPath } : undefined,
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = `backup-${new Date().toISOString().slice(0, 10)}.zip`
      link.click()
      window.URL.revokeObjectURL(url)
      success('Download dimulai')
    } catch {
      error('Gagal', 'File backup tidak ditemukan')
    }
  }

  return (
    <>
      <SEOHead title="Backup" noIndex />
      <div className="space-y-6">
        <PageHeader
          title="Backup"
          backTo="/dashboard"
          backLabel="Kembali ke Dashboard"
          description="Buat dan unduh cadangan database"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Backup' },
          ]}
        />

        <Card className="max-w-xl border-none shadow-soft">
          <CardContent className="space-y-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <HardDrive className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Buat snapshot database terbaru. File backup dapat diunduh setelah proses selesai.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="gradient"
                disabled={createMutation.isPending}
                onClick={() => createMutation.mutate()}
              >
                {createMutation.isPending ? 'Membuat backup...' : 'Buat Backup'}
              </Button>
              <Button variant="outline" onClick={() => void handleDownload()}>
                <Download className="h-4 w-4" />
                Unduh Backup
              </Button>
            </div>
            {backupPath ? (
              <p className="text-xs text-muted-foreground">File: {backupPath}</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
