import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { DateRangeFilter } from '@/components/common/DateRangeFilter'
import { DefaultCardActions } from '@/components/common/DataTableCardList'
import { DataTable, type DataTableColumn } from '@/components/common/DataTable'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { SEOHead } from '@/components/common/SEOHead'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/api/utils'
import type { ListRow } from '@/api/mappers'
import { usePaginatedList } from '@/hooks/usePaginatedList'
import { useNotificationStore } from '@/stores/notificationStore'

interface CmsListPageProps<T extends ListRow> {
  title: string
  description: string
  breadcrumbLabel: string
  basePath: string
  queryKey: string
  listUrl: string
  bulkDeleteUrl?: string
  deleteUrl: (id: string) => string
  mapper: (item: Record<string, unknown>) => T
  extraColumns?: DataTableColumn<T>[]
  enableDateFilter?: boolean
}

export function CmsListPage<T extends ListRow>({
  title,
  description,
  breadcrumbLabel,
  basePath,
  queryKey,
  listUrl,
  bulkDeleteUrl,
  deleteUrl,
  mapper,
  extraColumns = [],
  enableDateFilter = false,
}: CmsListPageProps<T>) {
  const { success } = useNotificationStore()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string[]>([])

  const {
    items,
    meta,
    isLoading,
    page,
    perPage,
    search,
    sortBy,
    sortOrder,
    dateFrom,
    dateTo,
    selectedIds,
    setPage,
    setSearch,
    setDateFrom,
    setDateTo,
    setSelectedIds,
    handleSortChange,
    deleteItem,
    bulkDelete,
    isDeleting,
  } = usePaginatedList({
    queryKey,
    listUrl,
    bulkDeleteUrl,
    mapper,
  })

  const columns: DataTableColumn<T>[] = [
    ...extraColumns,
    {
      key: 'title',
      header: 'Judul',
      sortable: true,
      cardPrimary: true,
      render: (item) => item.title,
    },
    {
      key: 'status',
      header: 'Status',
      cardPriority: 1,
      render: (item) => (
        <Badge variant={item.isPublished ? 'success' : 'secondary'}>
          {item.isPublished ? 'Publik' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Dibuat',
      sortable: true,
      cardPriority: 2,
      render: (item) => formatDate(item.createdAt),
    },
    {
      key: 'actions',
      header: 'Aksi',
      cardHidden: true,
      render: (item) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`${basePath}/${item.id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setDeleteTarget([item.id])
              setDeleteOpen(true)
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
      cardRender: (item) => (
        <DefaultCardActions
          editHref={`${basePath}/${item.id}/edit`}
          onDelete={() => {
            setDeleteTarget([item.id])
            setDeleteOpen(true)
          }}
        />
      ),
    },
  ]

  const handleConfirmDelete = async () => {
    if (deleteTarget.length === 0) return
    if (deleteTarget.length === 1) {
      await deleteItem(deleteUrl(deleteTarget[0]!))
    } else if (bulkDeleteUrl) {
      await bulkDelete(deleteTarget)
    }
    success('Berhasil dihapus')
    setDeleteOpen(false)
    setDeleteTarget([])
    setSelectedIds([])
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <>
      <SEOHead title={title} noIndex />
      <div className="space-y-6">
        <PageHeader
          title={title}
          description={description}
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: breadcrumbLabel },
          ]}
          actions={
            <Button variant="gradient" className="w-full sm:w-auto" asChild>
              <Link to={`${basePath}/new`}>
                <Plus className="h-4 w-4" />
                Tambah {breadcrumbLabel}
              </Link>
            </Button>
          }
        />
        {enableDateFilter ? (
          <DateRangeFilter
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={(value) => {
              setDateFrom(value)
              setPage(1)
            }}
            onDateToChange={(value) => {
              setDateTo(value)
              setPage(1)
            }}
            onClear={() => {
              setDateFrom('')
              setDateTo('')
              setPage(1)
            }}
          />
        ) : null}
        <DataTable
          data={items}
          columns={columns}
          totalItems={meta?.total ?? 0}
          page={page}
          perPage={perPage}
          onPageChange={setPage}
          searchValue={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          loading={isLoading}
          bulkActions={
            bulkDeleteUrl
              ? [
                  {
                    label: 'Hapus',
                    variant: 'destructive',
                    onClick: (ids) => {
                      setDeleteTarget(ids)
                      setDeleteOpen(true)
                    },
                  },
                ]
              : undefined
          }
        />
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title={`Hapus ${breadcrumbLabel}?`}
          description="Tindakan ini tidak dapat dibatalkan."
          confirmLabel={isDeleting ? 'Menghapus...' : 'Hapus'}
          variant="destructive"
          onConfirm={handleConfirmDelete}
        />
      </div>
    </>
  )
}
