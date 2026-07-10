import type { ReactNode } from 'react'

import { BackButton } from '@/components/common/BackButton'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: ReactNode
  className?: string
  backTo?: string
  backLabel?: string
  onBack?: () => void
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
  backTo,
  backLabel,
  onBack,
}: PageHeaderProps) {
  const showBack = Boolean(backTo || onBack)

  return (
    <div className={cn('space-y-4', className)}>
      {showBack && (
        <BackButton to={backTo} label={backLabel} onBack={onBack} />
      )}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <span key={item.label} className="contents">
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink to={item.href}>{item.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex w-full items-center gap-2 sm:w-auto [&>*]:w-full sm:[&>*]:w-auto">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
