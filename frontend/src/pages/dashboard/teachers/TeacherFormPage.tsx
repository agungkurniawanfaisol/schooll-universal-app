import { endpoints } from '@/api/endpoints'
import { teacherFromApi, teacherToApi } from '@/api/mappers'
import { CmsFormPage } from '@/components/common/CmsFormPage'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { teacherSchema, type TeacherFormData } from '@/validators/cms'

export function TeacherFormPage() {
  return (
    <CmsFormPage<TeacherFormData>
      title="Guru"
      breadcrumbLabel="Guru"
      listPath="/dashboard/teachers"
      queryKey="teachers"
      schema={teacherSchema}
      defaultValues={{ isPublished: true, order: 0, name: '', subject: '' }}
      createUrl={endpoints.teachers.create}
      detailUrl={endpoints.teachers.detail}
      updateUrl={endpoints.teachers.update}
      toApi={teacherToApi}
      fromApi={teacherFromApi}
    >
      {({ register, errors }) => (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Jabatan</Label>
            <Input id="position" {...register('position')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Mata Pelajaran</Label>
            <Input id="subject" {...register('subject')} />
            {errors.subject && (
              <p className="text-sm text-destructive">{errors.subject.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Biografi</Label>
            <Textarea id="bio" {...register('bio')} />
          </div>
        </>
      )}
    </CmsFormPage>
  )
}
