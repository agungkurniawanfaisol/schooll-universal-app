import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { ImageUploader } from '@/components/common/ImageUploader'
import { SettingsPageShell } from '@/components/settings/SettingsPageShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAboutSchool, useSaveAboutSchool } from '@/hooks/useContentApi'
import { uploadMediaFile } from '@/hooks/useMediaUpload'
import { useNotificationStore } from '@/stores/notificationStore'

interface AboutForm {
  title: string
  content: string
  image: string
  video_url: string
}

export function AboutSettingsPage() {
  const { data, isLoading } = useAboutSchool()
  const saveMutation = useSaveAboutSchool()
  const { success } = useNotificationStore()

  const { register, handleSubmit, reset, setValue, watch } = useForm<AboutForm>({
    defaultValues: { title: '', content: '', image: '', video_url: '' },
  })

  useEffect(() => {
    if (data) {
      reset({
        title: String(data.title ?? ''),
        content: String(data.content ?? ''),
        image: String(data.image ?? ''),
        video_url: String(data.video_url ?? ''),
      })
    }
  }, [data, reset])

  const onSubmit = handleSubmit(async (form) => {
    await saveMutation.mutateAsync({ ...form, status: 'published' })
    success('Pengaturan disimpan', 'Konten tentang sekolah berhasil diperbarui.')
  })

  return (
    <SettingsPageShell
      title="Pengaturan Tentang"
      description="Section tentang sekolah di landing page"
      breadcrumbLabel="Tentang Sekolah"
      isLoading={isLoading}
    >
      <form onSubmit={onSubmit}>
        <Card className="border-none shadow-soft">
          <CardHeader>
            <CardTitle>Tentang Sekolah</CardTitle>
            <CardDescription>Judul, konten, dan media section tentang</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input id="title" {...register('title', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Konten (HTML)</Label>
              <Textarea id="content" rows={8} {...register('content')} />
            </div>
            <div className="space-y-2">
              <Label>Gambar</Label>
              <ImageUploader
                value={watch('image')}
                onChange={(url) => setValue('image', url)}
                onUpload={uploadMediaFile}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video_url">URL Video (opsional)</Label>
              <Input id="video_url" placeholder="https://youtube.com/..." {...register('video_url')} />
            </div>
            <Button type="submit" variant="gradient" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </SettingsPageShell>
  )
}
