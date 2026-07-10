import { Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { DataTableColumn } from '@/components/common/DataTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

interface DataTableCardListProps<T extends { id: string }> {
  data: T[]
  columns: DataTableColumn<T>[]
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  loading?: boolean
  emptyMessage?: string
}

function getCellValue<T>(item: T, col: DataTableColumn<T>): React.ReactNode {
  if (col.render) return col.render(item)
  return String((item as Record<string, unknown>)[col.key] ?? '')
}

function resolvePrimaryColumn<T>(columns: DataTableColumn<T>[]): DataTableColumn<T> | undefined {
  return (
    columns.find((col) => col.cardPrimary) ??
    columns.find((col) => col.key === 'title') ??
    columns.find((col) => col.key !== 'actions' && !col.cardHidden)
  )
}

function resolveBodyColumns<T>(
  columns: DataTableColumn<T>[],
  primary?: DataTableColumn<T>,
): DataTableColumn<T>[] {
  return columns
    .filter(
      (col) =>
        col.key !== 'actions' &&
        !col.cardHidden &&
        col.key !== primary?.key,
    )
    .sort((a, b) => (a.cardPriority ?? 999) - (b.cardPriority ?? 999))
}

function resolveActionsColumn<T>(columns: DataTableColumn<T>[]): DataTableColumn<T> | undefined {
  return columns.find((col) => col.key === 'actions')
}

export function DataTableCardList<T extends { id: string }>({
  data,
  columns,
  selectedIds = [],
  onSelectionChange,
  loading = false,
  emptyMessage = 'Tidak ada data',
}: DataTableCardListProps<T>) {
  const primaryColumn = resolvePrimaryColumn(columns)
  const bodyColumns = resolveBodyColumns(columns, primaryColumn)
  const actionsColumn = resolveActionsColumn(columns)

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-border text-muted-foreground">
        Memuat data...
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-border text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  const toggleOne = (id: string) => {
    if (!onSelectionChange) return
    onSelectionChange(
      selectedIds.includes(id)
        ? selectedIds.filter((itemId) => itemId !== id)
        : [...selectedIds, id],
    )
  }

  return (
    <div className="space-y-3 md:hidden">
      {data.map((item) => {
        const isSelected = selectedIds.includes(item.id)
        const cardActions = actionsColumn?.cardRender?.(item) ?? actionsColumn?.render?.(item)

        return (
          <Card
            key={item.id}
            className={cn(
              'overflow-hidden border-none shadow-soft transition-colors',
              isSelected && 'ring-2 ring-primary/30',
            )}
            data-state={isSelected ? 'selected' : undefined}
          >
            <CardContent className="p-4 pb-3">
              <div className="flex items-start gap-3">
                {onSelectionChange && (
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleOne(item.id)}
                    aria-label={`Pilih item ${item.id}`}
                    className="mt-0.5"
                  />
                )}
                <div className="min-w-0 flex-1 space-y-3">
                  {primaryColumn && (
                    <p className="font-semibold leading-snug break-words">
                      {getCellValue(item, primaryColumn)}
                    </p>
                  )}
                  {bodyColumns.length > 0 && (
                    <dl className="space-y-2">
                      {bodyColumns.map((col) => (
                        <div
                          key={col.key}
                          className="flex items-start justify-between gap-3 text-sm"
                        >
                          <dt className="shrink-0 text-muted-foreground">{col.header}</dt>
                          <dd className="min-w-0 text-right font-medium break-words">
                            {getCellValue(item, col)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </div>
            </CardContent>
            {cardActions && (
              <CardFooter className="gap-2 border-t border-border/60 bg-muted/20 p-3">
                {cardActions}
              </CardFooter>
            )}
          </Card>
        )
      })}
    </div>
  )
}

export function DefaultCardActions({
  editHref,
  onDelete,
}: {
  editHref: string
  onDelete: () => void
}) {
  return (
    <>
      <Button variant="outline" size="sm" className="min-h-10 flex-1" asChild>
        <Link to={editHref}>
          <Pencil className="h-4 w-4" />
          Edit
        </Link>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="min-h-10 flex-1 text-destructive hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
        Hapus
      </Button>
    </>
  )
}
