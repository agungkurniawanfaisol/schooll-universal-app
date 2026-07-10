import { HelpCircle } from 'lucide-react'

import { CardContent } from '@/components/ui/card'
import { LandingSection } from '@/features/landing/LandingSection'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { SectionHeader } from '@/features/landing/SectionHeader'
import { SectionReadMoreLink } from '@/features/landing/SectionReadMoreLink'
import { useLandingContext } from '@/features/landing/LandingDataContext'

export function FaqSection() {
  const { data } = useLandingContext()
  const faqs = (data as { faqs?: unknown[] } | undefined)?.faqs ?? []

  if (!faqs.length) return null

  return (
    <LandingSection id="faq" variant="default">
      <SectionHeader
        eyebrow="FAQ"
        title="Pertanyaan Umum"
        description="Jawaban singkat untuk pertanyaan yang sering diajukan."
      />

      <div className="mx-auto max-w-3xl space-y-4">
        {faqs.slice(0, 5).map((item) => {
          const faq = item as Record<string, unknown>
          return (
            <PremiumCard key={String(faq.id)} hover={false}>
              <CardContent className="flex gap-3 p-6">
                <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">{String(faq.question)}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {String(faq.answer)}
                  </p>
                </div>
              </CardContent>
            </PremiumCard>
          )
        })}
      </div>

      <SectionReadMoreLink to="/faq" label="Lihat semua FAQ" />
    </LandingSection>
  )
}
