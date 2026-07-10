# Design System — SMP Negeri 1 Harapan Bangsa

## Brand
- **Name:** SMP Negeri 1 Harapan Bangsa
- **Tagline:** Unggul dalam Prestasi, Berakhlak Mulia
- **Tone:** Premium, trustworthy, modern Indonesian public school

## Style
- Micro-interactions + scroll storytelling
- Glassmorphism on nav/hero overlays only (not overused)
- Lucide icons only — no emoji as structural UI
- **Unified theme:** landing, login, and admin share one light/dark theme via `themeStore`

## Colors (Warm education — light-first)

| Token | Hex reference | oklch (light) | Usage |
|-------|---------------|---------------|-------|
| `--background` | `#FFFBEB` | `oklch(0.985 0.018 95)` | Page shell (landing + admin) |
| `--foreground` | `#0F172A` | `oklch(0.208 0.042 265)` | Body text |
| `--primary` | `#1E40AF` | `oklch(0.424 0.165 264)` | Buttons, links, active nav |
| `--accent` | `#D97706` | `oklch(0.666 0.168 55)` | Eyebrows, highlights, hero accents |
| `--muted` | warm cream-gray | `oklch(0.948 0.022 95)` | Alternate sections |
| `--card` | white-cream | `oklch(0.995 0.008 95)` | Cards, sidebar |
| `--border` | warm neutral | `oklch(0.895 0.025 95)` | Dividers, inputs |

### Decorative tokens
- `--gradient-primary` — blue CTA gradient (no purple shift)
- `--gradient-hero` — deep blue hero fallback
- `--gradient-surface` — card/image placeholders (`primary → accent`)
- `--gradient-overlay` — hero image scrim
- `--glow-primary` / `--glow-accent` — hero blur orbs

### Section rhythm (light mode)
- Default sections: inherit `surface-page` background
- Alternate sections: `.section-alt` utility (`color-mix` of muted + background)
- Pattern: About → default, Visi-Misi → alt, Guru → alt, Agenda → alt, etc.

## Typography
- **Display/Headings:** DM Sans 700
- **Body:** DM Sans 400/500
- Base 16px, line-height 1.6

## Motion (Framer Motion springs)
```ts
export const springSnappy = { type: 'spring', stiffness: 400, damping: 30 }
export const springSoft = { type: 'spring', stiffness: 260, damping: 28 }
export const springCarousel = { type: 'spring', stiffness: 300, damping: 32 }
```
- Respect `prefers-reduced-motion`: disable parallax, use opacity-only
- Max 1–2 animated heroes per viewport

## Components
- Carousels: accessible custom carousel with keyboard + aria
- Cards: rounded-2xl, shadow-soft, hover lift via transform (not width/height)
- Theme toggle: `useTheme()` + persisted `sekolah-theme` in localStorage

## Anti-patterns
- No emoji icons in teacher/gallery/facility cards
- No hardcoded Tailwind palette (`purple-500`, `slate-950`) — use semantic tokens
- No forced `dark` class on dashboard layout
- No separate theme toggles bypassing `themeStore`
