import { Download, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { type ApiRecord, formatDate } from '@/api/utils'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { DataTable, type DataTableColumn } from '@/components/common/DataTable'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { SEOHead } from '@/components/common/SEOHead'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { usePaginatedList } from '@/hooks/usePaginatedList'
import { useNotificationStore } from '@/stores/notificationStore'

interface SubscriberRow {
  id: string
  title: string
  email: string
  name: string
  isActive: boolean
  createdAt: string
}

function mapSubscriberRow(item: ApiRecord): SubscriberRow {
  return {
    id: String(item.id),
    title: String(item.email ?? '-'),
    email: String(item.email ?? ''),
    name: String(item.name ?? '-'),
    isActive: Boolean(item.is_active),
    createdAt: String(item.subscribed_at ?? item.created_at ?? ''),
  }
}

export function NewsletterSubscribersPage() {
  const { success } = useNotificationStore()
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
  } = usePaginatedList<SubscriberRow>({
    queryKey: 'newsletter-subscribers',
    listUrl: endpoints.newsletter.subscribers,
    mapper: mapSubscriberRow,
  })

  const handleExport = async () => {
    const response = await apiClient.get(endpoints.newsletter.export, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
    success('Export berhasil')
  }

  const columns: DataTableColumn<SubscriberRow>[] = [
    {
      key: 'email',
      header: 'Email',
      cardPrimary: true,
      render: (row) => (
        <div>
          <p className="font-medium">{row.email}</p>
          {row.name !== '-' ? (
            <p className="text-xs text-muted-foreground">{row.name}</p>
          ) : null}
        </div>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      cardPriority: 1,
      render: (row) => (
        <Badge variant={row.isActive ? 'success' : 'secondary'}>
          {row.isActive ? 'Aktif' : 'Nonaktif'}
        </Badge>
      ),
    },
    {
      key: 'subscribed_at',
      header: 'Berlangganan',
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'actions',
      header: '',
      cardHidden: true,
      render: (row) => (
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
      ),
    },
  ]

  return (
    <>
      <SEOHead title="Newsletter" noIndex />
      <div className="space-y-6">
        <PageHeader
          title="Newsletter"
          backTo="/dashboard"
          backLabel="Kembali ke Dashboard"
          description="Daftar pelanggan newsletter"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Newsletter' },
          ]}
          actions={
            <Button variant="outline" onClick={() => void handleExport()}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          }
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <DataTable<SubscriberRow>
            columns={columns}
            data={items}
            totalItems={meta?.total ?? 0}
            page={page}
            perPage={perPage}
            onPageChange={setPage}
            searchValue={search}
            onSearchChange={setSearch}
            loading={isLoading}
            searchPlaceholder="Cari email..."
          />
        )}

        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Hapus pelanggan?"
          variant="destructive"
          onConfirm={async () => {
            if (deleteId) {
              await deleteItem(endpoints.newsletter.delete(deleteId))
              setDeleteId(null)
            }
          }}
          loading={isDeleting}
        />
      </div>
    </>
  )
}
