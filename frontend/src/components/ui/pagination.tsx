import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import * as React from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  compact?: boolean
}

function Pagination({ page, totalPages, onPageChange, className, compact = false }: PaginationProps) {
  const pages = React.useMemo(() => {
    const items: (number | 'ellipsis')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) items.push(i)
      return items
    }
    items.push(1)
    if (page > 3) items.push('ellipsis')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      items.push(i)
    }
    if (page < totalPages - 2) items.push('ellipsis')
    items.push(totalPages)
    return items
  }, [page, totalPages])

  if (totalPages <= 1) return null

  if (compact) {
    return (
      <nav
        role="navigation"
        aria-label="pagination"
        className={cn('flex w-full items-center justify-between gap-3', className)}
      >
        <Button
          variant="outline"
          size="sm"
          className="min-h-10"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="h-4 w-4" />
          Sebelumnya
        </Button>
        <span className="text-sm text-muted-foreground">
          Halaman {page} dari {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="min-h-10"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Halaman berikutnya"
        >
          Berikutnya
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
    )
  }

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
    >
      <ul className="flex flex-row items-center gap-1">
        <li>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </li>
        {pages.map((item, index) =>
          item === 'ellipsis' ? (
            <li key={`ellipsis-${index}`}>
              <span className="flex h-9 w-9 items-center justify-center">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                aria-current={page === item ? 'page' : undefined}
                className={cn(
                  buttonVariants({
                    variant: page === item ? 'default' : 'ghost',
                    size: 'icon',
                  }),
                )}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            </li>
          ),
        )}
        <li>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Halaman berikutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </li>
      </ul>
    </nav>
  )
}

export { Pagination }
