import { SectionHeader } from '@/features/landing/SectionHeader'

interface PublicPageHeaderProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function PublicPageHeader({
  eyebrow,
  title,
  description,
  align = 'center',
}: PublicPageHeaderProps) {
  return (
    <SectionHeader
      eyebrow={eyebrow}
      title={title}
      description={description}
      align={align}
      className="mb-4"
    />
  )
}
