import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Eye } from 'lucide-react'
import { useState } from 'react'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { type ApiRecord, formatDate } from '@/api/utils'
import { BackButton } from '@/components/common/BackButton'
import { DataTable, type DataTableColumn } from '@/components/common/DataTable'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { SEOHead } from '@/components/common/SEOHead'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { usePaginatedList } from '@/hooks/usePaginatedList'
import { useNotificationStore } from '@/stores/notificationStore'

interface PpdbRow {
  id: string
  title: string
  registrationNumber: string
  studentName: string
  parentName: string
  parentPhone: string
  status: string
  createdAt: string
}

function mapPpdbRow(item: ApiRecord): PpdbRow {
  return {
    id: String(item.id),
    title: String(item.student_name ?? '-'),
    registrationNumber: String(item.registration_number ?? ''),
    studentName: String(item.student_name ?? ''),
    parentName: String(item.parent_name ?? ''),
    parentPhone: String(item.parent_phone ?? ''),
    status: String(item.status ?? 'pending'),
    createdAt: String(item.created_at ?? ''),
  }
}

const statusLabels: Record<string, string> = {
  pending: 'Menunggu',
  approved: 'Diterima',
  rejected: 'Ditolak',
}

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'success'> = {
  pending: 'default',
  approved: 'success',
  rejected: 'destructive',
}

export function PpdbListPage() {
  const queryClient = useQueryClient()
  const { success, error } = useNotificationStore()
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [newStatus, setNewStatus] = useState('pending')
  const [adminNotes, setAdminNotes] = useState('')

  const {
    items,
    meta,
    isLoading,
    page,
    perPage,
    search,
    setPage,
    setSearch,
  } = usePaginatedList<PpdbRow>({
    queryKey: `ppdb-${statusFilter}`,
    listUrl: endpoints.ppdb.list,
    mapper: mapPpdbRow,
    initialPerPage: 15,
    extraParams: statusFilter !== 'all' ? { status: statusFilter } : undefined,
  })

  const { data: detail, isLoading: detailLoading } = useQuery({
    queryKey: ['ppdb', 'detail', selectedId],
    queryFn: async () => {
      const response = await apiClient.get(endpoints.ppdb.detail(selectedId!))
      return response.data.data as ApiRecord
    },
    enabled: Boolean(selectedId),
  })

  const statusMutation = useMutation({
    mutationFn: async () => {
      await apiClient.patch(endpoints.ppdb.updateStatus(selectedId!), {
        status: newStatus,
        admin_notes: adminNotes || undefined,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ppdb'] })
      success('Status PPDB diperbarui')
      setSelectedId(null)
    },
    onError: () => error('Gagal', 'Tidak dapat memperbarui status'),
  })

  const columns: DataTableColumn<PpdbRow>[] = [
    {
      key: 'registration_number',
      header: 'No. Pendaftaran',
      cardPrimary: true,
      render: (row) => (
        <div>
          <p className="font-medium">{row.registrationNumber}</p>
          <p className="text-xs text-muted-foreground">{row.studentName}</p>
        </div>
      ),
    },
    {
      key: 'parent',
      header: 'Orang Tua',
      render: (row) => (
        <div>
          <p>{row.parentName}</p>
          <p className="text-xs text-muted-foreground">{row.parentPhone}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cardPriority: 1,
      render: (row) => (
        <Badge variant={statusVariants[row.status] ?? 'secondary'}>
          {statusLabels[row.status] ?? row.status}
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setSelectedId(row.id)
            setNewStatus(row.status)
            setAdminNotes('')
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <>
      <SEOHead title="PPDB" noIndex />
      <div className="space-y-6">
        <PageHeader
          title="Pendaftaran PPDB"
          backTo="/dashboard"
          backLabel="Kembali ke Dashboard"
          description="Kelola pendaftaran siswa baru"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'PPDB' },
          ]}
        />

        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setStatusFilter(status)
                setPage(1)
              }}
            >
              {status === 'all' ? 'Semua' : (statusLabels[status] ?? status)}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <DataTable<PpdbRow>
            columns={columns}
            data={items}
            totalItems={meta?.total ?? 0}
            page={page}
            perPage={perPage}
            onPageChange={setPage}
            searchValue={search}
            onSearchChange={setSearch}
            loading={isLoading}
            searchPlaceholder="Cari pendaftaran..."
          />
        )}

        {selectedId && (
          <Card className="border-none shadow-soft">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold">Detail Pendaftaran</h3>
                <BackButton label="Kembali ke Daftar" onBack={() => setSelectedId(null)} />
              </div>

              {detailLoading ? (
                <LoadingSpinner />
              ) : detail ? (
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <p>
                    <span className="text-muted-foreground">No. Pendaftaran:</span>{' '}
                    {String(detail.registration_number)}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Nama Siswa:</span>{' '}
                    {String(detail.student_name)}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Orang Tua:</span>{' '}
                    {String(detail.parent_name)}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Telepon:</span>{' '}
                    {String(detail.parent_phone)}
                  </p>
                  {detail.parent_email ? (
                    <p>
                      <span className="text-muted-foreground">Email:</span>{' '}
                      {String(detail.parent_email)}
                    </p>
                  ) : null}
                  {detail.address ? (
                    <p className="sm:col-span-2">
                      <span className="text-muted-foreground">Alamat:</span>{' '}
                      {String(detail.address)}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="space-y-3 border-t border-border pt-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Menunggu</SelectItem>
                      <SelectItem value="approved">Diterima</SelectItem>
                      <SelectItem value="rejected">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Catatan Admin</Label>
                  <Textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Catatan internal (opsional)"
                  />
                </div>
                <Button
                  variant="gradient"
                  disabled={statusMutation.isPending}
                  onClick={() => statusMutation.mutate()}
                >
                  {statusMutation.isPending ? 'Menyimpan...' : 'Perbarui Status'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
