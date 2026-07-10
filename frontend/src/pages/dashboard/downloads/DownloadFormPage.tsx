import { endpoints } from '@/api/endpoints'
import { downloadDocumentFromApi, downloadDocumentToApi } from '@/api/mappers'
import { CmsFormPage } from '@/components/common/CmsFormPage'
import { ImageUploader } from '@/components/common/ImageUploader'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { uploadMediaFile } from '@/hooks/useMediaUpload'
import { downloadDocumentSchema, type DownloadDocumentFormData } from '@/validators/cms'

export function DownloadFormPage() {
  return (
    <CmsFormPage<DownloadDocumentFormData>
      title="Unduhan"
      breadcrumbLabel="Unduhan"
      listPath="/dashboard/downloads"
      queryKey="download-documents"
      schema={downloadDocumentSchema}
      defaultValues={{ isPublished: true, title: '', filePath: '', order: 0 }}
      createUrl={endpoints.downloadDocuments.create}
      detailUrl={endpoints.downloadDocuments.detail}
      updateUrl={endpoints.downloadDocuments.update}
      toApi={downloadDocumentToApi}
      fromApi={downloadDocumentFromApi}
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
            <Textarea id="description" rows={3} {...register('description')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Input id="category" placeholder="general" {...register('category')} />
          </div>
          <div className="space-y-2">
            <Label>File (upload)</Label>
            <ImageUploader
              value={watch('filePath')}
              onChange={(url) => setValue('filePath', url, { shouldValidate: true })}
              onUpload={uploadMediaFile}
              label="Upload file"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filePath">Path File</Label>
            <Input id="filePath" placeholder="/storage/..." {...register('filePath')} />
            {errors.filePath && (
              <p className="text-sm text-destructive">{errors.filePath.message}</p>
            )}
          </div>
        </>
      )}
    </CmsFormPage>
  )
}
