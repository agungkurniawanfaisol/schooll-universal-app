import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface DateRangeFilterProps {
  dateFrom: string
  dateTo: string
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
  onClear?: () => void
  className?: string
}

export function DateRangeFilter({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onClear,
  className,
}: DateRangeFilterProps) {
  return (
    <div className={className}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="dateFrom" className="text-xs text-muted-foreground">
            Dari tanggal
          </Label>
          <Input
            id="dateFrom"
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="w-full sm:w-40"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dateTo" className="text-xs text-muted-foreground">
            Sampai tanggal
          </Label>
          <Input
            id="dateTo"
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="w-full sm:w-40"
          />
        </div>
        {onClear && (dateFrom || dateTo) ? (
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            Reset
          </Button>
        ) : null}
      </div>
    </div>
  )
}
