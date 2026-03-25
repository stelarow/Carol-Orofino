# Blog Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add author block, breadcrumb navigation, in-section images with captions, and related posts section to the blog to match the reference site (stylodecore.com).

**Architecture:** Incremental additions only — three new focused components (`Breadcrumb`, `AuthorBlock`, `RelatedPosts`) are created independently, then plugged into the existing article and listing pages. No structural refactors. All new data fields are optional so existing posts remain unaffected.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, next-intl (server components), Jest + @testing-library/react.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/data/posts.ts` | Add `image?` and `imageCaption?` to `TextSection` |
| Modify | `src/messages/pt.json` | Add 3 translation keys to `blog` namespace |
| Modify | `src/messages/en.json` | Add 3 translation keys to `blog` namespace |
| Modify | `src/messages/es.json` | Add 3 translation keys to `blog` namespace |
| Create | `src/components/Breadcrumb.tsx` | Pure component, renders `Home › Blog [› Title]` |
| Create | `src/components/__tests__/Breadcrumb.test.tsx` | Tests for Breadcrumb |
| Create | `src/components/AuthorBlock.tsx` | Async server component, renders author info below hero |
| Create | `src/components/__tests__/AuthorBlock.test.tsx` | Tests for AuthorBlock |
| Create | `src/components/RelatedPosts.tsx` | Async server component, 3 most recent posts |
| Create | `src/components/__tests__/RelatedPosts.test.tsx` | Tests for RelatedPosts |
| Modify | `src/app/[locale]/blog/[slug]/page.tsx` | Wire in all 3 new components, add image/caption rendering |
| Modify | `src/app/[locale]/blog/page.tsx` | Add Breadcrumb before h1 |

---

## Task 1: Update data model

**Files:**
- Modify: `src/data/posts.ts:1-7`

- [ ] **Step 1: Add `image?` and `imageCaption?` to `TextSection`**

Open `src/data/posts.ts` and update the `TextSection` interface (lines 1-7):

```ts
export interface TextSection {
  type?: 'text'
  heading: string
  body: string
  table?: { label: string; value: string }[]
  tip?: string
  image?: string
  imageCaption?: string
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd "C:/Site carol/carol-orofino" && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Run existing tests to confirm nothing broke**

```bash
cd "C:/Site carol/carol-orofino" && npx jest --passWithNoTests
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
cd "C:/Site carol/carol-orofino" && git add src/data/posts.ts && git commit -m "feat(blog): add optional image and imageCaption to TextSection"
```

---

## Task 2: Add translation keys

**Files:**
- Modify: `src/messages/pt.json`
- Modify: `src/messages/en.json`
- Modify: `src/messages/es.json`

- [ ] **Step 1: Add keys to `pt.json`**

In `src/messages/pt.json`, find the `"blog"` object and add three keys after `"backToBlog"`:

```json
"authorRole": "Especialista em Design de Interiores",
"relatedPostsTitle": "Continue Lendo",
"breadcrumbHome": "Home",
```

- [ ] **Step 2: Add keys to `en.json`**

In `src/messages/en.json`, find the `"blog"` object and add three keys after `"backToBlog"`:

```json
"authorRole": "Interior Design Specialist",
"relatedPostsTitle": "Keep Reading",
"breadcrumbHome": "Home",
```

- [ ] **Step 3: Add keys to `es.json`**

In `src/messages/es.json`, find the `"blog"` object and add three keys after `"backToBlog"`:

```json
"authorRole": "Especialista en Diseño de Interiores",
"relatedPostsTitle": "Seguir Leyendo",
"breadcrumbHome": "Home",
```

- [ ] **Step 4: Verify all three files are valid JSON**

```bash
cd "C:/Site carol/carol-orofino" && python3 -c "import json; [json.load(open(f)) for f in ['src/messages/pt.json','src/messages/en.json','src/messages/es.json']]; print('OK')"
```

Expected: `OK`

- [ ] **Step 5: Commit**

```bash
cd "C:/Site carol/carol-orofino" && git add src/messages/pt.json src/messages/en.json src/messages/es.json && git commit -m "feat(blog): add authorRole, relatedPostsTitle, breadcrumbHome translations"
```

---

## Task 3: Breadcrumb component

**Files:**
- Create: `src/components/Breadcrumb.tsx`
- Create: `src/components/__tests__/Breadcrumb.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/__tests__/Breadcrumb.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Breadcrumb from '../Breadcrumb'

// Mock next/link — Breadcrumb uses Link for navigation items
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('Breadcrumb', () => {
  it('renders all item labels', () => {
    render(<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/pt/blog' }, { label: 'Post Title' }]} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(screen.getByText('Post Title')).toBeInTheDocument()
  })

  it('links items that have href', () => {
    render(<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/pt/blog' }, { label: 'Post Title' }]} />)
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/pt/blog')
  })

  it('last item has no link and aria-current="page"', () => {
    render(<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Post Title' }]} />)
    expect(screen.queryByRole('link', { name: 'Post Title' })).not.toBeInTheDocument()
    expect(screen.getByText('Post Title')).toHaveAttribute('aria-current', 'page')
  })

  it('renders separators between items', () => {
    // NOTE: the separator character is U+203A (›). Ensure your editor saves this file as UTF-8.
    render(<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />)
    expect(screen.getByText('›')).toBeInTheDocument()
  })

  it('nav has aria-label="breadcrumb"', () => {
    render(<Breadcrumb items={[{ label: 'Home', href: '/' }]} />)
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd "C:/Site carol/carol-orofino" && npx jest Breadcrumb.test --no-coverage
```

Expected: FAIL — "Cannot find module '../Breadcrumb'"

- [ ] **Step 3: Create `Breadcrumb` component**

Create `src/components/Breadcrumb.tsx`:

```tsx
import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 font-body text-xs text-sage uppercase tracking-widest">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={idx} className="flex items-center gap-1">
              {idx > 0 && <span aria-hidden="true">›</span>}
              {isLast || !item.href ? (
                <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd "C:/Site carol/carol-orofino" && npx jest Breadcrumb.test --no-coverage
```

Expected: all 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd "C:/Site carol/carol-orofino" && git add src/components/Breadcrumb.tsx src/components/__tests__/Breadcrumb.test.tsx && git commit -m "feat(blog): add Breadcrumb component"
```

---

## Task 4: AuthorBlock component

**Files:**
- Create: `src/components/AuthorBlock.tsx`
- Create: `src/components/__tests__/AuthorBlock.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/__tests__/AuthorBlock.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import AuthorBlock from '../AuthorBlock'

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn().mockResolvedValue((key: string) => {
    const map: Record<string, string> = {
      authorRole: 'Especialista em Design de Interiores',
      minRead: 'min de leitura',
    }
    return map[key] ?? key
  }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

describe('AuthorBlock', () => {
  it('renders author name', async () => {
    const ui = await AuthorBlock({ locale: 'pt', date: '2025-03-18', readTime: 5 })
    render(ui)
    expect(screen.getByText('Carol Orofino')).toBeInTheDocument()
  })

  it('renders author role from translation', async () => {
    const ui = await AuthorBlock({ locale: 'pt', date: '2025-03-18', readTime: 5 })
    render(ui)
    expect(screen.getByText('Especialista em Design de Interiores')).toBeInTheDocument()
  })

  it('renders read time with minRead label', async () => {
    const ui = await AuthorBlock({ locale: 'pt', date: '2025-03-18', readTime: 7 })
    render(ui)
    // readTime and minRead are rendered in the same <p>, so match the combined text
    expect(screen.getByText(/7.*min de leitura/)).toBeInTheDocument()
  })

  it('renders profile image', async () => {
    const ui = await AuthorBlock({ locale: 'pt', date: '2025-03-18', readTime: 5 })
    render(ui)
    expect(screen.getByAltText('Carol Orofino')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd "C:/Site carol/carol-orofino" && npx jest AuthorBlock.test --no-coverage
```

Expected: FAIL — "Cannot find module '../AuthorBlock'"

- [ ] **Step 3: Create `AuthorBlock` component**

Create `src/components/AuthorBlock.tsx`:

```tsx
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n'

interface AuthorBlockProps {
  locale: Locale
  date: string
  readTime: number
}

export default async function AuthorBlock({ locale, date, readTime }: AuthorBlockProps) {
  const t = await getTranslations({ locale, namespace: 'blog' })

  const localeCode =
    locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US'

  const formattedDate = new Date(date).toLocaleDateString(localeCode, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex items-center gap-4 py-6 px-6 max-w-6xl mx-auto border-b border-stone">
      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-sand">
        <Image
          src="/images/carol-profile.jpg"
          alt="Carol Orofino"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="font-body text-sm text-dark font-medium">Carol Orofino</p>
        <p className="font-body text-xs text-sage">{t('authorRole')}</p>
        <p className="font-body text-xs text-sage">
          {formattedDate} · {readTime} {t('minRead')}
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd "C:/Site carol/carol-orofino" && npx jest AuthorBlock.test --no-coverage
```

Expected: all 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd "C:/Site carol/carol-orofino" && git add src/components/AuthorBlock.tsx src/components/__tests__/AuthorBlock.test.tsx && git commit -m "feat(blog): add AuthorBlock component"
```

---

## Task 5: RelatedPosts component

**Files:**
- Create: `src/components/RelatedPosts.tsx`
- Create: `src/components/__tests__/RelatedPosts.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/__tests__/RelatedPosts.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import RelatedPosts from '../RelatedPosts'

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn().mockResolvedValue((key: string) => {
    const map: Record<string, string> = { relatedPostsTitle: 'Continue Lendo' }
    return map[key] ?? key
  }),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

jest.mock('@/data/posts', () => ({
  posts: [
    { slug: 'post-a', date: '2025-01-01', readTime: 5, category: 'Luxo', image: '/a.jpg', translations: { pt: { title: 'Post A' }, en: { title: 'Post A EN' }, es: { title: 'Post A ES' } } },
    { slug: 'post-b', date: '2025-03-20', readTime: 4, category: 'Minimalismo', image: '/b.jpg', translations: { pt: { title: 'Post B' }, en: { title: 'Post B EN' }, es: { title: 'Post B ES' } } },
    { slug: 'post-c', date: '2025-03-10', readTime: 6, category: 'Luxo', image: '/c.jpg', translations: { pt: { title: 'Post C' }, en: { title: 'Post C EN' }, es: { title: 'Post C ES' } } },
    { slug: 'post-d', date: '2025-02-15', readTime: 3, category: 'Design Escandinavo', image: '/d.jpg', translations: { pt: { title: 'Post D' }, en: { title: 'Post D EN' }, es: { title: 'Post D ES' } } },
  ],
}))

describe('RelatedPosts', () => {
  it('renders section heading from translation', async () => {
    const ui = await RelatedPosts({ locale: 'pt', currentSlug: 'post-a' })
    render(ui)
    expect(screen.getByText('Continue Lendo')).toBeInTheDocument()
  })

  it('excludes currentSlug from results', async () => {
    const ui = await RelatedPosts({ locale: 'pt', currentSlug: 'post-b' })
    render(ui)
    expect(screen.queryByText('Post B')).not.toBeInTheDocument()
  })

  it('shows up to 3 most recent posts', async () => {
    const ui = await RelatedPosts({ locale: 'pt', currentSlug: 'post-a' })
    render(ui)
    // post-b (2025-03-20), post-c (2025-03-10), post-d (2025-02-15) — most recent 3 excluding post-a
    expect(screen.getByText('Post B')).toBeInTheDocument()
    expect(screen.getByText('Post C')).toBeInTheDocument()
    expect(screen.getByText('Post D')).toBeInTheDocument()
  })

  it('links each card to the correct post URL', async () => {
    const ui = await RelatedPosts({ locale: 'pt', currentSlug: 'post-a' })
    render(ui)
    const link = screen.getAllByRole('link').find(l => l.getAttribute('href') === '/pt/blog/post-b')
    expect(link).toBeTruthy()
  })

  it('renders titles in the correct locale', async () => {
    const ui = await RelatedPosts({ locale: 'en', currentSlug: 'post-a' })
    render(ui)
    expect(screen.getByText('Post B EN')).toBeInTheDocument()
  })

  it('renders nothing when currentSlug is the only post', async () => {
    // Mutate the mock temporarily so only one post exists
    const postsMock = jest.requireMock('@/data/posts')
    const saved = postsMock.posts
    postsMock.posts = [{ slug: 'only', date: '2025-01-01', readTime: 5, category: 'Luxo', image: '/x.jpg', translations: { pt: { title: 'Only' }, en: { title: 'Only' }, es: { title: 'Only' } } }]
    const ui = await RelatedPosts({ locale: 'pt', currentSlug: 'only' })
    expect(ui).toBeNull()
    postsMock.posts = saved // restore
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd "C:/Site carol/carol-orofino" && npx jest RelatedPosts.test --no-coverage
```

Expected: FAIL — "Cannot find module '../RelatedPosts'"

- [ ] **Step 3: Create `RelatedPosts` component**

Create `src/components/RelatedPosts.tsx`:

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { posts } from '@/data/posts'
import type { Locale } from '@/lib/i18n'

interface RelatedPostsProps {
  locale: Locale
  currentSlug: string
}

export default async function RelatedPosts({ locale, currentSlug }: RelatedPostsProps) {
  const t = await getTranslations({ locale, namespace: 'blog' })

  const related = [...posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((p) => p.slug !== currentSlug)
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <section className="mt-16 border-t border-stone pt-12">
      <p className="font-body text-xs uppercase tracking-widest text-primary mb-8">
        {t('relatedPostsTitle')}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {related.map((post) => {
          const content = post.translations[locale]
          return (
            <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="group">
              {post.image ? (
                <div className="relative aspect-video overflow-hidden mb-4">
                  <Image
                    src={post.image}
                    alt={content.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-sand mb-4" />
              )}
              <p className="font-body text-xs text-mauve uppercase tracking-widest mb-2">
                {post.category}
              </p>
              <h3 className="font-display text-lg text-primary tracking-wide group-hover:text-walnut transition-colors leading-snug">
                {content.title}
              </h3>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd "C:/Site carol/carol-orofino" && npx jest RelatedPosts.test --no-coverage
```

Expected: all 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd "C:/Site carol/carol-orofino" && git add src/components/RelatedPosts.tsx src/components/__tests__/RelatedPosts.test.tsx && git commit -m "feat(blog): add RelatedPosts component"
```

---

## Task 6: Wire components into the article page

**Files:**
- Modify: `src/app/[locale]/blog/[slug]/page.tsx`

- [ ] **Step 1: Add imports**

At the top of `src/app/[locale]/blog/[slug]/page.tsx`, add three imports after the existing import block (after line 8):

```tsx
import Breadcrumb from '@/components/Breadcrumb'
import AuthorBlock from '@/components/AuthorBlock'
import RelatedPosts from '@/components/RelatedPosts'
```

- [ ] **Step 2: Remove "← Back to Blog" link**

Find and delete the following block from `src/app/[locale]/blog/[slug]/page.tsx` (identify by content — do NOT rely on line numbers as they shift after Step 1 adds imports):

```tsx
<Link
  href={`/${locale}/blog`}
  className="font-body text-xs uppercase tracking-widest text-dark hover:text-primary transition-colors mb-12 inline-block"
>
  ← {t('backToBlog')}
</Link>
```

The breadcrumb replaces it.

- [ ] **Step 3: Add Breadcrumb at the top of `<article>`**

At the start of `<article>` (before the flex container that holds the sections), add:

```tsx
<Breadcrumb
  items={[
    { label: t('breadcrumbHome'), href: `/${locale}` },
    { label: 'Blog', href: `/${locale}/blog` },
    { label: content.title },
  ]}
/>
```

- [ ] **Step 4: Add AuthorBlock between hero and two-column grid**

Between the closing `</div>` of the hero section and the opening `<div className="grid grid-cols-1 lg:grid-cols-[1fr_280px]...">`, insert:

```tsx
<AuthorBlock locale={lang} date={post.date} readTime={post.readTime} />
```

- [ ] **Step 5: Add image + caption to TextSection rendering**

In the `else` branch of section rendering (the `TextSection` path), after the closing `</div>` of the tip block (or after the table block if no tip), add image + caption rendering. The complete `else` branch should end like this (add after the tip block):

```tsx
{section.image && (
  <div className="mt-8">
    <Image
      src={section.image}
      alt={section.heading}
      width={800}
      height={450}
      className="w-full object-cover"
    />
    {section.imageCaption && (
      <p className="font-body text-xs text-sage text-center mt-3 italic">
        {section.imageCaption}
      </p>
    )}
  </div>
)}
```

- [ ] **Step 6: Add RelatedPosts after CTA button**

After the closing `</div>` of the CTA button block (the `mt-12` div containing the contact Link), add:

```tsx
<RelatedPosts locale={lang} currentSlug={post.slug} />
```

- [ ] **Step 7: Verify TypeScript compiles**

```bash
cd "C:/Site carol/carol-orofino" && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 8: Run all tests**

```bash
cd "C:/Site carol/carol-orofino" && npx jest --no-coverage
```

Expected: all tests pass.

- [ ] **Step 9: Commit**

```bash
cd "C:/Site carol/carol-orofino" && git add src/app/[locale]/blog/[slug]/page.tsx && git commit -m "feat(blog): wire Breadcrumb, AuthorBlock, RelatedPosts and section images into article page"
```

---

## Task 7: Add Breadcrumb to the listing page

**Files:**
- Modify: `src/app/[locale]/blog/page.tsx`

- [ ] **Step 1: Add Breadcrumb import**

At the top of `src/app/[locale]/blog/page.tsx`, add after the existing imports:

```tsx
import Breadcrumb from '@/components/Breadcrumb'
```

- [ ] **Step 2: Add Breadcrumb before the h1**

Inside the `return`, before the `<h1>` element (currently the first child of the outer `<div>`), add:

```tsx
<Breadcrumb
  items={[
    { label: t('breadcrumbHome'), href: `/${locale}` },
    { label: 'Blog' },
  ]}
/>
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd "C:/Site carol/carol-orofino" && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Run all tests**

```bash
cd "C:/Site carol/carol-orofino" && npx jest --no-coverage
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
cd "C:/Site carol/carol-orofino" && git add "src/app/[locale]/blog/page.tsx" && git commit -m "feat(blog): add Breadcrumb to blog listing page"
```

---

## Task 8: Final verification

- [ ] **Step 1: Run full test suite**

```bash
cd "C:/Site carol/carol-orofino" && npx jest --no-coverage
```

Expected: all tests pass, no failures.

- [ ] **Step 2: Full TypeScript check**

```bash
cd "C:/Site carol/carol-orofino" && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Start dev server and manually verify**

```bash
cd "C:/Site carol/carol-orofino" && npm run dev
```

Check the following at `http://localhost:3000/pt/blog`:
- Breadcrumb `Home › Blog` appears above the h1

Check at `http://localhost:3000/pt/blog/<any-slug>`:
- Breadcrumb `Home › Blog › Post Title` appears at top of article
- AuthorBlock with Carol's photo, name, role, date and read time appears below the hero
- "← Voltar ao blog" link is gone
- Related posts section appears at the bottom with 3 cards
- (Optional) If any TextSection in `posts.ts` has `image` and `imageCaption` fields set, they render with caption below
