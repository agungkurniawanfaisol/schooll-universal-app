import { HelpCircle } from 'lucide-react'

import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PublicPageHeader } from '@/components/layout/PublicPageHeader'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { CardContent } from '@/components/ui/card'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { usePublicFaqsList } from '@/hooks/usePublicContent'

export function FaqPublicPage() {
  const { data, isLoading } = usePublicFaqsList({ perPage: 50 })
  const items = data?.items ?? []

  return (
    <PublicPageShell backTo="/" backLabel="Kembali ke Beranda" title="FAQ" description="Pertanyaan yang sering diajukan">
      <div className="mx-auto max-w-3xl space-y-8">
        <PublicPageHeader
          eyebrow="FAQ"
          title="Pertanyaan Umum"
          description="Temukan jawaban seputar sekolah kami."
        />

        {isLoading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground">Belum ada FAQ.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <PremiumCard key={String(item.id)} hover={false}>
                <CardContent className="p-6">
                  <div className="flex gap-3">
                    <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <h2 className="font-semibold">{String(item.question)}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {String(item.answer)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </PremiumCard>
            ))}
          </div>
        )}
      </div>
    </PublicPageShell>
  )
}
