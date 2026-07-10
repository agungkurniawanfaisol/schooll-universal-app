import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { ImageUploader } from '@/components/common/ImageUploader'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { SEOHead } from '@/components/common/SEOHead'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { uploadMediaFile } from '@/hooks/useMediaUpload'
import { useAuth } from '@/hooks/useAuth'
import { useNotificationStore } from '@/stores/notificationStore'

const profileSchema = z
  .object({
    name: z.string().min(2, 'Nama minimal 2 karakter'),
    avatar: z.string().optional(),
    password: z.string().min(6, 'Password minimal 6 karakter').optional().or(z.literal('')),
    password_confirmation: z.string().optional(),
    current_password: z.string().optional(),
  })
  .refine((data) => !data.password || data.password === data.password_confirmation, {
    message: 'Konfirmasi password tidak cocok',
    path: ['password_confirmation'],
  })
  .refine((data) => !data.password || (data.current_password?.length ?? 0) > 0, {
    message: 'Password saat ini wajib diisi',
    path: ['current_password'],
  })

type ProfileFormData = z.infer<typeof profileSchema>

export function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const { success, error } = useNotificationStore()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', avatar: '', password: '', password_confirmation: '', current_password: '' },
  })

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        avatar: user.avatar ?? '',
        password: '',
        password_confirmation: '',
        current_password: '',
      })
    }
  }, [user, reset])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const payload: Record<string, string> = { name: data.name }
      if (data.avatar) payload.avatar = data.avatar
      if (data.password) {
        payload.password = data.password
        payload.password_confirmation = data.password_confirmation ?? ''
        payload.current_password = data.current_password ?? ''
      }

      await apiClient.patch(endpoints.auth.profile, payload)
      await refreshUser()
      success('Profil diperbarui')
      reset({ ...data, password: '', password_confirmation: '', current_password: '' })
    } catch {
      error('Gagal', 'Tidak dapat memperbarui profil')
    }
  }

  if (!user) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <>
      <SEOHead title="Profil Saya" noIndex />
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader
          title="Profil Saya"
          backTo="/dashboard"
          backLabel="Kembali ke Dashboard"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Profil' },
          ]}
        />
        <Card className="border-none shadow-soft">
          <CardContent className="space-y-5 p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label>Avatar</Label>
                <ImageUploader
                  value={watch('avatar')}
                  onChange={(url) => setValue('avatar', url)}
                  onUpload={uploadMediaFile}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_password">Password saat ini</Label>
                <Input id="current_password" type="password" {...register('current_password')} />
                {errors.current_password && (
                  <p className="text-sm text-destructive">{errors.current_password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password baru</Label>
                <Input id="password" type="password" {...register('password')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Konfirmasi password baru</Label>
                <Input id="password_confirmation" type="password" {...register('password_confirmation')} />
                {errors.password_confirmation && (
                  <p className="text-sm text-destructive">{errors.password_confirmation.message}</p>
                )}
              </div>
              <Button type="submit" variant="gradient" disabled={isSubmitting}>
                Simpan Perubahan
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
