import {
  Activity,
  Calendar,
  GraduationCap,
  Mail,
  Newspaper,
  Users,
} from 'lucide-react'

import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { SEOHead } from '@/components/common/SEOHead'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/api/utils'
import { useDashboardData } from '@/hooks/useApiQueries'
import { useSchoolName } from '@/hooks/useSchoolName'

export function DashboardPage() {
  const { data, isLoading } = useDashboardData()
  const schoolName = useSchoolName()

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  const stats = data?.stats

  const statCards = [
    { label: 'Total Guru', value: stats?.teachers ?? 0, icon: GraduationCap },
    { label: 'Berita', value: stats?.news ?? 0, icon: Newspaper },
    { label: 'Kegiatan', value: stats?.activities ?? 0, icon: Activity },
    { label: 'Pengguna', value: stats?.users ?? 0, icon: Users },
    { label: 'Agenda', value: stats?.agendas ?? 0, icon: Calendar },
    { label: 'Pesan Belum Dibaca', value: stats?.unread_contacts ?? 0, icon: Mail },
  ]

  return (
    <>
      <SEOHead title="Dashboard" noIndex />
      <div className="space-y-8">
        <PageHeader
          title="Dashboard"
          description={`Selamat datang di panel administrasi ${schoolName}`}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => (
            <Card key={stat.label} className="border border-border/60 bg-card shadow-soft">
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
              <CardTitle>Berita Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(data?.recent_news ?? []).length === 0 && (
                  <p className="text-sm text-muted-foreground">Belum ada berita.</p>
                )}
                {(data?.recent_news ?? []).map((item) => (
                  <div
                    key={String(item.id)}
                    className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="truncate font-medium">{String(item.title)}</span>
                    <span className="shrink-0 text-muted-foreground">{formatDate(item.created_at)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft">
            <CardHeader>
              <CardTitle>Agenda Mendatang</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(data?.upcoming_agendas ?? []).length === 0 && (
                  <p className="text-sm text-muted-foreground">Belum ada agenda mendatang.</p>
                )}
                {(data?.upcoming_agendas ?? []).map((item) => (
                  <div
                    key={String(item.id)}
                    className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="truncate font-medium">{String(item.title)}</span>
                    <span className="shrink-0 text-muted-foreground">{formatDate(item.date)}</span>
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
