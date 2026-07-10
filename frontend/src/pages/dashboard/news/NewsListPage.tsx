import { endpoints } from '@/api/endpoints'
import { mapNewsListRow } from '@/api/mappers'
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

export function NewsListPage() {
  return (
    <CmsListPage
      title="Kelola Berita"
      description="Daftar berita sekolah"
      breadcrumbLabel="Berita"
      basePath="/dashboard/news"
      queryKey="news"
      listUrl={endpoints.news.list}
      bulkDeleteUrl={endpoints.news.bulkDelete}
      deleteUrl={endpoints.news.delete}
      mapper={mapNewsListRow}
      extraColumns={[publishPeriodColumn]}
      enableDateFilter
    />
  )
}
