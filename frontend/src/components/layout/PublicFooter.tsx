import { motion } from 'framer-motion'
import { Camera, GraduationCap, Globe, Mail, MapPin, MessageCircle, Phone, Play, Share2, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { isRouteLink } from '@/config/publicNav'
import { useLandingContext } from '@/features/landing/LandingDataContext'
import { fadeUp, springSoft, staggerContainer, viewportOnce } from '@/lib/motion'
import { resolveSafeMediaUrl } from '@/lib/safeMediaUrl'
import { cn } from '@/lib/utils'
import { NewsletterSubscribeForm } from '@/components/public/NewsletterSubscribeForm'

const socialIconMap: Record<string, LucideIcon> = {
  instagram: Camera,
  youtube: Play,
  facebook: Users,
  twitter: MessageCircle,
  x: MessageCircle,
  linkedin: Share2,
}

function FooterNavLink({ href, label }: { href?: string; label: string }) {
  const className =
    'text-sm text-muted-foreground transition-colors duration-300 hover:translate-x-0.5 hover:text-primary'

  if (!href) return <span className={className}>{label}</span>

  if (isRouteLink(href)) {
    return (
      <Link to={href} className={className}>
        {label}
      </Link>
    )
  }

  return (
    <a href={href} className={className}>
      {label}
    </a>
  )
}

export function PublicFooter() {
  const { data, settings } = useLandingContext()
  const footer = data?.footer
  const contactInfo = data?.contact_info ?? []
  const socialMedia = data?.social_media ?? []
  const navigation = data?.navigation ?? []

  const address = contactInfo.find((c) => c.type === 'address')
  const phone = contactInfo.find((c) => c.type === 'phone')
  const email = contactInfo.find((c) => c.type === 'email')

  const half = Math.ceil(navigation.length / 2)
  const navCol1 = navigation.slice(0, half)
  const navCol2 = navigation.slice(half)
  const schoolLogo = resolveSafeMediaUrl(settings.schoolLogo)
  const footerLogo = resolveSafeMediaUrl(footer?.logo ? String(footer.logo) : null)
  const brandLogo = footerLogo ?? schoolLogo

  return (
    <footer className="relative overflow-hidden border-t border-primary/10 section-alt">
      <div className="landing-mesh pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute -right-32 top-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl animate-orb-drift-reverse"
        aria-hidden
      />

      {settings.ppdbUrl ? (
        <div className="relative border-b border-primary/10 bg-gradient-to-r from-primary/8 via-primary/5 to-accent/8">
          <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 text-center sm:flex-row sm:text-left lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Pendaftaran</p>
              <p className="mt-1 text-lg font-bold">Bergabung dengan {settings.schoolName}</p>
              <p className="mt-1 text-sm text-muted-foreground">Daftar PPDB online sekarang.</p>
            </div>
            <a
              href={settings.ppdbUrl}
              className="inline-flex items-center justify-center rounded-full gradient-bg px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform duration-300 hover:scale-105"
            >
              Daftar PPDB
            </a>
          </div>
        </div>
      ) : null}

      <div className="container relative mx-auto px-4 py-16 lg:px-8 lg:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="grid gap-10 md:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={fadeUp} transition={springSoft} className="space-y-4">
            <div className="flex items-center gap-2.5">
              {brandLogo ? (
                <img
                  src={brandLogo}
                  alt={settings.schoolName}
                  className="h-10 w-10 rounded-xl object-contain ring-1 ring-primary/15"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg text-primary-foreground shadow-soft">
                  <GraduationCap className="h-5 w-5" />
                </div>
              )}
              <span className="break-words text-lg font-bold">{settings.schoolName}</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {footer?.description ? String(footer.description) : settings.schoolTagline}
            </p>
            <div className="flex gap-3">
              {socialMedia.map((social) => {
                const platform = String(social.platform ?? social.icon ?? '').toLowerCase()
                const Icon = socialIconMap[platform] ?? Globe
                return (
                  <a
                    key={String(social.id)}
                    href={String(social.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background/80',
                      'transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:text-primary hover:shadow-glow',
                    )}
                    aria-label={String(social.platform)}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </motion.div>

          {navCol1.length > 0 && (
            <motion.div variants={fadeUp} transition={springSoft}>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">Navigasi</h4>
              <ul className="space-y-2.5">
                {navCol1.map((link) => (
                  <li key={String(link.id)}>
                    <FooterNavLink href={link.url ? String(link.url) : undefined} label={String(link.label)} />
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {navCol2.length > 0 && (
            <motion.div variants={fadeUp} transition={springSoft}>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">Informasi</h4>
              <ul className="space-y-2.5">
                {navCol2.map((link) => (
                  <li key={String(link.id)}>
                    <FooterNavLink href={link.url ? String(link.url) : undefined} label={String(link.label)} />
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          <motion.div variants={fadeUp} transition={springSoft}>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">Kontak</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {address ? (
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {String(address.value)}
                </li>
              ) : null}
              {phone ? (
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  {String(phone.value)}
                </li>
              ) : null}
              {email ? (
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  {String(email.value)}
                </li>
              ) : null}
            </ul>
          </motion.div>
        </motion.div>

        <div className="my-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="mb-10 max-w-md">
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">Newsletter</h4>
          <p className="mb-4 text-sm text-muted-foreground">
            Dapatkan informasi terbaru seputar sekolah.
          </p>
          <NewsletterSubscribeForm compact />
        </div>

        <div className="my-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>
            {footer?.copyright_text
              ? String(footer.copyright_text)
              : `© ${new Date().getFullYear()} ${settings.schoolName}. All rights reserved.`}
          </p>
          <div className="flex gap-6">
            <Link to="/login" className="transition-colors hover:text-primary">
              Admin
            </Link>
            <a href="#" className="transition-colors hover:text-primary">
              Kebijakan Privasi
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
