import { endpoints } from '@/api/endpoints'
import { galleryFromApi, galleryToApi } from '@/api/mappers'
import { CmsFormPage } from '@/components/common/CmsFormPage'
import { ImageUploader } from '@/components/common/ImageUploader'
import { MultiImageUploader } from '@/components/common/MultiImageUploader'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { uploadMediaFile } from '@/hooks/useMediaUpload'
import { gallerySchema, type GalleryFormData } from '@/validators/cms'

export function GalleryFormPage() {
  return (
    <CmsFormPage<GalleryFormData>
      title="Galeri"
      breadcrumbLabel="Galeri"
      listPath="/dashboard/gallery"
      queryKey="galleries"
      schema={gallerySchema}
      defaultValues={{
        isPublished: true,
        order: 0,
        title: '',
        coverImage: '',
        albumImages: [],
        category: 'general',
      }}
      createUrl={endpoints.galleries.create}
      detailUrl={endpoints.galleries.detail}
      updateUrl={endpoints.galleries.update}
      toApi={galleryToApi}
      fromApi={galleryFromApi}
    >
      {({ register, errors, setValue, watch }) => (
        <>
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Foto Cover</Label>
            <ImageUploader
              value={watch('coverImage')}
              onChange={(url) => setValue('coverImage', url, { shouldValidate: true })}
              onUpload={uploadMediaFile}
              label="Upload foto cover album"
            />
            {errors.coverImage && (
              <p className="text-sm text-destructive">{errors.coverImage.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Foto Album</Label>
            <MultiImageUploader
              value={watch('albumImages') ?? []}
              onChange={(urls) => setValue('albumImages', urls, { shouldValidate: true })}
              onUpload={uploadMediaFile}
              label="Tambah foto ke album"
            />
            {errors.albumImages && (
              <p className="text-sm text-destructive">{errors.albumImages.message}</p>
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
