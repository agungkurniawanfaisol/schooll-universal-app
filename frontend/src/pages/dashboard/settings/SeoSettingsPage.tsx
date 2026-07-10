import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { ImageUploader } from '@/components/common/ImageUploader'
import { SettingsPageShell } from '@/components/settings/SettingsPageShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useSaveSeoHome, useSeoHome } from '@/hooks/useContentApi'
import { uploadMediaFile } from '@/hooks/useMediaUpload'
import { useNotificationStore } from '@/stores/notificationStore'
import type { ApiRecord } from '@/api/utils'

interface SeoForm {
  title: string
  description: string
  keywords: string
  og_title: string
  og_description: string
  og_image: string
}

export function SeoSettingsPage() {
  const { data, isLoading } = useSeoHome()
  const saveMutation = useSaveSeoHome()
  const { success } = useNotificationStore()

  const { register, handleSubmit, reset, setValue, watch } = useForm<SeoForm>({
    defaultValues: {
      title: '',
      description: '',
      keywords: '',
      og_title: '',
      og_description: '',
      og_image: '',
    },
  })

  useEffect(() => {
    if (data) {
      reset({
        title: String(data.title ?? ''),
        description: String(data.description ?? ''),
        keywords: String(data.keywords ?? ''),
        og_title: String(data.og_title ?? ''),
        og_description: String(data.og_description ?? ''),
        og_image: String(data.og_image ?? ''),
      })
    }
  }, [data, reset])

  const onSubmit = handleSubmit(async (form) => {
    await saveMutation.mutateAsync(form as unknown as ApiRecord)
    success('Pengaturan disimpan', 'Pengaturan SEO berhasil diperbarui.')
  })

  return (
    <SettingsPageShell
      title="Pengaturan SEO"
      description="Meta title, description, dan Open Graph halaman beranda"
      breadcrumbLabel="SEO"
      isLoading={isLoading}
    >
      <form onSubmit={onSubmit}>
        <Card className="border-none shadow-soft">
          <CardHeader>
            <CardTitle>SEO Halaman Beranda</CardTitle>
            <CardDescription>Optimasi mesin pencari untuk landing page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Meta Title</Label>
              <Input id="title" {...register('title')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Meta Description</Label>
              <Textarea id="description" rows={3} {...register('description')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input id="keywords" placeholder="smp, sekolah, pendidikan" {...register('keywords')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="og_title">OG Title</Label>
              <Input id="og_title" {...register('og_title')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="og_description">OG Description</Label>
              <Textarea id="og_description" rows={3} {...register('og_description')} />
            </div>
            <div className="space-y-2">
              <Label>OG Image</Label>
              <ImageUploader
                value={watch('og_image')}
                onChange={(url) => setValue('og_image', url)}
                onUpload={uploadMediaFile}
              />
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
