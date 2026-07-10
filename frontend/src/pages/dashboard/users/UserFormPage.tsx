import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { endpoints } from '@/api/endpoints'
import { userFromApi, userToApi } from '@/api/mappers'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { SEOHead } from '@/components/common/SEOHead'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useRolesList } from '@/hooks/useApiQueries'
import { useResourceDetail, useResourceMutation } from '@/hooks/usePaginatedList'
import { useNotificationStore } from '@/stores/notificationStore'
import { userSchema, type UserFormData } from '@/validators/cms'

export function UserFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success } = useNotificationStore()
  const isEdit = Boolean(id)
  const { data: roles = [] } = useRolesList()

  const { data, isLoading } = useResourceDetail({
    queryKey: 'users',
    detailUrl: endpoints.users.detail(id!),
    enabled: isEdit,
    fromApi: userFromApi,
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { isActive: true, name: '', email: '', roleId: '' },
  })

  useEffect(() => {
    if (data) reset(data)
  }, [data, reset])

  const mutation = useResourceMutation<UserFormData>({
    queryKey: 'users',
    createUrl: endpoints.users.create,
    updateUrl: isEdit ? endpoints.users.update(id!) : undefined,
    toApi: (formData) => userToApi(formData, formData.roleId),
  })

  const isActive = watch('isActive')

  const onSubmit = async (formData: UserFormData) => {
    await mutation.mutateAsync({ id, data: formData })
    success(isEdit ? 'Berhasil diperbarui' : 'Berhasil ditambahkan')
    navigate('/dashboard/users')
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
      <SEOHead title={isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'} noIndex />
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader
          title={isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Pengguna', href: '/dashboard/users' },
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
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              {!isEdit && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" {...register('password')} />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={watch('roleId')}
                  onValueChange={(v) => setValue('roleId', v, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={String(role.id)} value={String(role.name)}>
                        {String(role.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.roleId && (
                  <p className="text-sm text-destructive">{errors.roleId.message}</p>
                )}
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <div>
                  <Label>Aktif</Label>
                  <p className="text-sm text-muted-foreground">Pengguna dapat login</p>
                </div>
                <Switch checked={isActive} onCheckedChange={(v) => setValue('isActive', v)} />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="gradient" disabled={isSubmitting || mutation.isPending}>
                  {isSubmitting || mutation.isPending ? 'Menyimpan...' : 'Simpan'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/dashboard/users">Batal</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
