import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { ImageUploader } from '@/components/common/ImageUploader'
import { SettingsPageShell } from '@/components/settings/SettingsPageShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useFooter, useSaveFooter } from '@/hooks/useContentApi'
import { uploadMediaFile } from '@/hooks/useMediaUpload'
import { useNotificationStore } from '@/stores/notificationStore'

interface FooterForm {
  copyright_text: string
  description: string
  logo: string
}

export function FooterSettingsPage() {
  const { data, isLoading } = useFooter()
  const saveMutation = useSaveFooter()
  const { success } = useNotificationStore()

  const { register, handleSubmit, reset, setValue, watch } = useForm<FooterForm>({
    defaultValues: { copyright_text: '', description: '', logo: '' },
  })

  useEffect(() => {
    if (data) {
      reset({
        copyright_text: String(data.copyright_text ?? ''),
        description: String(data.description ?? ''),
        logo: String(data.logo ?? ''),
      })
    }
  }, [data, reset])

  const onSubmit = handleSubmit(async (form) => {
    await saveMutation.mutateAsync({ ...form, status: 'published' })
    success('Pengaturan disimpan', 'Footer berhasil diperbarui.')
  })

  return (
    <SettingsPageShell
      title="Pengaturan Footer"
      description="Copyright, deskripsi, dan logo footer"
      breadcrumbLabel="Footer"
      isLoading={isLoading}
    >
      <form onSubmit={onSubmit}>
        <Card className="border-none shadow-soft">
          <CardHeader>
            <CardTitle>Footer Website</CardTitle>
            <CardDescription>Konten bagian bawah landing page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="copyright_text">Teks Copyright</Label>
              <Input id="copyright_text" {...register('copyright_text')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea id="description" rows={4} {...register('description')} />
            </div>
            <div className="space-y-2">
              <Label>Logo Footer</Label>
              <ImageUploader
                value={watch('logo')}
                onChange={(url) => setValue('logo', url)}
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
