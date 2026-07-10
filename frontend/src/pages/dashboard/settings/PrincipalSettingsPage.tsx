import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { ImageUploader } from '@/components/common/ImageUploader'
import { SettingsPageShell } from '@/components/settings/SettingsPageShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { usePrincipal, useSavePrincipal } from '@/hooks/useContentApi'
import { uploadMediaFile } from '@/hooks/useMediaUpload'
import { useNotificationStore } from '@/stores/notificationStore'

interface PrincipalForm {
  name: string
  title: string
  photo: string
  message: string
}

export function PrincipalSettingsPage() {
  const { data, isLoading } = usePrincipal()
  const saveMutation = useSavePrincipal()
  const { success } = useNotificationStore()

  const { register, handleSubmit, reset, setValue, watch } = useForm<PrincipalForm>({
    defaultValues: { name: '', title: 'Kepala Sekolah', photo: '', message: '' },
  })

  useEffect(() => {
    if (data) {
      reset({
        name: String(data.name ?? ''),
        title: String(data.title ?? 'Kepala Sekolah'),
        photo: String(data.photo ?? ''),
        message: String(data.message ?? ''),
      })
    }
  }, [data, reset])

  const onSubmit = handleSubmit(async (form) => {
    await saveMutation.mutateAsync({ ...form, status: 'published' })
    success('Pengaturan disimpan', 'Pesan kepala sekolah berhasil diperbarui.')
  })

  return (
    <SettingsPageShell
      title="Kepala Sekolah"
      description="Pesan sambutan kepala sekolah di landing page"
      breadcrumbLabel="Kepala Sekolah"
      isLoading={isLoading}
    >
      <form onSubmit={onSubmit}>
        <Card className="border-none shadow-soft">
          <CardHeader>
            <CardTitle>Pesan Kepala Sekolah</CardTitle>
            <CardDescription>Nama, jabatan, foto, dan pesan sambutan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input id="name" {...register('name', { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Jabatan</Label>
                <Input id="title" {...register('title')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Foto</Label>
              <ImageUploader
                value={watch('photo')}
                onChange={(url) => setValue('photo', url)}
                onUpload={uploadMediaFile}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Pesan</Label>
              <Textarea id="message" rows={8} {...register('message', { required: true })} />
            </div>
            <Button type="submit" variant="gradient" className="min-h-10 w-full sm:w-auto" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </SettingsPageShell>
  )
}
