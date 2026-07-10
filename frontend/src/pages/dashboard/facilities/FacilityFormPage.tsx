import { endpoints } from '@/api/endpoints'
import { facilityFromApi, facilityToApi } from '@/api/mappers'
import { CmsFormPage } from '@/components/common/CmsFormPage'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { facilitySchema, type FacilityFormData } from '@/validators/cms'

export function FacilityFormPage() {
  return (
    <CmsFormPage<FacilityFormData>
      title="Fasilitas"
      breadcrumbLabel="Fasilitas"
      listPath="/dashboard/facilities"
      queryKey="facilities"
      schema={facilitySchema}
      defaultValues={{ isPublished: true, order: 0, name: '', description: '' }}
      createUrl={endpoints.facilities.create}
      detailUrl={endpoints.facilities.detail}
      updateUrl={endpoints.facilities.update}
      toApi={facilityToApi}
      fromApi={facilityFromApi}
    >
      {({ register, errors }) => (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Nama Fasilitas</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
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
