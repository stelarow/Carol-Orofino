# About Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the homepage About teaser with Carol's B&W portrait + split layout + scroll animation, and create the missing `/sobre` page with bio, design philosophy, and WhatsApp CTA.

**Architecture:** A new `AboutTeaser` client component handles the homepage split section (photo left, text right, Framer Motion slide-in). The `/sobre` page is a server component that reuses the same visual language plus two additional sections. Both consume existing and new i18n keys from the `about` namespace.

**Tech Stack:** Next.js App Router, next-intl, Framer Motion, Tailwind CSS v4, `@testing-library/react`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Copy | `public/images/carol-portrait.png` | Photo asset served by Next.js Image |
| Create | `src/components/AboutTeaser.tsx` | Homepage 50/50 split teaser (`'use client'`) |
| Create | `src/components/__tests__/AboutTeaser.test.tsx` | Component tests |
| Create | `src/app/[locale]/sobre/page.tsx` | Full about page (server component) |
| Modify | `src/app/[locale]/page.tsx` | Replace inline block with `<AboutTeaser />` |
| Modify | `src/messages/pt.json` | Add 5 new `about.*` keys |
| Modify | `src/messages/en.json` | Add 5 new `about.*` keys |
| Modify | `src/messages/es.json` | Add 5 new `about.*` keys |

---

## Task 1: Copy photo asset

**Files:**
- Copy to: `public/images/carol-portrait.png`

- [ ] **Step 1: Copy the photo**

```bash
cp "C:/Users/Alessandro/Downloads/Whisk_6735f517845581e93e14a3e63116f2e8dr.png" public/images/carol-portrait.png
```

- [ ] **Step 2: Verify it exists**

```bash
ls public/images/carol-portrait.png
```

Expected: file listed, no error.

- [ ] **Step 3: Commit**

```bash
git add public/images/carol-portrait.png
git commit -m "feat(assets): add Carol portrait photo"
```

---

## Task 2: Add i18n keys

**Files:**
- Modify: `src/messages/pt.json`
- Modify: `src/messages/en.json`
- Modify: `src/messages/es.json`

- [ ] **Step 1: Add Portuguese keys**

In `src/messages/pt.json`, find the `"about"` object and add these 5 keys **inside** it (after `"philosophyText"`):

```json
"eyebrow": "Sobre nós",
"ctaTitle": "Vamos trabalhar juntas?",
"ctaSubtitle": "Conte-me sobre o seu projeto",
"ctaButton": "Falar no WhatsApp",
"ctaWhatsappMessage": "Olá Carol, gostaria de saber mais sobre seus serviços."
```

- [ ] **Step 2: Add English keys**

In `src/messages/en.json`, same location inside `"about"`:

```json
"eyebrow": "About us",
"ctaTitle": "Let's work together",
"ctaSubtitle": "Tell me about your project",
"ctaButton": "Chat on WhatsApp",
"ctaWhatsappMessage": "Hello Carol, I'd like to know more about your services."
```

- [ ] **Step 3: Add Spanish keys**

In `src/messages/es.json`, same location inside `"about"`:

```json
"eyebrow": "Sobre nosotros",
"ctaTitle": "Trabajemos juntas",
"ctaSubtitle": "Cuéntame sobre tu proyecto",
"ctaButton": "Hablar por WhatsApp",
"ctaWhatsappMessage": "Hola Carol, me gustaría saber más sobre sus servicios."
```

- [ ] **Step 4: Verify the build doesn't break**

```bash
npm run build 2>&1 | tail -5
```

Expected: build succeeds (no missing translation key errors).

- [ ] **Step 5: Commit**

```bash
git add src/messages/pt.json src/messages/en.json src/messages/es.json
git commit -m "feat(i18n): add about section new keys (eyebrow, cta)"
```

---

## Task 3: Create `AboutTeaser` component (TDD)

**Files:**
- Create: `src/components/__tests__/AboutTeaser.test.tsx`
- Create: `src/components/AboutTeaser.tsx`

### Step 1 — Write failing tests

- [ ] **Create the test file**

