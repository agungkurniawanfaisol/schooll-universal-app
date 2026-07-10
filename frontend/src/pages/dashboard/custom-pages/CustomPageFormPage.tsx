import { endpoints } from '@/api/endpoints'
import { customPageFromApi, customPageToApi } from '@/api/mappers'
import { CmsFormPage } from '@/components/common/CmsFormPage'
import { RichTextEditor } from '@/components/common/RichTextEditor'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { customPageSchema, type CustomPageFormData } from '@/validators/cms'

export function CustomPageFormPage() {
  return (
    <CmsFormPage<CustomPageFormData>
      title="Halaman Kustom"
      breadcrumbLabel="Halaman Kustom"
      listPath="/dashboard/custom-pages"
      queryKey="custom-pages"
      schema={customPageSchema}
      defaultValues={{ isPublished: true, title: '', content: '', order: 0 }}
      createUrl={endpoints.customPages.create}
      detailUrl={endpoints.customPages.detail}
      updateUrl={endpoints.customPages.update}
      toApi={customPageToApi}
      fromApi={customPageFromApi}
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
            <Input id="slug" placeholder="otomatis dari judul" {...register('slug')} />
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
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input id="metaTitle" {...register('metaTitle')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea id="metaDescription" rows={2} {...register('metaDescription')} />
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
