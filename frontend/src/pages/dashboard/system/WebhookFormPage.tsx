import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { endpoints } from '@/api/endpoints'
import { webhookFromApi, webhookToApi } from '@/api/mappers'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { SEOHead } from '@/components/common/SEOHead'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useResourceDetail, useResourceMutation } from '@/hooks/usePaginatedList'
import { useNotificationStore } from '@/stores/notificationStore'
import { webhookSchema, type WebhookFormData } from '@/validators/cms'

export function WebhookFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success } = useNotificationStore()
  const isEdit = Boolean(id)

  const { data, isLoading } = useResourceDetail({
    queryKey: 'webhooks',
    detailUrl: endpoints.webhooks.detail(id!),
    enabled: isEdit,
    fromApi: webhookFromApi,
  })

  const form = useForm<WebhookFormData>({
    resolver: zodResolver(webhookSchema),
    defaultValues: { name: '', url: '', events: [], isActive: true },
  })

  const { register, handleSubmit, reset, setValue, watch, formState } = form
  const { errors, isSubmitting } = formState

  useEffect(() => {
    if (data) reset(data)
  }, [data, reset])

  const mutation = useResourceMutation<WebhookFormData>({
    queryKey: 'webhooks',
    createUrl: endpoints.webhooks.create,
    updateUrl: isEdit ? endpoints.webhooks.update(id!) : undefined,
    toApi: webhookToApi,
  })

  const eventsText = (watch('events') ?? []).join(', ')

  const onSubmit = async (formData: WebhookFormData) => {
    await mutation.mutateAsync({ id, data: formData })
    success(isEdit ? 'Webhook diperbarui' : 'Webhook ditambahkan')
    navigate('/dashboard/webhooks')
  }

  if (isEdit && isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <>
      <SEOHead title={isEdit ? 'Edit Webhook' : 'Tambah Webhook'} noIndex />
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader
          title={isEdit ? 'Edit Webhook' : 'Tambah Webhook'}
          backTo="/dashboard/webhooks"
          backLabel="Kembali ke Webhooks"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Webhooks', href: '/dashboard/webhooks' },
            { label: isEdit ? 'Edit' : 'Tambah' },
          ]}
        />
        <Card className="border-none shadow-soft">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input id="url" type="url" {...register('url')} />
                {errors.url && <p className="text-sm text-destructive">{errors.url.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="events">Events (pisahkan koma)</Label>
                <Textarea
                  id="events"
                  rows={2}
                  value={eventsText}
                  onChange={(e) =>
                    setValue(
                      'events',
                      e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                      { shouldValidate: true },
                    )
                  }
                />
                {errors.events && (
                  <p className="text-sm text-destructive">{errors.events.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="secret">Secret (opsional)</Label>
                <Input id="secret" {...register('secret')} />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <div>
                  <Label>Aktif</Label>
                  <p className="text-sm text-muted-foreground">Kirim event ke URL ini</p>
                </div>
                <Switch
                  checked={watch('isActive')}
                  onCheckedChange={(v) => setValue('isActive', v)}
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="gradient" disabled={isSubmitting || mutation.isPending}>
                  {isSubmitting || mutation.isPending ? 'Menyimpan...' : 'Simpan'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/dashboard/webhooks">Batal</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
