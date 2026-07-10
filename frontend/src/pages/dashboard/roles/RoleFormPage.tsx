import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { endpoints } from '@/api/endpoints'
import { type ApiRecord } from '@/api/utils'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { PermissionPicker, type PermissionGroup } from '@/components/common/PermissionPicker'
import { SEOHead } from '@/components/common/SEOHead'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { usePermissionsList } from '@/hooks/useApiQueries'
import { useResourceDetail, useResourceMutation } from '@/hooks/usePaginatedList'
import { useNotificationStore } from '@/stores/notificationStore'
import { roleSchema, type RoleFormData } from '@/validators/cms'

function roleFromApi(item: ApiRecord): RoleFormData {
  const permissions = (item.permissions as ApiRecord[] | undefined)?.map((p) => String(p.name)) ?? []

  return {
    name: String(item.name ?? ''),
    slug: String(item.name ?? '').toLowerCase().replace(/\s+/g, '-'),
    description: '',
    permissions,
  }
}

function roleToApi(data: RoleFormData) {
  return {
    name: data.name,
    permissions: data.permissions,
  }
}

export function RoleFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success } = useNotificationStore()
  const isEdit = Boolean(id)

  const { data: permissionsData, isLoading: permissionsLoading } = usePermissionsList()
  const { data: roleData, isLoading: roleLoading } = useResourceDetail({
    queryKey: 'roles',
    detailUrl: endpoints.roles.detail(id!),
    enabled: isEdit,
    fromApi: roleFromApi,
  })

  const mutation = useResourceMutation<RoleFormData>({
    queryKey: 'roles',
    createUrl: endpoints.roles.create,
    updateUrl: id ? endpoints.roles.update(id) : undefined,
    toApi: roleToApi,
    onSuccess: () => success('Role disimpan'),
  })

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: '', slug: '', description: '', permissions: [] },
  })

  useEffect(() => {
    if (roleData) reset(roleData)
  }, [roleData, reset])

  const permissions = watch('permissions') ?? []
  const groups = (permissionsData ?? {}) as PermissionGroup

  const onSubmit = async (data: RoleFormData) => {
    await mutation.mutateAsync({ id, data })
    navigate('/dashboard/roles')
  }

  if (isEdit && roleLoading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <>
      <SEOHead title={isEdit ? 'Edit Role' : 'Tambah Role'} noIndex />
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader
          title={isEdit ? 'Edit Role' : 'Tambah Role'}
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Role', href: '/dashboard/roles' },
            { label: isEdit ? 'Edit' : 'Tambah' },
          ]}
        />
        <Card className="border-none shadow-soft">
          <CardContent className="space-y-5 p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Role</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea id="description" {...register('description')} />
              </div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                {permissionsLoading ? (
                  <LoadingSpinner />
                ) : (
                  <PermissionPicker
                    groups={groups}
                    value={permissions}
                    onChange={(next) => setValue('permissions', next, { shouldValidate: true })}
                  />
                )}
                {errors.permissions && (
                  <p className="text-sm text-destructive">{errors.permissions.message}</p>
                )}
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="gradient" disabled={isSubmitting}>
                  Simpan
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/dashboard/roles">Batal</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
