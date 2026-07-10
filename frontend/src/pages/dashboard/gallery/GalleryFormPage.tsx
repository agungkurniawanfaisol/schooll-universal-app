import { endpoints } from '@/api/endpoints'
import { galleryFromApi, galleryToApi } from '@/api/mappers'
import { CmsFormPage } from '@/components/common/CmsFormPage'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { gallerySchema, type GalleryFormData } from '@/validators/cms'

export function GalleryFormPage() {
  return (
    <CmsFormPage<GalleryFormData>
      title="Galeri"
      breadcrumbLabel="Galeri"
      listPath="/dashboard/gallery"
      queryKey="galleries"
      schema={gallerySchema}
      defaultValues={{ isPublished: true, order: 0, title: '', imageUrl: '', category: 'general' }}
      createUrl={endpoints.galleries.create}
      detailUrl={endpoints.galleries.detail}
      updateUrl={endpoints.galleries.update}
      toApi={galleryToApi}
      fromApi={galleryFromApi}
    >
      {({ register, errors }) => (
        <>
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL Gambar</Label>
            <Input id="imageUrl" {...register('imageUrl')} />
            {errors.imageUrl && (
              <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" {...register('description')} />
          </div>
        </>
      )}
    </CmsFormPage>
  )
}
