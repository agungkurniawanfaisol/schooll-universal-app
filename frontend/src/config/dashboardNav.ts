import type { LucideIcon } from 'lucide-react'
import {
  Building2,
  Calendar,
  Contact,
  Eye,
  FolderOpen,
  GraduationCap,
  HardDrive,
  HelpCircle,
  Image,
  LayoutDashboard,
  Link2,
  MessageSquare,
  MessageSquareQuote,
  Newspaper,
  Search,
  Settings,
  Share2,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Mail,
  ClipboardList,
  BarChart3,
  Webhook,
  Key,
  Download,
  FileText,
} from 'lucide-react'

export interface DashboardNavItem {
  id: string
  label: string
  href?: string
  icon: LucideIcon
  children?: DashboardNavItem[]
}

export const dashboardNavTree: DashboardNavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'content',
    label: 'Konten Website',
    icon: Newspaper,
    children: [
      { id: 'teachers', label: 'Guru', href: '/dashboard/teachers', icon: GraduationCap },
      { id: 'agenda', label: 'Agenda', href: '/dashboard/agenda', icon: Calendar },
      { id: 'gallery', label: 'Galeri', href: '/dashboard/gallery', icon: Image },
      { id: 'testimonials', label: 'Testimoni', href: '/dashboard/testimonials', icon: MessageSquare },
      { id: 'activities', label: 'Kegiatan', href: '/dashboard/activities', icon: Sparkles },
      { id: 'facilities', label: 'Fasilitas', href: '/dashboard/facilities', icon: Building2 },
      { id: 'achievements', label: 'Prestasi', href: '/dashboard/achievements', icon: Trophy },
      { id: 'news', label: 'Berita', href: '/dashboard/news', icon: Newspaper },
      { id: 'custom-pages', label: 'Halaman Kustom', href: '/dashboard/custom-pages', icon: FileText },
      { id: 'academic-events', label: 'Kalender Akademik', href: '/dashboard/academic-events', icon: Calendar },
      { id: 'downloads', label: 'Download', href: '/dashboard/downloads', icon: Download },
      { id: 'faqs', label: 'FAQ', href: '/dashboard/faqs', icon: HelpCircle },
      { id: 'extracurriculars', label: 'Ekstrakurikuler', href: '/dashboard/extracurriculars', icon: Sparkles },
    ],
  },
  {
    id: 'services',
    label: 'Layanan',
    icon: ClipboardList,
    children: [
      { id: 'ppdb', label: 'PPDB', href: '/dashboard/ppdb', icon: GraduationCap },
      { id: 'newsletter', label: 'Newsletter', href: '/dashboard/newsletter', icon: Mail },
    ],
  },
  {
    id: 'media',
    label: 'Media',
    icon: FolderOpen,
    children: [
      { id: 'media-manager', label: 'Media Manager', href: '/dashboard/media', icon: Image },
    ],
  },
  {
    id: 'settings',
    label: 'Pengaturan',
    icon: Settings,
    children: [
      { id: 'general', label: 'Umum', href: '/dashboard/settings/general', icon: Building2 },
      { id: 'hero', label: 'Hero Section', href: '/dashboard/settings/hero', icon: Sparkles },
      { id: 'about', label: 'Tentang Sekolah', href: '/dashboard/settings/about', icon: Eye },
      { id: 'vision-mission', label: 'Visi & Misi', href: '/dashboard/settings/vision-mission', icon: Eye },
      { id: 'principal', label: 'Kepala Sekolah', href: '/dashboard/settings/principal', icon: MessageSquareQuote },
      { id: 'contact', label: 'Kontak', href: '/dashboard/settings/contact', icon: Contact },
      { id: 'seo', label: 'SEO', href: '/dashboard/settings/seo', icon: Search },
      { id: 'navigation', label: 'Navigasi', href: '/dashboard/settings/navigation', icon: Link2 },
      { id: 'footer', label: 'Footer', href: '/dashboard/settings/footer', icon: LayoutDashboard },
      { id: 'social', label: 'Media Sosial', href: '/dashboard/settings/social', icon: Share2 },
    ],
  },
  {
    id: 'admin',
    label: 'Administrasi',
    icon: Shield,
    children: [
      { id: 'users', label: 'Pengguna', href: '/dashboard/users', icon: Users },
      { id: 'roles', label: 'Role & Akses', href: '/dashboard/roles', icon: Shield },
      { id: 'contacts', label: 'Pesan Kontak', href: '/dashboard/contacts', icon: Mail },
      { id: 'audit', label: 'Audit Log', href: '/dashboard/audit', icon: Eye },
      { id: 'analytics', label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    ],
  },
  {
    id: 'system',
    label: 'Sistem',
    icon: HardDrive,
    children: [
      { id: 'backup', label: 'Backup', href: '/dashboard/backup', icon: HardDrive },
      { id: 'webhooks', label: 'Webhooks', href: '/dashboard/webhooks', icon: Webhook },
      { id: 'api-tokens', label: 'API Tokens', href: '/dashboard/api-tokens', icon: Key },
      { id: 'tenants', label: 'Tenants', href: '/dashboard/tenants', icon: Building2 },
    ],
  },
]

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function isNavBranchActive(pathname: string, item: DashboardNavItem): boolean {
  if (item.href && isNavItemActive(pathname, item.href)) return true
  return item.children?.some((child) => isNavBranchActive(pathname, child)) ?? false
}

export function collectExpandedGroupIds(pathname: string, items: DashboardNavItem[] = dashboardNavTree): string[] {
  const ids: string[] = []
  for (const item of items) {
    if (item.children?.length && isNavBranchActive(pathname, item)) {
      ids.push(item.id)
    }
  }
  return ids
}
