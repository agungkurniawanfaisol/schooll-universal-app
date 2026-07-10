import { endpoints } from '@/api/endpoints'
import { extracurricularFromApi, extracurricularToApi } from '@/api/mappers'
import { CmsFormPage } from '@/components/common/CmsFormPage'
import { ImageUploader } from '@/components/common/ImageUploader'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { uploadMediaFile } from '@/hooks/useMediaUpload'
import { extracurricularSchema, type ExtracurricularFormData } from '@/validators/cms'

export function ExtracurricularFormPage() {
  return (
    <CmsFormPage<ExtracurricularFormData>
      title="Ekstrakurikuler"
      breadcrumbLabel="Ekstrakurikuler"
      listPath="/dashboard/extracurriculars"
      queryKey="extracurriculars"
      schema={extracurricularSchema}
      defaultValues={{ isPublished: true, title: '', members: [], order: 0 }}
      createUrl={endpoints.extracurriculars.create}
      detailUrl={endpoints.extracurriculars.detail}
      updateUrl={endpoints.extracurriculars.update}
      toApi={extracurricularToApi}
      fromApi={extracurricularFromApi}
    >
      {({ register, errors, setValue, watch }) => (
        <>
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...register('slug')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" rows={4} {...register('description')} />
          </div>
          <div className="space-y-2">
            <Label>Gambar</Label>
            <ImageUploader
              value={watch('image')}
              onChange={(url) => setValue('image', url)}
              onUpload={uploadMediaFile}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="schedule">Jadwal</Label>
              <Input id="schedule" placeholder="Senin 15:00" {...register('schedule')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coach">Pelatih</Label>
              <Input id="coach" {...register('coach')} />
            </div>
          </div>
        </>
      )}
    </CmsFormPage>
  )
}