```tsx
// src/components/__tests__/AboutTeaser.test.tsx
import { render, screen } from '@testing-library/react'
import { AboutTeaser } from '../AboutTeaser'

// Framer Motion uses browser APIs not available in jsdom — mock it
jest.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      className,
    }: {
      children: React.ReactNode
      className?: string
    }) => <div className={className}>{children}</div>,
  },
}))

// Next/image mock
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

const defaultProps = {
  locale: 'pt',
  eyebrow: 'Sobre nós',
  title: 'Carol Orofino',
  teaser: 'Acredito que cada espaço conta uma história.',
  ctaLabel: 'Conheça mais',
}

describe('AboutTeaser', () => {
  it('renders the eyebrow text', () => {
    render(<AboutTeaser {...defaultProps} />)
    expect(screen.getByText('Sobre nós')).toBeInTheDocument()
  })

  it('renders the title', () => {
    render(<AboutTeaser {...defaultProps} />)
    expect(screen.getByText('Carol Orofino')).toBeInTheDocument()
  })

  it('renders the teaser paragraph', () => {
    render(<AboutTeaser {...defaultProps} />)
    expect(
      screen.getByText('Acredito que cada espaço conta uma história.')
    ).toBeInTheDocument()
  })

  it('renders a CTA link pointing to the correct locale about page', () => {
    render(<AboutTeaser {...defaultProps} />)
    const link = screen.getByRole('link', { name: /Conheça mais/i })
    expect(link).toHaveAttribute('href', '/pt/sobre')
  })

  it('renders the Carol portrait image', () => {
    render(<AboutTeaser {...defaultProps} />)
    const img = screen.getByAltText('Carol Orofino')
    expect(img).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npx jest src/components/__tests__/AboutTeaser.test.tsx --no-coverage
```

Expected: FAIL — `Cannot find module '../AboutTeaser'`

- [ ] **Step 3: Create the component**

```tsx
// src/components/AboutTeaser.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface AboutTeaserProps {
  locale: string
  eyebrow: string
  title: string
  teaser: string
  ctaLabel: string
}

export function AboutTeaser({
  locale,
  eyebrow,
  title,
  teaser,
  ctaLabel,
}: AboutTeaserProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[560px] overflow-hidden">
      {/* Left: Photo */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true, margin: '-80px' }}
        className="relative min-h-[320px] md:min-h-0 overflow-hidden"
      >
        <Image
          src="/images/carol-portrait.png"
          alt="Carol Orofino"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-top"
        />
      </motion.div>

      {/* Right: Text */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
        viewport={{ once: true, margin: '-80px' }}
        className="flex items-center justify-center bg-sand px-8 py-16 md:px-16"
      >
        <div className="max-w-md">
          <p className="font-body text-xs uppercase tracking-[0.35em] text-dark mb-5">
            {eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-light italic text-primary leading-tight mb-5">
            {title}
          </h2>
          <div className="w-10 h-px bg-stone my-5" />
          <p className="font-body text-sm font-light text-dark leading-relaxed mb-8">
            {teaser}
          </p>
          <Link
            href={`/${locale}/sobre`}
            className="font-body text-xs uppercase tracking-widest border-b border-primary text-primary pb-0.5 transition-opacity hover:opacity-60"
          >
            {ctaLabel} →
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npx jest src/components/__tests__/AboutTeaser.test.tsx --no-coverage
```

Expected: 5 tests PASS.

- [ ] **Step 5: Run full test suite — no regressions**

```bash
npm run test -- --no-coverage
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/AboutTeaser.tsx src/components/__tests__/AboutTeaser.test.tsx
git commit -m "feat(components): add AboutTeaser with split layout and scroll animation"
```

---

## Task 4: Wire `AboutTeaser` into the homepage

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Update the import block**

At the top of `src/app/[locale]/page.tsx`, add:

```tsx
import { AboutTeaser } from '@/components/AboutTeaser'
```

- [ ] **Step 2: Replace the inline about section**

Find and replace the entire `{/* About Teaser */}` section (lines 150–166):

**Remove:**
```tsx
      {/* About Teaser */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-primary tracking-wide">
            {t('aboutTitle')}
          </h2>
          <p className="mt-6 font-body text-base text-dark leading-relaxed max-w-2xl mx-auto">
            {t('aboutTeaser')}
          </p>
          <Link
            href={`/${locale}/sobre`}
            className="mt-8 inline-block font-body text-xs uppercase tracking-widest border-b border-text-primary pb-0.5 text-text-primary transition-colors hover:text-primary hover:border-primary"
          >
            {t('aboutLink')}
          </Link>
        </div>
      </section>
```

**Replace with:**
```tsx
      {/* About Teaser */}
      <AboutTeaser
        locale={locale}
        eyebrow={tAbout('eyebrow')}
        title={t('aboutTitle')}
        teaser={t('aboutTeaser')}
        ctaLabel={t('aboutLink')}
      />
```

- [ ] **Step 3: Add the `about` translations import**

In the same file, find:
```tsx
  const tBlog = await getTranslations({ locale, namespace: 'blog' })
```

Add after it:
```tsx
  const tAbout = await getTranslations({ locale, namespace: 'about' })
```

