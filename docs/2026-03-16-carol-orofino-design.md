# Carol Orofino — Design Spec (PRD)

**Date:** 2026-03-16
**Project:** Carol Orofino — Interior Design Portfolio Website
**Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + next-intl

---

## 1. Overview

A trilingual (PT/EN/ES) portfolio website for Carol Orofino, an interior design professional. The site showcases her projects with a luxury editorial aesthetic inspired by high-end fashion brands (clean white backgrounds, large photography, elegant serif typography). Content is static, managed by updating source files. The architecture is designed to expand in the future with a CMS, client area, blog, and quote system.

---

## 2. Goals

- Present Carol's portfolio in a visually stunning, professional way
- Attract new clients through high-quality project showcases
- Support three languages: Portuguese, English, Spanish
- Provide an easy WhatsApp contact path for potential clients
- Build a foundation that supports future features (CMS, client area, blog, quotes)

---

## 3. Pages

### 3.1 Home (`/`)
- **Hero:** Fullscreen image of a featured project with Carol's name in elegant serif typography centered over it. Navbar is transparent over the hero with white text; switches to white background with dark text on scroll. Tagline below name (trilingual).
- **Featured Projects:** Grid of 3 highlighted projects with photo, name, category. Button label: i18n key `home.viewAllProjects` (PT: "Ver todos os projetos").
- **About Teaser:** Short paragraph about Carol with her photo and a link to the full About page.

### 3.2 Projects (`/projetos`)
- Grid layout: 1 column mobile, 2 columns tablet, 3 columns desktop. Square aspect ratio (1:1) for cover images. 16px gap.
- Client-side filter by category (Residencial / Comercial / Reforma / Design de Interiores) — no page reload. `CategoryFilter` is a `'use client'` component that filters the statically-generated project list.
- Hover effect: subtle zoom (scale 1.03) + dark overlay (rgba 0,0,0,0.35) with project name.

### 3.3 Project Detail (`/projetos/[slug]`)
- Title, short description, location, year, category.
- **Photo gallery: grid layout** — 2 columns on desktop, 1 column on mobile. No slider/carousel (reduces complexity and improves accessibility).
- WhatsApp CTA button: "Quero um projeto assim" with pre-filled message in current locale referencing the project title.
- If slug not found: renders `not-found.tsx` (404 page).

### 3.4 About (`/sobre`)
- Professional photo of Carol.
- Biography and design philosophy text — content stored in `messages/{locale}.json` under the `about` namespace.

### 3.5 Services (`/servicos`)
- List of services from `src/data/services.ts` with translations per locale.
- Each service: icon (optional), title, short description.

### 3.6 Contact (`/contato`)
- WhatsApp direct link (primary CTA) with pre-filled message.
- Email address.
- Social media links (Instagram, etc.).
- No form — WhatsApp is the contact channel.

### 3.7 Not Found (`not-found.tsx`)
- Friendly 404 page with link back to Home, in the active locale.

---

## 4. Architecture

```
carol-orofino/
├── src/
│   ├── app/
│   │   └── [locale]/
│   │       ├── layout.tsx
│   │       ├── not-found.tsx         # 404 page
│   │       ├── page.tsx              # Home
│   │       ├── projetos/
│   │       │   ├── page.tsx          # Projects listing
│   │       │   └── [slug]/
│   │       │       └── page.tsx      # Project detail
│   │       ├── sobre/
│   │       │   └── page.tsx
│   │       ├── servicos/
│   │       │   └── page.tsx
│   │       └── contato/
│   │           └── page.tsx
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectGallery.tsx
│   │   ├── CategoryFilter.tsx        # 'use client' — filter state
│   │   └── WhatsAppButton.tsx        # Fixed floating button
│   ├── data/
│   │   ├── projects.ts               # Static project data
│   │   └── services.ts               # Static services data
│   ├── messages/
│   │   ├── pt.json
│   │   ├── en.json
│   │   └── es.json
│   └── lib/
│       └── i18n.ts
├── public/
│   ├── images/
│   │   └── projects/                 # Project photos
│   ├── favicon.ico
│   ├── apple-touch-icon.png          # 180×180
│   └── og-default.jpg                # Default OG image 1200×630
├── src/app/sitemap.ts                # Generates sitemap.xml — reads data/projects.ts at build time
└── middleware.ts                     # next-intl locale routing
```

**Deployment target:** Vercel (Node.js server). `next/image` uses the default Vercel image optimization loader. Do NOT use `output: 'export'`.

**Static params:** The `/projetos/[slug]` route must implement `generateStaticParams` (reading `data/projects.ts`) to pre-render all project detail pages at build time. Similarly, `[locale]` routes must enumerate `['pt', 'en', 'es']`.

---

## 5. Data Models

### 5.1 Project

```typescript
// src/data/projects.ts
interface ProjectImage {
  src: string
  altText: {
    pt: string
    en: string
    es: string
  }
}

interface Project {
  slug: string
  category: 'residencial' | 'comercial' | 'reforma' | 'design-de-interiores'
  year: number
  location: string
  coverImage: string          // path in /public/images/projects/
  coverImageAlt: {
    pt: string
    en: string
    es: string
  }
  coverImageBlurDataURL: string  // base64 blur placeholder for next/image
  images: ProjectImage[]
  featured: boolean
  translations: {
    pt: { title: string; description: string }
    en: { title: string; description: string }
    es: { title: string; description: string }
  }
}
```

