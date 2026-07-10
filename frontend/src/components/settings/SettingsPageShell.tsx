import type { ReactNode } from 'react'

import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { SEOHead } from '@/components/common/SEOHead'

interface SettingsPageShellProps {
  title: string
  description: string
  breadcrumbLabel: string
  isLoading?: boolean
  children: ReactNode
}

export function SettingsPageShell({
  title,
  description,
  breadcrumbLabel,
  isLoading,
  children,
}: SettingsPageShellProps) {
  return (
    <>
      <SEOHead title={title} noIndex />
      <div className="mx-auto max-w-4xl space-y-6">
        <PageHeader
          title={title}
          description={description}
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Pengaturan' },
            { label: breadcrumbLabel },
          ]}
        />
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          children
        )}
      </div>
    </>
  )
}
