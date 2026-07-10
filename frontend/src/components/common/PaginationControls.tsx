import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface PaginationControlsProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function PaginationControls({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null

  return (
    <div className={`flex items-center justify-center gap-2 ${className ?? ''}`}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="min-w-[5rem] text-center text-sm text-muted-foreground">
        {page} / {totalPages}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Halaman berikutnya"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
