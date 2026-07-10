import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Eye, Mail, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { type ApiRecord } from '@/api/utils'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { DataTable, type DataTableColumn } from '@/components/common/DataTable'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { SEOHead } from '@/components/common/SEOHead'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/api/utils'
import { usePaginatedList } from '@/hooks/usePaginatedList'
import { useNotificationStore } from '@/stores/notificationStore'

interface ContactRow {
  id: string
  title: string
  email: string
  subject: string
  message: string
  isRead: boolean
  createdAt: string
}

function mapContactRow(item: ApiRecord): ContactRow {
  return {
    id: String(item.id),
    title: String(item.name ?? '-'),
    email: String(item.email ?? ''),
    subject: String(item.subject ?? '-'),
    message: String(item.message ?? ''),
    isRead: Boolean(item.is_read),
    createdAt: String(item.created_at ?? ''),
  }
}

export function ContactsListPage() {
  const queryClient = useQueryClient()
  const { success, error } = useNotificationStore()
  const [selected, setSelected] = useState<ContactRow | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const {
    items,
    meta,
    isLoading,
    page,
    perPage,
    search,
    setPage,
    setSearch,
    deleteItem,
    isDeleting,
  } = usePaginatedList<ContactRow>({
    queryKey: 'contacts',
    listUrl: endpoints.contacts.list,
    mapper: mapContactRow,
  })

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.patch(endpoints.contacts.markRead(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      success('Ditandai sudah dibaca')
    },
    onError: () => error('Gagal', 'Tidak dapat memperbarui status pesan'),
  })

  const columns: DataTableColumn<ContactRow>[] = [
    {
      key: 'title',
      header: 'Pengirim',
      cardPrimary: true,
      render: (row) => (
        <div>
          <p className="font-medium">{row.title}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subjek',
      render: (row) => row.subject,
    },
    {
      key: 'is_read',
      header: 'Status',
      cardPriority: 1,
      render: (row) => (
        <Badge variant={row.isRead ? 'secondary' : 'default'}>
          {row.isRead ? 'Dibaca' : 'Baru'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Tanggal',
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'actions',
      header: '',
      cardHidden: true,
      render: (row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setSelected(row)}>
            <Eye className="h-4 w-4" />
          </Button>
          {!row.isRead && (
            <Button variant="ghost" size="icon" onClick={() => markReadMutation.mutate(row.id)}>
              <Mail className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => {
              setDeleteId(row.id)
              setDeleteOpen(true)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <SEOHead title="Pesan Kontak" noIndex />
      <div className="space-y-6">
        <PageHeader
          title="Pesan Kontak"
          description="Kelola pesan dari formulir kontak website"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Pesan Kontak' },
          ]}
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <DataTable<ContactRow>
            columns={columns}
            data={items}
            totalItems={meta?.total ?? 0}
            page={page}
            perPage={perPage}
            onPageChange={setPage}
            searchValue={search}
            onSearchChange={setSearch}
            loading={isLoading}
            searchPlaceholder="Cari pesan..."
          />
        )}

        {selected && (
          <Card className="border-none shadow-soft">
            <CardContent className="space-y-3 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{selected.title}</h3>
                  <p className="text-sm text-muted-foreground">{selected.email}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelected(null)}>
                  Tutup
                </Button>
              </div>
              <p className="text-sm font-medium">{selected.subject}</p>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">{selected.message}</p>
              {!selected.isRead && (
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => {
                    markReadMutation.mutate(selected.id)
                    setSelected({ ...selected, isRead: true })
                  }}
                >
                  Tandai sudah dibaca
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Hapus pesan?"
          variant="destructive"
          onConfirm={async () => {
            if (deleteId) {
              await deleteItem(endpoints.contacts.delete(deleteId))
              setDeleteId(null)
              setSelected(null)
            }
          }}
          loading={isDeleting}
        />
      </div>
    </>
  )
}
