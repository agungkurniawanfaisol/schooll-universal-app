import { endpoints } from '@/api/endpoints'
import { mapAgendaListRow } from '@/api/mappers'
import { CmsListPage } from '@/components/common/CmsListPage'
import { formatDate } from '@/api/utils'
import type { DataTableColumn } from '@/components/common/DataTable'
import type { ListRow } from '@/api/mappers'

const publishPeriodColumn: DataTableColumn<ListRow> = {
  key: 'publish_start_at',
  header: 'Periode Tampil',
  cardPriority: 3,
  render: (item) => {
    const start = item.publishStartAt ? formatDate(item.publishStartAt) : '-'
    const end = item.publishEndAt ? formatDate(item.publishEndAt) : '∞'
    return `${start} → ${end}`
  },
}

export function AgendaListPage() {
  return (
    <CmsListPage
      title="Kelola Agenda"
      description="Daftar agenda kegiatan sekolah"
      breadcrumbLabel="Agenda"
      basePath="/dashboard/agenda"
      queryKey="agendas"
      listUrl={endpoints.agendas.list}
      bulkDeleteUrl={endpoints.agendas.bulkDelete}
      deleteUrl={endpoints.agendas.delete}
      mapper={mapAgendaListRow}
      extraColumns={[publishPeriodColumn]}
      enableDateFilter
    />
  )
}
