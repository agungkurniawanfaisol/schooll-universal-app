import { endpoints } from '@/api/endpoints'
import { newsFromApi, newsToApi } from '@/api/mappers'
import { ImageUploader } from '@/components/common/ImageUploader'
import { RichTextEditor } from '@/components/common/RichTextEditor'
import { CmsFormPage } from '@/components/common/CmsFormPage'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { uploadMediaFile } from '@/hooks/useMediaUpload'
import { newsSchema, type NewsFormData } from '@/validators/cms'

export function NewsFormPage() {
  return (
    <CmsFormPage<NewsFormData>
      title="Berita"
      breadcrumbLabel="Berita"
      listPath="/dashboard/news"
      queryKey="news"
      schema={newsSchema}
      defaultValues={{
        isPublished: true,
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        tags: [],
      }}
      createUrl={endpoints.news.create}
      detailUrl={endpoints.news.detail}
      updateUrl={endpoints.news.update}
      toApi={newsToApi}
      fromApi={newsFromApi}
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
            {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">Ringkasan</Label>
            <Textarea id="excerpt" rows={3} {...register('excerpt')} />
            {errors.excerpt && (
              <p className="text-sm text-destructive">{errors.excerpt.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Konten</Label>
            <RichTextEditor
              value={watch('content') ?? ''}
              onChange={(html) => setValue('content', html, { shouldValidate: true })}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <ImageUploader
              value={watch('coverImage')}
              onChange={(url) => setValue('coverImage', url)}
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
