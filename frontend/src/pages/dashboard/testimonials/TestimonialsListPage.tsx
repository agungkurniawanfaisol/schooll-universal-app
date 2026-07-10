import { endpoints } from '@/api/endpoints'
import { mapTestimonialListRow } from '@/api/mappers'
import { CmsListPage } from '@/components/common/CmsListPage'

export function TestimonialsListPage() {
  return (
    <CmsListPage
      title="Kelola Testimoni"
      description="Daftar testimoni alumni dan orang tua"
      breadcrumbLabel="Testimoni"
      basePath="/dashboard/testimonials"
      queryKey="testimonials"
      listUrl={endpoints.testimonials.list}
      bulkDeleteUrl={endpoints.testimonials.bulkDelete}
      deleteUrl={endpoints.testimonials.delete}
      mapper={mapTestimonialListRow}
    />
  )
}
