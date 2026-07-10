import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2, Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { mapMediaListRow } from '@/api/mappers'
import { parsePaginatedResponse, type PaginatedResult } from '@/api/utils'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { ImageUploader } from '@/components/common/ImageUploader'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { SEOHead } from '@/components/common/SEOHead'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useNotificationStore } from '@/stores/notificationStore'

type MediaRow = ReturnType<typeof mapMediaListRow>

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function MediaManagerPage() {
  const queryClient = useQueryClient()
  const { success, error } = useNotificationStore()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useQuery<PaginatedResult<MediaRow>>({
    queryKey: ['media'],
    queryFn: async () => {
      const response = await apiClient.get(endpoints.media.list, {
        params: { per_page: 50 },
      })
      return parsePaginatedResponse<MediaRow>(response, mapMediaListRow)
    },
  })

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      await apiClient.post(endpoints.media.upload, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] })
      success('Upload berhasil', 'File media berhasil diunggah.')
    },
    onError: () => error('Upload gagal', 'Gagal mengunggah file.'),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(endpoints.media.delete(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] })
      success('Dihapus', 'File media berhasil dihapus.')
      setDeleteOpen(false)
      setDeleteId(null)
    },
    onError: () => error('Gagal', 'Gagal menghapus file media.'),
  })

  const mediaItems = data?.items ?? []

  return (
    <>
      <SEOHead title="Media Manager" noIndex />
      <div className="space-y-6">
        <PageHeader
          title="Media Manager"
          description="Kelola file gambar dan media website"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Media' },
          ]}
        />
        <Card className="border-none shadow-soft">
          <CardContent className="p-6">
            <ImageUploader
              value=""
              onChange={() => undefined}
              onUpload={async (file) => {
                await uploadMutation.mutateAsync(file)
                return ''
              }}
              label="Upload file media (drag & drop)"
            />
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mediaItems.map((file) => (
              <Card key={file.id} className="group overflow-hidden border-none shadow-soft">
                <div className="flex aspect-square items-center justify-center overflow-hidden bg-muted">
                  {file.url && file.mimeType.startsWith('image/') ? (
                    <img src={file.url} alt={file.title} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <CardContent className="p-4">
                  <p className="truncate text-sm font-medium">{file.title}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 min-h-10 text-destructive"
                    onClick={() => {
                      setDeleteId(file.id)
                      setDeleteOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Hapus file?"
          variant="destructive"
          onConfirm={() => deleteId && deleteMutation.mutateAsync(deleteId)}
        />
      </div>
    </>
  )
}
