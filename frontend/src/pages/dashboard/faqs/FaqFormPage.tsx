import { endpoints } from '@/api/endpoints'
import { faqFromApi, faqToApi } from '@/api/mappers'
import { CmsFormPage } from '@/components/common/CmsFormPage'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { faqSchema, type FaqFormData } from '@/validators/cms'

export function FaqFormPage() {
  return (
    <CmsFormPage<FaqFormData>
      title="FAQ"
      breadcrumbLabel="FAQ"
      listPath="/dashboard/faqs"
      queryKey="faqs"
      schema={faqSchema}
      defaultValues={{ isPublished: true, question: '', answer: '', order: 0 }}
      createUrl={endpoints.faqs.create}
      detailUrl={endpoints.faqs.detail}
      updateUrl={endpoints.faqs.update}
      toApi={faqToApi}
      fromApi={faqFromApi}
    >
      {({ register, errors }) => (
        <>
          <div className="space-y-2">
            <Label htmlFor="question">Pertanyaan</Label>
            <Input id="question" {...register('question')} />
            {errors.question && (
              <p className="text-sm text-destructive">{errors.question.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer">Jawaban</Label>
            <Textarea id="answer" rows={5} {...register('answer')} />
            {errors.answer && <p className="text-sm text-destructive">{errors.answer.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Input id="category" placeholder="general" {...register('category')} />
          </div>
        </>
      )}
    </CmsFormPage>
  )
}