- [ ] **Step 4: Start dev server and verify visually**

```bash
npm run dev
```

Open http://localhost:3000/pt — scroll to the About section. Verify:
- Photo appears on the left (desktop) / top (mobile)
- Text appears on the right / below
- Slide-in animation triggers on scroll
- "Conheça mais" link is present

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat(home): replace about teaser with AboutTeaser split component"
```

---

## Task 5: Create `/sobre` page

**Files:**
- Create/overwrite: `src/app/[locale]/sobre/page.tsx` (a placeholder already exists — this replaces it)

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p src/app/[locale]/sobre
```

- [ ] **Step 2: Write the page**

```tsx
// src/app/[locale]/sobre/page.tsx
import Image from 'next/image'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/lib/i18n'
import { SectionDivider } from '@/components/SectionDivider'
import WhatsAppButton from '@/components/WhatsAppButton'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return {
    title: `Sobre — Carol Orofino`,
    description: t('bio'),
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function SobrePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  return (
    <>
      {/* Section 1 — Hero split: photo + bio */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[560px] overflow-hidden">
        {/* Left: Photo */}
        <div className="relative min-h-[320px] md:min-h-0 overflow-hidden">
          <Image
            src="/images/carol-portrait.png"
            alt="Carol Orofino"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top"
          />
        </div>

        {/* Right: Bio */}
        <div className="flex items-center justify-center bg-sand px-8 py-16 md:px-16">
          <div className="max-w-md">
            <p className="font-body text-xs uppercase tracking-[0.35em] text-dark mb-5">
              {t('eyebrow')}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-light italic text-primary leading-tight mb-5">
              {t('title')}
            </h1>
            <div className="w-10 h-px bg-stone my-5" />
            <p className="font-body text-sm font-light text-dark leading-relaxed">
              {t('bio')}
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Section 2 — Filosofia de Design */}
      <section className="bg-linen py-20 px-6 md:px-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-10 md:gap-16">
            {/* Vertical bar — desktop only */}
            <div className="hidden md:block w-px self-stretch bg-walnut flex-shrink-0" />

            <div>
              {/* Horizontal top accent — mobile only */}
              <div className="md:hidden h-px w-10 bg-walnut mb-6" />

              <p className="font-body text-xs uppercase tracking-[0.35em] text-dark mb-4">
                {t('philosophy')}
              </p>
              <blockquote className="font-display text-2xl md:text-3xl font-light italic text-primary leading-[1.3] mb-6">
                {t('philosophyText')}
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Section 3 — CTA */}
      <section className="bg-sand py-20 text-center px-6">
        <div className="max-w-md mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-light italic text-primary mb-4">
            {t('ctaTitle')}
          </h2>
          <p className="font-body text-sm font-light text-dark leading-relaxed mb-10">
            {t('ctaSubtitle')}
          </p>
          <WhatsAppButton
            variant="inline"
            message={t('ctaWhatsappMessage')}
            label={t('ctaButton')}
          />
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 3: Verify the import resolves**

```bash
grep "routing" src/lib/i18n.ts
```

Expected: `export const routing = defineRouting(...)` — this confirms `routing` is exported and `routing.locales` works.

- [ ] **Step 4: Build to catch type and i18n errors**

```bash
npm run build 2>&1 | tail -20
```

Expected: build succeeds with no errors. If there are missing keys, verify the i18n files from Task 2 are correct.

- [ ] **Step 5: Verify the page in the browser**

With `npm run dev` running, open:
- http://localhost:3000/pt/sobre
- http://localhost:3000/en/sobre
- http://localhost:3000/es/sobre

Check each locale renders correctly. Verify:
- Photo shows with `priority` (no lazy load)
- Bio text is longer than the homepage teaser
- "Filosofia de Design" section has the vertical walnut bar on desktop
- On mobile (resize to 375px), walnut bar is replaced by horizontal accent
- WhatsApp button is visible in the CTA section
- "Conheça mais" link on the homepage now navigates to this page without 404

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/sobre/page.tsx
git commit -m "feat(sobre): create /sobre page with bio, philosophy, and WhatsApp CTA"
```

---

## Task 6: Final verification

- [ ] **Step 1: Run full test suite**

```bash
npm run test -- --no-coverage
```

Expected: all tests pass.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Production build**

```bash
npm run build
```

Expected: builds successfully, all static pages generated including `/pt/sobre`, `/en/sobre`, `/es/sobre`.

- [ ] **Step 4: Final commit if any lint fixes were needed**

```bash
git add -A
git commit -m "fix: lint and build cleanup for about section"
```

Only run this step if lint or build required changes. Skip if everything was clean.
