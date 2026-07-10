import { endpoints } from '@/api/endpoints'
import { achievementFromApi, achievementToApi } from '@/api/mappers'
import { CmsFormPage } from '@/components/common/CmsFormPage'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { achievementSchema, type AchievementFormData } from '@/validators/cms'

export function AchievementFormPage() {
  return (
    <CmsFormPage<AchievementFormData>
      title="Prestasi"
      breadcrumbLabel="Prestasi"
      listPath="/dashboard/achievements"
      queryKey="achievements"
      schema={achievementSchema}
      defaultValues={{
        isPublished: true,
        title: '',
        description: '',
        year: new Date().getFullYear(),
        category: 'akademik',
      }}
      createUrl={endpoints.achievements.create}
      detailUrl={endpoints.achievements.detail}
      updateUrl={endpoints.achievements.update}
      toApi={achievementToApi}
      fromApi={achievementFromApi}
    >
      {({ register, errors, setValue, watch }) => (
        <>
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Tahun</Label>
            <Input
              id="year"
              type="number"
              value={watch('year')}
              onChange={(e) => setValue('year', Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Input id="category" {...register('category')} />
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
