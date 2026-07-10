import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Search,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { DataTableCardList } from '@/components/common/DataTableCardList'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDebounce } from '@/hooks/useDebounce'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

export interface DataTableColumn<T> {
  key: string
  header: string
  sortable?: boolean
  className?: string
  render?: (item: T) => React.ReactNode
  cardPrimary?: boolean
  cardHidden?: boolean
  cardPriority?: number
  cardRender?: (item: T) => React.ReactNode
}

export interface DataTableFilter {
  key: string
  label: string
  options: { label: string; value: string }[]
}

interface DataTableProps<T extends { id: string }> {
  data: T[]
  columns: DataTableColumn<T>[]
  totalItems: number
  page: number
  perPage: number
  onPageChange: (page: number) => void
  onPerPageChange?: (perPage: number) => void
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  filters?: DataTableFilter[]
  filterValues?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSortChange?: (key: string) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  bulkActions?: Array<{
    label: string
    icon?: React.ReactNode
    variant?: 'default' | 'destructive'
    onClick: (ids: string[]) => void
  }>
  loading?: boolean
  emptyMessage?: string
  className?: string
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  totalItems,
  page,
  perPage,
  onPageChange,
  onPerPageChange,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Cari...',
  filters = [],
  filterValues = {},
  onFilterChange,
  sortBy,
  sortOrder,
  onSortChange,
  selectedIds = [],
  onSelectionChange,
  bulkActions = [],
  loading = false,
  emptyMessage = 'Tidak ada data',
  className,
}: DataTableProps<T>) {
  const isMobile = useIsMobile()
  const [localSearch, setLocalSearch] = useState(searchValue)
  const debouncedSearch = useDebounce(localSearch, 300)

  useEffect(() => {
    if (onSearchChange && debouncedSearch !== searchValue) {
      onSearchChange(debouncedSearch)
    }
  }, [debouncedSearch, onSearchChange, searchValue])

  const totalPages = Math.max(1, Math.ceil(totalItems / perPage))
  const allSelected = data.length > 0 && selectedIds.length === data.length
  const someSelected = selectedIds.length > 0 && !allSelected
  const sortableColumns = columns.filter((col) => col.sortable && onSortChange)

  const toggleAll = () => {
    if (!onSelectionChange) return
    onSelectionChange(allSelected ? [] : data.map((item) => item.id))
  }

  const toggleOne = (id: string) => {
    if (!onSelectionChange) return
    onSelectionChange(
      selectedIds.includes(id)
        ? selectedIds.filter((i) => i !== id)
        : [...selectedIds, id],
    )
  }

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortBy !== columnKey)
      return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-40" />
    return sortOrder === 'asc' ? (
      <ArrowUp className="ml-1 h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-1 h-3.5 w-3.5" />
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          {onSearchChange && (
            <div className="relative w-full max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
          {filters.map((filter) => (
            <Select
              key={filter.key}
              value={filterValues[filter.key] ?? 'all'}
              onValueChange={(value) => onFilterChange?.(filter.key, value)}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua {filter.label}</SelectItem>
                {filter.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
          {isMobile && sortableColumns.length > 0 && (
            <Select
              value={sortBy ?? sortableColumns[0]?.key ?? ''}
              onValueChange={(value) => onSortChange?.(value)}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Urutkan berdasarkan" />
              </SelectTrigger>
              <SelectContent>
                {sortableColumns.map((col) => (
                  <SelectItem key={col.key} value={col.key}>
                    {col.header}
                    {sortBy === col.key ? (sortOrder === 'asc' ? ' (A-Z)' : ' (Z-A)') : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        {onPerPageChange && (
          <Select
            value={String(perPage)}
            onValueChange={(v) => onPerPageChange(Number(v))}
          >
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} / halaman
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedIds.length > 0 && bulkActions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-3 sm:gap-3">
          <span className="w-full text-sm text-muted-foreground sm:w-auto">
            {selectedIds.length} dipilih
          </span>
          {bulkActions.map((action) => (
            <Button
              key={action.label}
              size="sm"
              variant={action.variant === 'destructive' ? 'destructive' : 'outline'}
              className="min-h-10 flex-1 sm:flex-none"
              onClick={() => action.onClick(selectedIds)}
            >
              {action.icon ?? (action.variant === 'destructive' ? <Trash2 className="h-4 w-4" /> : null)}
              {action.label}
            </Button>
          ))}
        </div>
      )}

      <DataTableCardList
        data={data}
        columns={columns}
        selectedIds={selectedIds}
        onSelectionChange={onSelectionChange}
        loading={loading}
        emptyMessage={emptyMessage}
      />

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              {onSelectionChange && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                    onCheckedChange={toggleAll}
                    aria-label="Pilih semua"
                  />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.sortable && onSortChange ? (
                    <button
                      type="button"
                      className="inline-flex items-center font-medium hover:text-foreground"
                      onClick={() => onSortChange(col.key)}
                    >
                      {col.header}
                      <SortIcon columnKey={col.key} />
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (onSelectionChange ? 1 : 0)}
                  className="h-32 text-center text-muted-foreground"
                >
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (onSelectionChange ? 1 : 0)}
                  className="h-32 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} data-state={selectedIds.includes(item.id) ? 'selected' : undefined}>
                  {onSelectionChange && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={() => toggleOne(item.id)}
                        aria-label={`Pilih baris ${item.id}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render
                        ? col.render(item)
                        : String((item as Record<string, unknown>)[col.key] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-center text-sm text-muted-foreground sm:text-left">
          Menampilkan {data.length} dari {totalItems} data
        </p>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          compact={isMobile}
        />
      </div>
    </div>
  )
}