### 5.2 Service

```typescript
// src/data/services.ts
interface Service {
  id: string
  icon?: string  // optional — icon name or SVG path
  translations: {
    pt: { title: string; description: string }
    en: { title: string; description: string }
    es: { title: string; description: string }
  }
}
```

---

## 6. Internationalization

- Library: `next-intl`
- Locales: `pt` (default), `en`, `es`
- **URL structure:** Locale prefix only — Portuguese route segments used across all locales.
  - `pt`: `/pt/projetos/[slug]`
  - `en`: `/en/projetos/[slug]`
  - `es`: `/es/projetos/[slug]`
  - Rationale: Fully localized path segments (e.g., `/en/projects`) require next-intl's `pathnames` configuration and add significant complexity. This is deferred to a future version.
- Language switcher in Navbar (desktop: top right; mobile: inside drawer menu)
- Language switcher also in Footer
- All UI strings in `messages/{locale}.json`
- About page biography text also in `messages/{locale}.json` under `about` namespace

---

## 7. Visual Design

### Typography
- **Display / Logo:** `Cormorant Garamond` (serif) — elegant, editorial
- **Body:** `Inter` (sans-serif) — clean, readable
- Logo: "Carol Orofino" centered in navbar, `letter-spacing: 0.2em`, font-size 1.25rem

### Color Palette (Scandinavian-inspired)
| Token       | Hex       | Usage                                      |
|-------------|-----------|--------------------------------------------|
| Background  | `#FAF9F7` | Page background                            |
| Text        | `#1A1A1A` | Primary text (contrast ratio ~17:1 on bg)  |
| Primary     | `#8B7355` | Large headings, decorative accents only — NOT for body text (contrast ~3.5:1 on bg, fails WCAG AA for small text) |
| Secondary   | `#B8C4BB` | Subtle highlights, dividers                |
| Neutral     | `#D4CFC8` | Borders                                    |
| Dark        | `#2C2C2C` | Footer background, hero navbar text        |

> **Accessibility note:** Primary color `#8B7355` must only be used for large decorative text (≥18px bold or ≥24px normal) where WCAG AA large text threshold (3:1) is met. Never use it for body text or interactive labels.

### Navbar
- **Desktop:** `#FAF9F7` background, centered brand name, nav links left, language selector + WhatsApp icon right.
- **Mobile:** `#FAF9F7` background, centered brand name, hamburger icon right. Hamburger opens a full-width drawer from the right with nav links stacked vertically and language selector at the bottom.
- **Hero exception:** On the Home page, the Navbar is transparent with white text when at the top of the page. On scroll past the hero, it transitions to `#FAF9F7` background with dark text. This is the "dark navbar variant" — it refers to the transparent-over-hero state, not dark mode.

### Key UI Patterns
- Project cards: large photo, minimal text below, hover zoom + overlay
- WhatsApp button: fixed floating, bottom-right corner, all pages
- Page transitions: fade-in animation (`opacity 0 → 1`, 200ms)
- Mobile-first responsive design
- Images: `next/image` with `placeholder="blur"` using `coverImageBlurDataURL` field
- WCAG 2.1 AA compliance target for all interactive elements and body text

---

## 8. WhatsApp Integration

- Fixed floating button on all pages (bottom-right)
- Navbar icon (desktop, top-right)
- Phone number: `NEXT_PUBLIC_WHATSAPP_NUMBER` env var — format: country code + number, no `+` or spaces (e.g., `5511999999999`)
- URL format: `https://wa.me/{NEXT_PUBLIC_WHATSAPP_NUMBER}?text={encodeURIComponent(message)}`
- Pre-filled messages:
  - Contact page: `"Olá Carol, gostaria de saber mais sobre seus serviços."` (localized per language)
  - Project detail: `"Olá Carol, me interessei pelo projeto {projectTitle} e gostaria de saber mais."` (localized, uses the project's translated title in the current locale)

---

## 9. Performance & SEO

- Static generation (SSG) for all pages via Next.js App Router
- `next/image` for all project photos with blur placeholder
- Per-page metadata (title, description, `og:image`) in all three languages
- `og:image` for project pages: `coverImage` field, rendered at 1200×630, JPG format
- Default `og:image` fallback: `/public/og-default.jpg` (1200×630)
- `robots.txt` and `sitemap.xml` generated via `app/sitemap.ts` (reads `data/projects.ts` at build time to include all project detail URLs)
- Favicon: `/public/favicon.ico`; Apple Touch Icon: `/public/apple-touch-icon.png` (180×180)

---

## 10. Environment Variables

| Variable                      | Required | Format                        | Example              |
|-------------------------------|----------|-------------------------------|----------------------|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Yes      | Country code + number, no `+` | `5511999999999`      |

---

## 11. Future Expansion (not in scope now)

- CMS integration (replace `data/projects.ts` with Sanity or similar)
- Client area (protected routes, project sharing)
- Blog / content marketing
- Quote request system
- Contact form with email delivery
- Localized URL path segments (`/en/projects`, `/es/proyectos`)

---

## 12. Out of Scope (v1)

- Authentication / login
- E-commerce or payment
- Dark mode
- Animations beyond subtle transitions and hover effects
