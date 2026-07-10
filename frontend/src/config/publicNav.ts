import type { ApiRecord } from '@/api/utils'

export interface PublicNavItem {
  id: string
  label: string
  href?: string
  children?: PublicNavItem[]
}

export const defaultPublicNavTree: PublicNavItem[] = [
  { id: 'beranda', label: 'Beranda', href: '/#hero' },
  {
    id: 'profil',
    label: 'Profil Sekolah',
    children: [
      { id: 'tentang', label: 'Tentang', href: '/#tentang' },
      { id: 'visi-misi', label: 'Visi & Misi', href: '/visi-misi' },
      { id: 'kepala-sekolah', label: 'Kepala Sekolah', href: '/#kepala-sekolah' },
    ],
  },
  {
    id: 'akademik',
    label: 'Akademik',
    children: [
      { id: 'guru', label: 'Guru', href: '/guru' },
      { id: 'kegiatan', label: 'Kegiatan', href: '/kegiatan' },
    ],
  },
  {
    id: 'informasi',
    label: 'Informasi',
    children: [
      { id: 'agenda', label: 'Agenda', href: '/agenda' },
      { id: 'berita', label: 'Berita', href: '/berita' },
      { id: 'galeri', label: 'Galeri', href: '/galeri' },
    ],
  },
  {
    id: 'fasilitas',
    label: 'Fasilitas & Prestasi',
    children: [
      { id: 'fasilitas-item', label: 'Fasilitas', href: '/fasilitas' },
      { id: 'prestasi', label: 'Prestasi', href: '/prestasi' },
      { id: 'testimoni', label: 'Testimoni', href: '/testimoni' },
    ],
  },
  { id: 'kontak', label: 'Kontak', href: '/#kontak' },
]

function mapApiNavItems(items: ApiRecord[]): PublicNavItem[] {
  return items.map((item) => {
    const children = item.children as ApiRecord[] | undefined
    return {
      id: String(item.id ?? item.label),
      label: String(item.label),
      href: item.url ? String(item.url) : undefined,
      children: children?.length ? mapApiNavItems(children) : undefined,
    }
  })
}

export function resolvePublicNav(apiNav?: ApiRecord[]): PublicNavItem[] {
  if (!apiNav?.length) return defaultPublicNavTree

  const hasTree = apiNav.some((item) => {
    const children = item.children as ApiRecord[] | undefined
    return Boolean(children?.length)
  })

  if (!hasTree) return defaultPublicNavTree

  return mapApiNavItems(apiNav)
}

export function isRouteLink(href: string): boolean {
  return href.startsWith('/') && !href.includes('#')
}

export function isNavItemActive(pathname: string, hash: string, href?: string): boolean {
  if (!href) return false
  if (isRouteLink(href)) return pathname === href || pathname.startsWith(`${href}/`)
  const [path, anchor] = href.split('#')
  if (path && path !== '/' && pathname !== path) return false
  if (anchor) return hash === `#${anchor}` || (pathname === '/' && hash === `#${anchor}`)
  return pathname === href
}

export function isNavBranchActive(pathname: string, hash: string, item: PublicNavItem): boolean {
  if (item.href && isNavItemActive(pathname, hash, item.href)) return true
  return item.children?.some((child) => isNavBranchActive(pathname, hash, child)) ?? false
}

export function collectActiveBranchIds(
  pathname: string,
  hash: string,
  items: PublicNavItem[] = defaultPublicNavTree,
): string[] {
  const ids: string[] = []
  for (const item of items) {
    if (item.children?.length && isNavBranchActive(pathname, hash, item)) {
      ids.push(item.id)
    }
  }
  return ids
}
