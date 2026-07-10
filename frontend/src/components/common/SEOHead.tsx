import { Helmet } from 'react-helmet-async'

import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useSchoolName } from '@/hooks/useSchoolName'

interface SEOHeadProps {
  title?: string
  /** When true, `title` is used as the full document title (no site name suffix). */
  titleAsFull?: boolean
  siteName?: string
  description?: string
  keywords?: string | string[]
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  structuredData?: Record<string, unknown>
  noIndex?: boolean
}

export function SEOHead({
  title,
  titleAsFull = false,
  siteName,
  description = 'Website resmi sekolah — informasi akademik, kegiatan, dan prestasi.',
  keywords = ['sekolah', 'pendidikan', 'indonesia'],
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  structuredData,
  noIndex = false,
}: SEOHeadProps) {
  const resolvedSiteName = useSchoolName(siteName)
  const fullTitle =
    titleAsFull && title ? title : title ? `${title} | ${resolvedSiteName}` : resolvedSiteName
  const keywordStr = Array.isArray(keywords) ? keywords.join(', ') : keywords
  const ogT = ogTitle ?? fullTitle
  const ogD = ogDescription ?? description

  useDocumentTitle(fullTitle)

  return (
    <Helmet key={fullTitle}>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordStr} />
      {canonical && <link rel="canonical" href={canonical} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={ogT} />
      <meta property="og:description" content={ogD} />
      <meta property="og:type" content="website" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogT} />
      <meta name="twitter:description" content={ogD} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
    </Helmet>
  )
}
