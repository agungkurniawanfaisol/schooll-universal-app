import { useQuery } from '@tanstack/react-query'
import { BarChart3, Eye, TrendingUp } from 'lucide-react'
import { useState } from 'react'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { type ApiRecord } from '@/api/utils'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { SEOHead } from '@/components/common/SEOHead'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { ApiResponse } from '@/types/api'

interface AnalyticsData {
  total_views: number
  today_views: number
  views_by_day: Array<{ date: string; views: number }>
  top_paths: Array<{ path: string; views: number }>
  period_days: number
}

export function AnalyticsPage() {
  const [days, setDays] = useState(30)

  const { data, isLoading } = useQuery({
    queryKey: ['analytics', days],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<AnalyticsData>>(endpoints.analytics.index, {
        params: { days },
      })
      return response.data.data
    },
  })

  const maxViews = Math.max(...(data?.views_by_day?.map((d) => d.views) ?? [1]), 1)

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  const statCards = [
    { label: 'Total Kunjungan', value: data?.total_views ?? 0, icon: Eye },
    { label: 'Kunjungan Hari Ini', value: data?.today_views ?? 0, icon: TrendingUp },
    { label: 'Periode (hari)', value: data?.period_days ?? days, icon: BarChart3 },
  ]

  return (
    <>
      <SEOHead title="Analytics" noIndex />
      <div className="space-y-6">
        <PageHeader
          title="Analytics"
          backTo="/dashboard"
          backLabel="Kembali ke Dashboard"
          description="Statistik kunjungan website"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Analytics' },
          ]}
          actions={
            <div className="flex gap-2">
              {[7, 30, 90].map((d) => (
                <Button
                  key={d}
                  variant={days === d ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDays(d)}
                >
                  {d} hari
                </Button>
              ))}
            </div>
          }
        />

        <div className="grid gap-4 sm:grid-cols-3">
          {statCards.map((stat) => (
            <Card key={stat.label} className="border border-border/60 shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-none shadow-soft">
            <CardHeader>
              <CardTitle>Kunjungan per Hari</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-48 items-end gap-1">
                {(data?.views_by_day ?? []).map((day) => (
                  <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-primary/80 transition-all"
                      style={{ height: `${Math.max((day.views / maxViews) * 100, 4)}%` }}
                      title={`${day.date}: ${day.views}`}
                    />
                    <span className="hidden text-[10px] text-muted-foreground sm:block">
                      {day.date.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft">
            <CardHeader>
              <CardTitle>Halaman Terpopuler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(data?.top_paths ?? []).length === 0 && (
                  <p className="text-sm text-muted-foreground">Belum ada data.</p>
                )}
                {(data?.top_paths ?? []).map((item: ApiRecord) => (
                  <div
                    key={String(item.path)}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="truncate font-medium">{String(item.path)}</span>
                    <span className="text-muted-foreground">{Number(item.views)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
