import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { endpoints } from '@/api/endpoints'
import { tenantFromApi, tenantToApi } from '@/api/mappers'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { SEOHead } from '@/components/common/SEOHead'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useResourceDetail, useResourceMutation } from '@/hooks/usePaginatedList'
import { useNotificationStore } from '@/stores/notificationStore'
import { tenantSchema, type TenantFormData } from '@/validators/cms'

export function TenantFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success } = useNotificationStore()
  const isEdit = Boolean(id)

  const { data, isLoading } = useResourceDetail({
    queryKey: 'tenants',
    detailUrl: endpoints.tenants.detail(id!),
    enabled: isEdit,
    fromApi: tenantFromApi,
  })

  const form = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: { name: '', isActive: true },
  })

  const { register, handleSubmit, reset, setValue, watch, formState } = form
  const { errors, isSubmitting } = formState

  useEffect(() => {
    if (data) reset(data)
  }, [data, reset])

  const mutation = useResourceMutation<TenantFormData>({
    queryKey: 'tenants',
    createUrl: endpoints.tenants.create,
    updateUrl: isEdit ? endpoints.tenants.update(id!) : undefined,
    toApi: tenantToApi,
  })

  const onSubmit = async (formData: TenantFormData) => {
    await mutation.mutateAsync({ id, data: formData })
    success(isEdit ? 'Tenant diperbarui' : 'Tenant ditambahkan')
    navigate('/dashboard/tenants')
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
      <SEOHead title={isEdit ? 'Edit Tenant' : 'Tambah Tenant'} noIndex />
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader
          title={isEdit ? 'Edit Tenant' : 'Tambah Tenant'}
          backTo="/dashboard/tenants"
          backLabel="Kembali ke Tenants"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Tenants', href: '/dashboard/tenants' },
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
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" {...register('slug')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input id="domain" placeholder="sekolah.example.com" {...register('domain')} />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <div>
                  <Label>Aktif</Label>
                  <p className="text-sm text-muted-foreground">Tenant dapat diakses</p>
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
                  <Link to="/dashboard/tenants">Batal</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
