import { useParams } from 'react-router-dom'

import { BackButton } from '@/components/common/BackButton'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { usePublicTeacher } from '@/hooks/usePublicContent'

export function TeacherDetailPage() {
  const { slug = '' } = useParams()
  const { data: teacher, isLoading, isError } = usePublicTeacher(slug)

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !teacher) {
    return (
      <div className="container mx-auto px-4 py-24 text-center lg:px-8">
        <h1 className="text-2xl font-bold">Guru tidak ditemukan</h1>
        <BackButton to="/guru" label="Kembali ke Guru" variant="gradient" className="mt-6" />
      </div>
    )
  }

  const name = String(teacher.name ?? 'Guru')

  return (
    <PublicPageShell backTo="/guru" backLabel="Kembali ke Guru" title={name} description={String(teacher.position ?? teacher.subject ?? name)}>
      <article className="mx-auto max-w-3xl">
<div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
          <Avatar className="mb-4 h-28 w-28 ring-4 ring-primary/10 sm:mb-0 sm:mr-6">
            {teacher.photo ? (
              <AvatarImage src={String(teacher.photo)} alt={name} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-3xl font-semibold text-primary">
                {name.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{name}</h1>
            {teacher.position ? <p className="mt-2 text-lg text-primary">{String(teacher.position)}</p> : null}
            {teacher.subject ? <p className="mt-1 text-muted-foreground">{String(teacher.subject)}</p> : null}
          </div>
        </div>

        {teacher.biography ? (
          <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
            {String(teacher.biography)}
          </p>
        ) : null}
      </article>
    </PublicPageShell>
  )
}
