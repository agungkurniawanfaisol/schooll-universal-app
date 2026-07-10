import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm, type DefaultValues, type FieldValues } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { z } from 'zod'

import type { ApiRecord } from '@/api/utils'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { SEOHead } from '@/components/common/SEOHead'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useResourceDetail, useResourceMutation } from '@/hooks/usePaginatedList'
import { useNotificationStore } from '@/stores/notificationStore'

interface CmsFormPageProps<TForm extends FieldValues & { isPublished: boolean }> {
  title: string
  breadcrumbLabel: string
  listPath: string
  queryKey: string
  schema: z.ZodType<TForm>
  defaultValues: DefaultValues<TForm>
  createUrl: string
  detailUrl: (id: string) => string
  updateUrl: (id: string) => string
  toApi: (data: TForm) => Record<string, unknown>
  fromApi: (item: ApiRecord) => TForm
  children: (props: {
    register: ReturnType<typeof useForm<TForm>>['register']
    errors: ReturnType<typeof useForm<TForm>>['formState']['errors']
    setValue: ReturnType<typeof useForm<TForm>>['setValue']
    watch: ReturnType<typeof useForm<TForm>>['watch']
  }) => React.ReactNode
}

export function CmsFormPage<TForm extends FieldValues & { isPublished: boolean }>({
  title,
  breadcrumbLabel,
  listPath,
  queryKey,
  schema,
  defaultValues,
  createUrl,
  detailUrl,
  updateUrl,
  toApi,
  fromApi,
  children,
}: CmsFormPageProps<TForm>) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success } = useNotificationStore()
  const isEdit = Boolean(id)

  const { data, isLoading } = useResourceDetail({
    queryKey,
    detailUrl: detailUrl(id!),
    enabled: isEdit,
    fromApi,
  })

  const form = useForm<TForm>({
    // Zod v4 + generic form types require a narrow cast at the resolver boundary.
    resolver: zodResolver(schema as z.ZodType<TForm, TForm>),
    defaultValues,
  })

  const { register, handleSubmit, setValue, watch, reset, formState } = form
  const { errors, isSubmitting } = formState

  useEffect(() => {
    if (data) reset(data)
  }, [data, reset])

  const mutation = useResourceMutation<TForm>({
    queryKey,
    createUrl,
    updateUrl: isEdit ? updateUrl(id!) : undefined,
    toApi,
  })

  const isPublished = Boolean(watch('isPublished' as never))

  const onSubmit = async (formData: TForm) => {
    await mutation.mutateAsync({ id, data: formData })
    success(isEdit ? 'Berhasil diperbarui' : 'Berhasil ditambahkan')
    navigate(listPath)
  }

  if (isEdit && isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <>
      <SEOHead title={isEdit ? `Edit ${title}` : `Tambah ${title}`} noIndex />
      <div className="mx-auto max-w-2xl space-y-6 pb-24 md:pb-0">
        <PageHeader
          title={isEdit ? `Edit ${title}` : `Tambah ${title}`}
          backTo={listPath}
          backLabel={`Kembali ke ${breadcrumbLabel}`}
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: breadcrumbLabel, href: listPath },
            { label: isEdit ? 'Edit' : 'Tambah' },
          ]}
        />
        <Card className="border-none shadow-soft">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {children({ register, errors, setValue, watch })}
              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <div>
                  <Label>Publikasikan</Label>
                  <p className="text-sm text-muted-foreground">Tampilkan di website publik</p>
                </div>
                <Switch
                  checked={Boolean(isPublished)}
                  onCheckedChange={(v) => setValue('isPublished' as never, v as never)}
                />
              </div>
              <div className="fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-border bg-background/95 p-4 backdrop-blur md:static md:border-0 md:bg-transparent md:p-0 md:pt-2">
                <Button
                  type="submit"
                  variant="gradient"
                  className="min-h-10 flex-1 md:flex-none"
                  disabled={isSubmitting || mutation.isPending}
                >
                  {isSubmitting || mutation.isPending ? 'Menyimpan...' : 'Simpan'}
                </Button>
                <Button type="button" variant="outline" className="min-h-10 flex-1 md:flex-none" asChild>
                  <Link to={listPath}>Batal</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
