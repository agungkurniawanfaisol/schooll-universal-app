import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LandingSection } from '@/features/landing/LandingSection'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { SectionHeader } from '@/features/landing/SectionHeader'
import { useLandingContext } from '@/features/landing/LandingDataContext'
import { useNotificationStore } from '@/stores/notificationStore'
import { fadeInLeft, fadeInRight, springSoft, viewportOnce } from '@/lib/motion'
import { contactFormSchema, type ContactFormData } from '@/validators/cms'

const iconMap = {
  'map-pin': MapPin,
  phone: Phone,
  mail: Mail,
} as const

export function ContactSection() {
  const { data } = useLandingContext()
  const { success, error } = useNotificationStore()
  const contactInfo = data?.contact_info ?? []

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  const submitMutation = useMutation({
    mutationFn: async (formData: ContactFormData) => {
      await apiClient.post(endpoints.public.contact, formData)
    },
    onSuccess: () => {
      success('Pesan terkirim', 'Terima kasih! Kami akan segera menghubungi Anda.')
      reset()
    },
    onError: () => {
      error('Gagal mengirim', 'Silakan coba lagi atau hubungi kami langsung.')
    },
  })

  const address = contactInfo.find((c) => c.type === 'address')
  const phone = contactInfo.find((c) => c.type === 'phone')
  const email = contactInfo.find((c) => c.type === 'email')

  return (
    <LandingSection id="kontak" variant="muted">
      <SectionHeader
        eyebrow="Kontak"
        title="Hubungi Kami"
        description="Kami siap membantu pertanyaan seputar pendaftaran, informasi akademik, dan kerja sama."
      />

      <div className="grid gap-12 lg:grid-cols-2">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInLeft}
          transition={springSoft}
          className="space-y-6"
        >
          {contactInfo.map((item, i) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] ?? MapPin
            return (
              <motion.div
                key={String(item.id)}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ ...springSoft, delay: i * 0.06 }}
                className="flex items-start gap-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 hover:bg-primary/15">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{String(item.label ?? item.type)}</p>
                  <p className="font-medium">{String(item.value)}</p>
                </div>
              </motion.div>
            )
          })}

          <PremiumCard className="overflow-hidden" hover={false}>
            <iframe
              title="Lokasi Sekolah"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(String(address?.value ?? 'Jakarta'))}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              className="aspect-[16/9] w-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </PremiumCard>
        </motion.div>

        <motion.form
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInRight}
          transition={springSoft}
          onSubmit={handleSubmit((formData) => submitMutation.mutateAsync(formData))}
          className="glass-card space-y-5 p-6 shadow-glow sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" placeholder="Nama lengkap" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder={String(email?.value ?? 'email@example.com')} {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subjek</Label>
            <Input id="subject" placeholder="Subjek pesan" {...register('subject')} />
            {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Pesan</Label>
            <Textarea id="message" placeholder="Tulis pesan Anda..." rows={5} {...register('message')} />
            {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
          </div>
          <Button type="submit" variant="gradient" className="min-h-11 w-full shadow-glow" disabled={isSubmitting || submitMutation.isPending}>
            {isSubmitting || submitMutation.isPending ? 'Mengirim...' : 'Kirim Pesan'}
            <Send className="h-4 w-4" />
          </Button>
          {phone?.value ? (
            <p className="text-center text-xs text-muted-foreground">
              Atau hubungi langsung: {String(phone.value)}
            </p>
          ) : null}
        </motion.form>
      </div>
    </LandingSection>
  )
}
