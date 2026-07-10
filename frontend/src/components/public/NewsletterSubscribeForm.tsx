import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useNotificationStore } from '@/stores/notificationStore'
import { newsletterSubscribeSchema, type NewsletterSubscribeFormData } from '@/validators/cms'

interface NewsletterSubscribeFormProps {
  className?: string
  compact?: boolean
}

export function NewsletterSubscribeForm({ className, compact = false }: NewsletterSubscribeFormProps) {
  const { success, error } = useNotificationStore()

  const form = useForm<NewsletterSubscribeFormData>({
    resolver: zodResolver(newsletterSubscribeSchema),
    defaultValues: { email: '', name: '' },
  })

  const mutation = useMutation({
    mutationFn: async (data: NewsletterSubscribeFormData) => {
      await apiClient.post(endpoints.newsletter.subscribe, {
        email: data.email,
        name: data.name || undefined,
      })
    },
    onSuccess: () => {
      success('Berlangganan berhasil', 'Terima kasih telah berlangganan newsletter kami.')
      form.reset()
    },
    onError: () => error('Gagal', 'Tidak dapat berlangganan newsletter'),
  })

  return (
    <form
      onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
      className={className}
    >
      <div className={compact ? 'flex flex-col gap-2 sm:flex-row' : 'space-y-3'}>
        {!compact ? (
          <div className="space-y-2">
            <Label htmlFor="newsletter-name">Nama (opsional)</Label>
            <Input id="newsletter-name" placeholder="Nama Anda" {...form.register('name')} />
          </div>
        ) : null}
        <div className={compact ? 'flex flex-1 flex-col gap-2 sm:flex-row' : 'space-y-2'}>
          <div className="flex-1 space-y-2">
            {!compact ? <Label htmlFor="newsletter-email">Email</Label> : null}
            <Input
              id="newsletter-email"
              type="email"
              placeholder="email@example.com"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <Button
            type="submit"
            variant="gradient"
            className={compact ? 'sm:self-end' : 'w-full'}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Mendaftar...' : 'Berlangganan'}
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  )
}
