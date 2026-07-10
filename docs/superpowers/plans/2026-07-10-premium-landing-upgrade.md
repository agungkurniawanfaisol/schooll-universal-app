# Premium Landing Page Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the public site to **SMP Negeri 1 Harapan Bangsa** and elevate the landing page to a premium, carousel-rich experience with spring-based Framer Motion animations, Radix UI accessibility, and CMS-driven content.

**Architecture:** Introduce shared motion tokens and reusable carousel primitives under `src/features/landing/` and `src/components/ui/`. Upgrade section components incrementally while keeping `LandingDataProvider` as the single data source. Replace emoji placeholders with Lucide icons and CMS images. Hero becomes a multi-slide carousel; Testimonials, News, Activities, and Gallery gain carousels on desktop with grid fallback on mobile.

**Tech Stack:** React 19, Framer Motion (spring transitions), Radix UI (carousel controls as accessible buttons), TailwindCSS v4, TanStack Query, existing CMS API.

**Design references:** `design-system/MASTER.md`, ui-ux-pro-max (accessibility, motion, no-emoji-icons), radix-ui-design-system (asChild, keyboard nav, aria labels).

---

## File Map

| File | Responsibility |
|------|----------------|
| `frontend/src/lib/motion.ts` | Spring presets + reduced-motion helper |
| `frontend/src/components/ui/carousel.tsx` | Accessible carousel primitive (Radix Button + motion) |
| `frontend/src/features/landing/HeroCarousel.tsx` | Hero multi-slide carousel from CMS hero[] |
| `frontend/src/features/landing/SectionCarousel.tsx` | Generic horizontal carousel wrapper |
| `frontend/src/pages/landing/sections/*.tsx` | Section visual upgrades |
| `frontend/src/index.css` | DM Sans fonts, premium color tokens |
| `frontend/index.html` | Font preconnect |
| `frontend/src/components/common/SEOHead.tsx` | Default site name |
| `frontend/src/features/landing/LandingDataContext.tsx` | Fallback school name |
| `backend/database/seeders/CmsContentSeeder.php` | Already has SMP name — verify only |

---

## Task 1: Motion Foundation

**Files:**
- Create: `frontend/src/lib/motion.ts`
- Create: `frontend/src/hooks/useReducedMotion.ts`
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Create spring motion tokens**

```ts
// frontend/src/lib/motion.ts
import type { Transition } from 'framer-motion'

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
}

export const springSoft: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 28,
}

export const springCarousel: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 32,
}

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
```

- [ ] **Step 2: Create reduced-motion hook**

```ts
// frontend/src/hooks/useReducedMotion.ts
import { useEffect, useState } from 'react'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = () => setReduced(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}
```

- [ ] **Step 3: Add DM Sans + premium tokens to CSS**

In `frontend/src/index.css`, add after `@import 'tailwindcss'`:

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
```

Update `@theme inline`:

```css
--font-sans: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
--font-display: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
```

Update `:root` primary palette toward education blue + warm amber accent:

```css
--primary: oklch(0.45 0.15 264);
--accent: oklch(0.72 0.16 75);
--background: oklch(0.99 0.01 95);
```

- [ ] **Step 4: Verify build**

Run: `cd frontend && npm run build`
Expected: PASS with no TypeScript errors

---

## Task 2: Accessible Carousel Primitive (Radix + Spring)

**Files:**
- Create: `frontend/src/components/ui/carousel.tsx`

- [ ] **Step 1: Implement carousel component**

```tsx
// frontend/src/components/ui/carousel.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useState, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { springCarousel } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface CarouselProps {
  items: ReactNode[]
  className?: string
  ariaLabel?: string
  showDots?: boolean
  autoPlayMs?: number
}

