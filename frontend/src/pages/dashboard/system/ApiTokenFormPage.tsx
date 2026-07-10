import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { endpoints } from '@/api/endpoints'
import { apiTokenFromApi, apiTokenToApi } from '@/api/mappers'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { SEOHead } from '@/components/common/SEOHead'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useResourceDetail } from '@/hooks/usePaginatedList'
import { useNotificationStore } from '@/stores/notificationStore'
import { apiClient } from '@/api/client'
import { apiTokenSchema, type ApiTokenFormData } from '@/validators/cms'
import type { ApiResponse } from '@/types/api'

export function ApiTokenFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success } = useNotificationStore()
  const isEdit = Boolean(id)
  const [plainToken, setPlainToken] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const { data, isLoading } = useResourceDetail({
    queryKey: 'api-tokens',
    detailUrl: endpoints.apiTokens.detail(id!),
    enabled: isEdit,
    fromApi: apiTokenFromApi,
  })

  const form = useForm<ApiTokenFormData>({
    resolver: zodResolver(apiTokenSchema),
    defaultValues: { name: '', abilities: [], isActive: true },
  })

  const { register, handleSubmit, reset, setValue, watch, formState } = form
  const { errors, isSubmitting } = formState

  useEffect(() => {
    if (data) reset(data)
  }, [data, reset])

  const abilitiesText = (watch('abilities') ?? []).join(', ')

  const onSubmit = async (formData: ApiTokenFormData) => {
    setSaving(true)
    try {
      const payload = apiTokenToApi(formData)
      if (isEdit) {
        await apiClient.put(endpoints.apiTokens.update(id!), payload)
        success('Token diperbarui')
        navigate('/dashboard/api-tokens')
      } else {
        const response = await apiClient.post<
          ApiResponse<{ plain_text_token?: string }>
        >(endpoints.apiTokens.create, payload)
        setPlainToken(response.data.data?.plain_text_token ?? null)
        success('Token dibuat — salin token sekarang, tidak akan ditampilkan lagi')
      }
    } finally {
      setSaving(false)
    }
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
      <SEOHead title={isEdit ? 'Edit API Token' : 'Tambah API Token'} noIndex />
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader
          title={isEdit ? 'Edit API Token' : 'Tambah API Token'}
          backTo="/dashboard/api-tokens"
          backLabel="Kembali ke API Tokens"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'API Tokens', href: '/dashboard/api-tokens' },
            { label: isEdit ? 'Edit' : 'Tambah' },
          ]}
        />
        <Card className="border-none shadow-soft">
          <CardContent className="p-6">
            {plainToken ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Salin token berikut. Token hanya ditampilkan sekali.
                </p>
                <code className="block break-all rounded-lg bg-muted p-4 text-sm">{plainToken}</code>
                <Button variant="gradient" asChild>
                  <Link to="/dashboard/api-tokens">Kembali ke Daftar</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama</Label>
                  <Input id="name" {...register('name')} />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="abilities">Abilities (pisahkan koma)</Label>
                  <Textarea
                    id="abilities"
                    rows={2}
                    value={abilitiesText}
                    onChange={(e) =>
                      setValue(
                        'abilities',
                        e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div>
                    <Label>Aktif</Label>
                    <p className="text-sm text-muted-foreground">Token dapat digunakan</p>
                  </div>
                  <Switch
                    checked={watch('isActive')}
                    onCheckedChange={(v) => setValue('isActive', v)}
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" variant="gradient" disabled={isSubmitting || saving}>
                    {isSubmitting || saving ? 'Menyimpan...' : 'Simpan'}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link to="/dashboard/api-tokens">Batal</Link>
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
