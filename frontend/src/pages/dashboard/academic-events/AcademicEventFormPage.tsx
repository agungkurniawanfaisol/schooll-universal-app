import { endpoints } from '@/api/endpoints'
import { academicEventFromApi, academicEventToApi } from '@/api/mappers'
import { CmsFormPage } from '@/components/common/CmsFormPage'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { academicEventSchema, type AcademicEventFormData } from '@/validators/cms'

export function AcademicEventFormPage() {
  return (
    <CmsFormPage<AcademicEventFormData>
      title="Kalender Akademik"
      breadcrumbLabel="Kalender Akademik"
      listPath="/dashboard/academic-events"
      queryKey="academic-events"
      schema={academicEventSchema}
      defaultValues={{ isPublished: true, title: '', startDate: '', order: 0 }}
      createUrl={endpoints.academicEvents.create}
      detailUrl={endpoints.academicEvents.detail}
      updateUrl={endpoints.academicEvents.update}
      toApi={academicEventToApi}
      fromApi={academicEventFromApi}
    >
      {({ register, errors }) => (
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="eventType">Tipe Event</Label>
              <Input id="eventType" placeholder="activity, holiday, exam" {...register('eventType')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Warna</Label>
              <Input id="color" type="color" {...register('color')} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Tanggal Mulai</Label>
              <Input id="startDate" type="date" {...register('startDate')} />
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Tanggal Selesai</Label>
              <Input id="endDate" type="date" {...register('endDate')} />
            </div>
          </div>
        </>
      )}
    </CmsFormPage>
  )
}
