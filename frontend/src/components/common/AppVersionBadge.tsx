import { formatAppVersion, formatAppVersionShort } from '@/config/appVersion'
import { cn } from '@/lib/utils'

interface AppVersionBadgeProps {
  collapsed?: boolean
  className?: string
}

export function AppVersionBadge({ collapsed = false, className }: AppVersionBadgeProps) {
  if (collapsed) {
    return (
      <p
        className={cn(
          'mx-auto w-fit max-w-full truncate rounded-lg bg-muted/60 px-1.5 py-1 text-center text-[9px] font-medium tabular-nums text-muted-foreground',
          className,
        )}
        title={formatAppVersion()}
      >
        {formatAppVersionShort()}
      </p>
    )
  }

  return (
    <p className={cn('px-3 text-[11px] tabular-nums text-muted-foreground', className)}>
      {formatAppVersion()}
    </p>
  )
}
