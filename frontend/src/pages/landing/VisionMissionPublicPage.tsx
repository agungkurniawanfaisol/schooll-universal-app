import { Eye, Heart, Target } from 'lucide-react'

import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PublicPageHeader } from '@/components/layout/PublicPageHeader'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { CardContent } from '@/components/ui/card'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { usePublicVisionMission } from '@/hooks/usePublicContent'

const iconMap: Record<string, typeof Eye> = {
  eye: Eye,
  target: Target,
  heart: Heart,
}

export function VisionMissionPublicPage() {
  const { data: items = [], isLoading } = usePublicVisionMission()

  const vision = items.filter((item) => item.type === 'vision')
  const missions = items.filter((item) => item.type === 'mission')

  return (
    <PublicPageShell backTo="/" backLabel="Kembali ke Beranda" title="Visi & Misi" description="Arah dan komitmen sekolah kami">
      <div className="mx-auto max-w-5xl space-y-8">
        <PublicPageHeader
          eyebrow="Profil"
          title="Visi & Misi"
          description="Landasan pendidikan yang kami jalankan setiap hari."
        />

        {isLoading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-12">
            {vision.map((item) => {
              const Icon = iconMap[String(item.icon ?? 'eye')] ?? Eye
              return (
                <PremiumCard
                  key={String(item.id)}
                  className="h-full overflow-hidden bg-gradient-to-br from-primary/10 via-card to-accent/5 shadow-glow lg:col-span-5"
                >
                  <CardContent className="space-y-5 p-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-bg text-primary-foreground shadow-glow">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h2 className="text-2xl font-bold">{String(item.title ?? 'Visi')}</h2>
                    <p className="text-lg leading-relaxed text-muted-foreground">{String(item.content ?? '')}</p>
                  </CardContent>
                </PremiumCard>
              )
            })}

            <div className="grid gap-4 lg:col-span-7">
              {missions.map((item) => {
                const Icon = iconMap[String(item.icon ?? 'target')] ?? Target
                return (
                  <PremiumCard key={String(item.id)}>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{String(item.title ?? 'Misi')}</h3>
                        <p className="mt-1 leading-relaxed text-muted-foreground">{String(item.content ?? '')}</p>
                      </div>
                    </CardContent>
                  </PremiumCard>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </PublicPageShell>
  )
}
