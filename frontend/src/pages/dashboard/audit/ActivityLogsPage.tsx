import { endpoints } from '@/api/endpoints'
import { type ApiRecord, formatDate } from '@/api/utils'
import { DataTable, type DataTableColumn } from '@/components/common/DataTable'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { SEOHead } from '@/components/common/SEOHead'
import { usePaginatedList } from '@/hooks/usePaginatedList'

interface ActivityLogRow {
  id: string
  title: string
  action: string
  modelType: string
  userName: string
  createdAt: string
}

function mapActivityLogRow(item: ApiRecord): ActivityLogRow {
  const user = item.user as ApiRecord | undefined
  return {
    id: String(item.id),
    title: String(item.action ?? '-'),
    action: String(item.action ?? '-'),
    modelType: String(item.model_type ?? '-'),
    userName: user?.name ? String(user.name) : '-',
    createdAt: String(item.created_at ?? ''),
  }
}

export function ActivityLogsPage() {
  const { items, meta, isLoading, page, perPage, search, setPage, setSearch } =
    usePaginatedList<ActivityLogRow>({
      queryKey: 'activity-logs',
      listUrl: endpoints.activityLogs.list,
      mapper: mapActivityLogRow,
      initialPerPage: 20,
    })

  const columns: DataTableColumn<ActivityLogRow>[] = [
    {
      key: 'action',
      header: 'Aksi',
      cardPrimary: true,
      render: (row) => row.action,
    },
    {
      key: 'model_type',
      header: 'Model',
      render: (row) => row.modelType,
    },
    {
      key: 'user',
      header: 'Pengguna',
      render: (row) => row.userName,
    },
    {
      key: 'created_at',
      header: 'Waktu',
      render: (row) => formatDate(row.createdAt),
    },
  ]

  return (
    <>
      <SEOHead title="Audit Log" noIndex />
      <div className="space-y-6">
        <PageHeader
          title="Audit Log"
          backTo="/dashboard"
          backLabel="Kembali ke Dashboard"
          description="Riwayat aktivitas pengguna di sistem"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Audit Log' },
          ]}
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <DataTable<ActivityLogRow>
            columns={columns}
            data={items}
            totalItems={meta?.total ?? 0}
            page={page}
            perPage={perPage}
            onPageChange={setPage}
            searchValue={search}
            onSearchChange={setSearch}
            loading={isLoading}
            searchPlaceholder="Cari aktivitas..."
          />
        )}
      </div>
    </>
  )
}
