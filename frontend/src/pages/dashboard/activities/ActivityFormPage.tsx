import { endpoints } from '@/api/endpoints'
import { activityFromApi, activityToApi } from '@/api/mappers'
import { CmsFormPage } from '@/components/common/CmsFormPage'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { activitySchema, type ActivityFormData } from '@/validators/cms'

export function ActivityFormPage() {
  return (
    <CmsFormPage<ActivityFormData>
      title="Kegiatan"
      breadcrumbLabel="Kegiatan"
      listPath="/dashboard/activities"
      queryKey="activities"
      schema={activitySchema}
      defaultValues={{ isPublished: true, title: '', description: '', date: '', category: 'general' }}
      createUrl={endpoints.activities.create}
      detailUrl={endpoints.activities.detail}
      updateUrl={endpoints.activities.update}
      toApi={activityToApi}
      fromApi={activityFromApi}
    >
      {({ register, errors }) => (
        <>
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Tanggal</Label>
            <Input id="date" type="date" {...register('date')} />
            {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" rows={5} {...register('description')} />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
        </>
      )}
    </CmsFormPage>
  )
}
