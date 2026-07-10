import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { PageHeader } from '@/components/common/PageHeader'
import { SEOHead } from '@/components/common/SEOHead'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useNotificationStore } from '@/stores/notificationStore'
import { roleSchema, type RoleFormData } from '@/validators/cms'

export function RoleFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success } = useNotificationStore()
  const isEdit = Boolean(id)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RoleFormData>({ resolver: zodResolver(roleSchema), defaultValues: { permissions: [] } })

  const onSubmit = async (_data: RoleFormData) => {
    await new Promise((r) => setTimeout(r, 800))
    success('Role disimpan')
    navigate('/dashboard/roles')
  }

  return (
    <>
      <SEOHead title={isEdit ? 'Edit Role' : 'Tambah Role'} noIndex />
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader title={isEdit ? 'Edit Role' : 'Tambah Role'} breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Role', href: '/dashboard/roles' }, { label: isEdit ? 'Edit' : 'Tambah' }]} />
        <Card className="border-none shadow-soft"><CardContent className="space-y-5 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2"><Label>Nama</Label><Input {...register('name')} />{errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}</div>
            <div className="space-y-2"><Label>Slug</Label><Input {...register('slug')} />{errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}</div>
            <div className="space-y-2"><Label>Deskripsi</Label><Textarea {...register('description')} /></div>
            <div className="flex gap-3"><Button type="submit" variant="gradient" disabled={isSubmitting}>Simpan</Button><Button type="button" variant="outline" asChild><Link to="/dashboard/roles">Batal</Link></Button></div>
          </form>
        </CardContent></Card>
      </div>
    </>
  )
}