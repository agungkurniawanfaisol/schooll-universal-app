import { endpoints } from '@/api/endpoints'
import { agendaFromApi, agendaToApi } from '@/api/mappers'
import { ImageUploader } from '@/components/common/ImageUploader'
import { CmsFormPage } from '@/components/common/CmsFormPage'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { uploadMediaFile } from '@/hooks/useMediaUpload'
import { agendaSchema, type AgendaFormData } from '@/validators/cms'

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

export function AgendaFormPage() {
  return (
    <CmsFormPage<AgendaFormData>
      title="Agenda"
      breadcrumbLabel="Agenda"
      listPath="/dashboard/agenda"
      queryKey="agendas"
      schema={agendaSchema}
      defaultValues={{ isPublished: true, title: '', slug: '', startDate: '' }}
      createUrl={endpoints.agendas.create}
      detailUrl={endpoints.agendas.detail}
      updateUrl={endpoints.agendas.update}
      toApi={agendaToApi}
      fromApi={agendaFromApi}
    >
      {({ register, errors, setValue, watch }) => (
        <>
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              {...register('title', {
                onChange: (e) => {
                  if (!watch('slug')) {
                    setValue('slug', slugify(e.target.value))
                  }
                },
              })}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...register('slug')} />
            {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Tanggal & Waktu Acara</Label>
              <Input id="startDate" type="datetime-local" {...register('startDate')} />
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Tanggal Selesai Acara (opsional)</Label>
              <Input id="endDate" type="date" {...register('endDate')} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input id="location" {...register('location')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" rows={5} {...register('description')} />
          </div>
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <ImageUploader
              value={watch('image')}
              onChange={(url) => setValue('image', url)}
              onUpload={uploadMediaFile}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="publishStartAt">Tampil dari</Label>
              <Input id="publishStartAt" type="datetime-local" {...register('publishStartAt')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publishEndAt">Tampil sampai (opsional)</Label>
              <Input id="publishEndAt" type="datetime-local" {...register('publishEndAt')} />
            </div>
          </div>
        </>
      )}
    </CmsFormPage>
  )
}
