import { Plus, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import { ImageUploader } from '@/components/common/ImageUploader'
import { SettingsPageShell } from '@/components/settings/SettingsPageShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGeneralSettings, useSaveGeneralSettings, type GeneralSettingsForm } from '@/hooks/useSettingsApi'
import { uploadMediaFile } from '@/hooks/useMediaUpload'
import { useNotificationStore } from '@/stores/notificationStore'

export function GeneralSettingsPage() {
  const { data, isLoading } = useGeneralSettings()
  const saveMutation = useSaveGeneralSettings()
  const { success } = useNotificationStore()

  const { register, handleSubmit, reset, control, setValue, watch } = useForm<GeneralSettingsForm>({
    defaultValues: {
      schoolName: '',
      schoolTagline: '',
      schoolLogo: '',
      ppdbUrl: '',
      heroStats: [],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'heroStats' })
  const schoolLogo = watch('schoolLogo')

  useEffect(() => {
    if (data) reset(data)
  }, [data, reset])

  const onSubmit = handleSubmit(async (form) => {
    await saveMutation.mutateAsync(form)
    success('Pengaturan disimpan', 'Pengaturan umum berhasil diperbarui.')
  })

  return (
    <SettingsPageShell
      title="Pengaturan Umum"
      description="Nama sekolah, tagline, logo, PPDB, dan statistik hero"
      breadcrumbLabel="Umum"
      isLoading={isLoading}
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <Card className="border-none shadow-soft">
          <CardHeader>
            <CardTitle>Identitas Sekolah</CardTitle>
            <CardDescription>Informasi dasar yang tampil di seluruh website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="schoolName">Nama Sekolah</Label>
              <Input id="schoolName" {...register('schoolName', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schoolTagline">Tagline</Label>
              <Input id="schoolTagline" {...register('schoolTagline')} />
            </div>
            <div className="space-y-2">
              <Label>Logo Sekolah</Label>
              <ImageUploader
                value={schoolLogo}
                onChange={(url) => setValue('schoolLogo', url)}
                onUpload={uploadMediaFile}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ppdbUrl">URL PPDB / Pendaftaran</Label>
              <Input id="ppdbUrl" placeholder="/berita/... atau https://..." {...register('ppdbUrl')} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Statistik Hero</CardTitle>
              <CardDescription>Angka yang ditampilkan di bawah carousel hero</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ label: '', value: 0, suffix: '+' })}
            >
              <Plus className="h-4 w-4" />
              Tambah
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-[1fr_100px_80px_auto]">
                <div className="space-y-1">
                  <Label>Label</Label>
                  <Input {...register(`heroStats.${index}.label` as const)} />
                </div>
                <div className="space-y-1">
                  <Label>Nilai</Label>
                  <Input type="number" {...register(`heroStats.${index}.value` as const, { valueAsNumber: true })} />
                </div>
                <div className="space-y-1">
                  <Label>Suffix</Label>
                  <Input {...register(`heroStats.${index}.suffix` as const)} placeholder="+" />
                </div>
                <div className="flex items-end">
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button type="submit" variant="gradient" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </form>
    </SettingsPageShell>
  )
}
