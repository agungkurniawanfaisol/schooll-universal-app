import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Send, Star } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useNotificationStore } from '@/stores/notificationStore'
import { testimonialSubmitSchema, type TestimonialSubmitFormData } from '@/validators/cms'

interface TestimonialSubmitFormProps {
  className?: string
}

export function TestimonialSubmitForm({ className }: TestimonialSubmitFormProps) {
  const { success, error } = useNotificationStore()

  const form = useForm<TestimonialSubmitFormData>({
    resolver: zodResolver(testimonialSubmitSchema),
    defaultValues: { name: '', comment: '', rating: 5, occupation: '' },
  })

  const mutation = useMutation({
    mutationFn: async (data: TestimonialSubmitFormData) => {
      await apiClient.post(endpoints.public.testimonialSubmit, {
        name: data.name,
        occupation: data.occupation || undefined,
        rating: data.rating,
        comment: data.comment,
        submitter_email: data.submitterEmail || undefined,
      })
    },
    onSuccess: () => {
      success('Testimoni terkirim', 'Testimoni Anda menunggu moderasi admin.')
      form.reset({ name: '', comment: '', rating: 5, occupation: '' })
    },
    onError: () => error('Gagal', 'Tidak dapat mengirim testimoni'),
  })

  const rating = form.watch('rating')

  return (
    <form
      onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
      className={className ?? 'glass-card space-y-4 p-6 shadow-soft'}
    >
      <h3 className="text-lg font-semibold">Kirim Testimoni Anda</h3>
      <div className="space-y-2">
        <Label htmlFor="testimonial-name">Nama</Label>
        <Input id="testimonial-name" {...form.register('name')} />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="testimonial-occupation">Peran (opsional)</Label>
        <Input id="testimonial-occupation" placeholder="Orang tua / Alumni" {...form.register('occupation')} />
      </div>
      <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => form.setValue('rating', n)}
              className="rounded p-1 transition-colors hover:bg-muted"
            >
              <Star
                className={`h-6 w-6 ${n <= rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="testimonial-comment">Testimoni</Label>
        <Textarea id="testimonial-comment" rows={4} {...form.register('comment')} />
        {form.formState.errors.comment && (
          <p className="text-sm text-destructive">{form.formState.errors.comment.message}</p>
        )}
      </div>
      <Button type="submit" variant="gradient" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? 'Mengirim...' : 'Kirim Testimoni'}
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