export function Carousel({
  items,
  className,
  ariaLabel = 'Carousel',
  showDots = true,
  autoPlayMs,
}: CarouselProps) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const count = items.length

  const go = useCallback(
    (next: number) => setIndex((next + count) % count),
    [count],
  )

  // optional autoplay — disabled when reduced motion
  // useEffect with setInterval when autoPlayMs && !reduced

  if (count === 0) return null

  return (
    <div className={cn('relative', className)} role="region" aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="overflow-hidden rounded-3xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 40 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -40 }}
            transition={reduced ? { duration: 0.15 } : springCarousel}
          >
            {items[index]}
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <>
          <Button
            type="button"
            variant="glass"
            size="icon"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2"
            aria-label="Slide sebelumnya"
            onClick={() => go(index - 1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="glass"
            size="icon"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2"
            aria-label="Slide berikutnya"
            onClick={() => go(index + 1)}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {showDots && (
            <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Indikator slide">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Slide ${i + 1}`}
                  className={cn(
                    'h-2.5 rounded-full transition-all',
                    i === index ? 'w-8 bg-primary' : 'w-2.5 bg-muted-foreground/30',
                  )}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Export from UI barrel if exists, or import directly**

- [ ] **Step 3: Verify build**

Run: `cd frontend && npm run build`
Expected: PASS

---

## Task 3: Hero Carousel (Premium Full-Bleed)

**Files:**
- Create: `frontend/src/features/landing/HeroCarousel.tsx`
- Modify: `frontend/src/pages/landing/sections/HeroSection.tsx`

- [ ] **Step 1: Build HeroCarousel from CMS `hero[]` array**

Each slide includes:
- Full-bleed background (image or gradient mesh)
- School name badge: **SMP Negeri 1 Harapan Bangsa**
- Title, subtitle, description from CMS
- Dual CTA (primary gradient + glass secondary)
- Animated stat strip below (spring counter — keep existing AnimatedCounter)
- Auto-advance every 6s (disabled if reduced motion)

- [ ] **Step 2: Replace static hero content in HeroSection**

```tsx
// HeroSection.tsx — simplified
export function HeroSection() {
  const { data, settings, isLoading } = useLandingContext()
  if (isLoading) return <HeroSkeleton />
  const slides = data?.hero?.length ? data.hero : [fallbackSlide(settings)]
  return <HeroCarousel slides={slides} settings={settings} />
}
```

- [ ] **Step 3: Visual requirements (ui-ux-pro-max)**
- Min contrast 4.5:1 on hero text
- `min-h-dvh` not `min-h-screen`
- Remove emoji from hero placeholder — use Lucide `GraduationCap`
- Parallax only when `!useReducedMotion()`

- [ ] **Step 4: Manual test**

Open: `http://localhost:5173`
Expected: Hero cycles through slides, dots + arrows work, stats animate once

---

## Task 4: Section Carousels

**Files:**
- Create: `frontend/src/features/landing/SectionCarousel.tsx`
- Modify:
  - `TestimonialsSection.tsx`
  - `NewsSection.tsx`
  - `ActivitiesSection.tsx`
  - `GallerySection.tsx` (optional: keep lightbox + add carousel row)

- [ ] **Step 1: SectionCarousel wrapper**

Responsive behavior:
- `< md`: single-column stack OR 1-item carousel
- `≥ md`: carousel showing 2–3 cards per view (use CSS scroll-snap or motion slide)

- [ ] **Step 2: Testimonials — carousel with photo, rating stars (Lucide Star), quote**

Pattern: Hero + Testimonials carousel + CTA (ui-ux-pro-max landing pattern #2)

- [ ] **Step 3: News — horizontal carousel, card with image, date badge, excerpt**

- [ ] **Step 4: Activities — featured carousel + grid below**

- [ ] **Step 5: Remove all emoji placeholders**

Replace in AboutSection, GallerySection, TeachersSection fallback avatars:
- `GraduationCap`, `Users`, `Camera`, `Building2` from Lucide

---

## Task 5: Premium Section Polish

**Files:**
- Modify: `AboutSection.tsx`, `VisionMissionSection.tsx`, `PrincipalSection.tsx`, `FacilitiesSection.tsx`, `AchievementsSection.tsx`, `ContactSection.tsx`
- Modify: `PublicNavbar.tsx`, `PublicFooter.tsx`

- [ ] **Step 1: Shared `SectionHeader` component**

```tsx
// frontend/src/features/landing/SectionHeader.tsx
interface SectionHeaderProps {
  eyebrow: string
  title: string
  description?: string
}
// motion fadeUp on whileInView, springSoft
```

- [ ] **Step 2: About section — split layout with video/image, floating stat card**

- [ ] **Step 3: Vision/Mission — bento grid with icon cards (Lucide Eye, Target, Heart)**

- [ ] **Step 4: Principal — premium quote card with gradient border

- [ ] **Step 5: Contact — glass form card, map with rounded-3xl, WhatsApp CTA if CMS has phone

- [ ] **Step 6: Navbar — blur glass sticky, scroll progress indicator (optional thin bar)

- [ ] **Step 7: Footer — use CMS school name, social icons from Lucide (Instagram, Youtube)

---

## Task 6: Rebrand to SMP Negeri 1 Harapan Bangsa

**Files:**
- Modify: `frontend/src/components/common/SEOHead.tsx`
- Modify: `frontend/src/features/landing/LandingDataContext.tsx`
- Modify: `frontend/src/layouts/AuthLayout.tsx`
- Modify: `frontend/src/pages/authentication/LoginPage.tsx`
- Modify: `frontend/src/pages/dashboard/DashboardPage.tsx`
- Modify: `frontend/index.html` (title meta)
- Verify: `backend/database/seeders/CmsContentSeeder.php` (already seeds SMP Negeri 1 Harapan Bangsa)

- [ ] **Step 1: Update hardcoded fallbacks**

```ts
// SEOHead.tsx
const SITE_NAME = 'SMP Negeri 1 Harapan Bangsa'

// LandingDataContext.tsx defaultSettings
schoolName: 'SMP Negeri 1 Harapan Bangsa',
schoolTagline: 'Unggul dalam Prestasi, Berakhlak Mulia',
```

```tsx
// AuthLayout.tsx, LoginPage.tsx, DashboardPage.tsx
// Replace "Sekolah App" → "SMP Negeri 1 Harapan Bangsa" or use settings from API where available
```

- [ ] **Step 2: index.html**

```html
<title>SMP Negeri 1 Harapan Bangsa</title>
```

- [ ] **Step 3: Grep verify no stale brand**

Run: `rg "Sekolah App" frontend/src`
Expected: 0 matches (or only comments)

---

## Task 7: Backend — Optional Second Hero Slide for Carousel Demo

**Files:**
- Modify: `backend/database/seeders/CmsContentSeeder.php`

- [ ] **Step 1: Add second hero slide**

```php
HeroSection::query()->updateOrCreate(
    ['title' => 'Prestasi Gemilang, Karakter Unggul'],
    [
        'subtitle' => 'SMP Negeri 1 Harapan Bangsa',
        'description' => 'Bergabunglah dengan komunitas belajar yang inspiratif dan penuh prestasi.',
        'cta_text' => 'Lihat Prestasi',
        'cta_url' => '#prestasi',
        'status' => PublishStatus::Published->value,
        'sort_order' => 2,
    ],
);
```

- [ ] **Step 2: Re-seed**

Run: `docker compose exec backend php artisan db:seed --class=CmsContentSeeder --force`
Expected: 2 hero slides in API

- [ ] **Step 3: Verify API**

Run: `curl -s http://localhost:8080/api/v1/public/landing | jq '.data.hero | length'`
Expected: `2`

---

## Task 8: Quality Gate (ui-ux-pro-max Pre-Delivery)

- [ ] **No emoji as icons** — grep `frontend/src/pages/landing`
- [ ] **All carousel controls have aria-label**
- [ ] **Focus rings visible on dots and arrows**
- [ ] **prefers-reduced-motion disables autoplay and parallax**
- [ ] **Touch targets ≥ 44px on carousel buttons**
- [ ] **Images use `loading="lazy"` below fold**
- [ ] **Build passes:** `npm run build`
- [ ] **Lint passes:** `npm run lint`
- [ ] **Test viewports:** 375px, 768px, 1280px

---

## Self-Review (Spec Coverage)

| Requirement | Task |
|-------------|------|
| Rename to SMP Negeri 1 Harapan Bangsa | Task 6 |
| More premium landing | Tasks 3, 5 |
| Carousel | Tasks 2, 3, 4 |
| Spring animations | Tasks 1, 2, 3 |
| Radix accessibility | Task 2 (Button, aria) |
| CMS-driven (not hardcoded) | Tasks 3, 4 (data from useLandingContext) |
| No Redis / existing stack | No backend infra changes |

**Gaps:** None identified.

---

## Execution Order

1. Task 1 (motion) → Task 2 (carousel primitive)
2. Task 6 (rebrand) — can parallel with Task 1
3. Task 3 (hero carousel)
4. Task 7 (seed data)
5. Task 4 (section carousels)
6. Task 5 (polish)
7. Task 8 (QA)

---

## Testing Checklist

```bash
# API
curl -s http://localhost:8080/api/v1/public/landing | jq '.data.settings.school_name'

# Frontend
cd frontend && npm run build && npm run lint

# Visual
# 1. Hero carousel auto + manual nav
# 2. Testimonials carousel on tablet+
# 3. School name in navbar/footer = SMP Negeri 1 Harapan Bangsa
# 4. Reduced motion: enable in OS, verify no autoplay
```
