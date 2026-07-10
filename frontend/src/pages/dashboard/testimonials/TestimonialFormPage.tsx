import { endpoints } from '@/api/endpoints'
import { testimonialFromApi, testimonialToApi } from '@/api/mappers'
import { CmsFormPage } from '@/components/common/CmsFormPage'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { testimonialSchema, type TestimonialFormData } from '@/validators/cms'

export function TestimonialFormPage() {
  return (
    <CmsFormPage<TestimonialFormData>
      title="Testimoni"
      breadcrumbLabel="Testimoni"
      listPath="/dashboard/testimonials"
      queryKey="testimonials"
      schema={testimonialSchema}
      defaultValues={{ isPublished: true, order: 0, name: '', role: '', content: '', rating: 5 }}
      createUrl={endpoints.testimonials.create}
      detailUrl={endpoints.testimonials.detail}
      updateUrl={endpoints.testimonials.update}
      toApi={testimonialToApi}
      fromApi={testimonialFromApi}
    >
      {({ register, errors, setValue, watch }) => (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Pekerjaan / Peran</Label>
            <Input id="role" {...register('role')} />
            {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Testimoni</Label>
            <Textarea id="content" {...register('content')} />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="rating">Rating (1-5)</Label>
            <Input
              id="rating"
              type="number"
              min={1}
              max={5}
              value={watch('rating')}
              onChange={(e) => setValue('rating', Number(e.target.value))}
            />
          </div>
        </>
      )}
    </CmsFormPage>
  )
}
