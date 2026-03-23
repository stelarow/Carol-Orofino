# Blog Card Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 16:9 cover image above each post card in the blog listing page.

**Architecture:** Single file change in `src/app/[locale]/blog/page.tsx`. Each `<article>` gets an image wrapper before metadata. Posts without an image get a `bg-sand` placeholder div. The `border-t border-stone` moves off the article; `pt-10 pb-10` moves to an inner text wrapper div.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS v4, next/image, Jest + React Testing Library

---

## File Map

| Action | File |
|--------|------|
| Modify | `src/app/[locale]/blog/page.tsx` |
| Create | `src/app/[locale]/blog/__tests__/page.test.tsx` |

---

### Task 1: Write the failing test

**Files:**
- Create: `src/app/[locale]/blog/__tests__/page.test.tsx`

- [ ] **Step 1: Create the test file**

```tsx
// src/app/[locale]/blog/__tests__/page.test.tsx
import { render, screen } from '@testing-library/react'
import BlogPage from '../page'

// Mock next-intl
jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn().mockResolvedValue((key: string) => key),
}))

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

// Mock BlogSidebar
jest.mock('@/components/BlogSidebar', () => ({
  __esModule: true,
  default: () => <aside data-testid="blog-sidebar" />,
}))

// Mock posts
jest.mock('@/data/posts', () => ({
  posts: [
    {
      slug: 'post-with-image',
      date: '2025-03-20',
      readTime: 5,
      category: 'Luxo',
      image: '/images/blog/post-with-image.png',
      translations: {
        pt: { title: 'Post Com Imagem', subtitle: 'Subtítulo', sections: [], conclusion: '', cta: '' },
        en: { title: 'Post With Image', subtitle: 'Subtitle', sections: [], conclusion: '', cta: '' },
        es: { title: 'Post Con Imagen', subtitle: 'Subtítulo', sections: [], conclusion: '', cta: '' },
      },
    },
    {
      slug: 'post-without-image',
      date: '2025-03-10',
      readTime: 4,
      category: 'Minimalismo',
      image: undefined,
      translations: {
        pt: { title: 'Post Sem Imagem', subtitle: 'Subtítulo', sections: [], conclusion: '', cta: '' },
        en: { title: 'Post Without Image', subtitle: 'Subtitle', sections: [], conclusion: '', cta: '' },
        es: { title: 'Post Sin Imagen', subtitle: 'Subtítulo', sections: [], conclusion: '', cta: '' },
      },
    },
  ],
}))

const defaultProps = {
  params: Promise.resolve({ locale: 'pt' }),
  searchParams: Promise.resolve({}),
}

describe('BlogPage — card images', () => {
  it('renders an img with the post image and localized alt text for posts with an image', async () => {
    const ui = await BlogPage(defaultProps)
    render(ui)
    const img = screen.getByRole('img', { name: 'Post Com Imagem' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/images/blog/post-with-image.png')
  })

  it('does not render an img for posts without an image', async () => {
    const ui = await BlogPage(defaultProps)
    render(ui)
    expect(screen.queryByRole('img', { name: 'Post Sem Imagem' })).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx jest "blog/__tests__/page.test.tsx" --no-coverage
```

Expected: FAIL — `<img>` is not found because the image block doesn't exist yet.

---

### Task 2: Implement the image block

**Files:**
- Modify: `src/app/[locale]/blog/page.tsx`

- [ ] **Step 1: Add the `next/image` import**

In `src/app/[locale]/blog/page.tsx`, add after line 2 (`import Link from 'next/link'`):

```tsx
import Image from 'next/image'
```

- [ ] **Step 2: Replace the entire `<article>` block**

In `src/app/[locale]/blog/page.tsx`, replace the entire article block (lines 87–113) with the following. Match exact indentation (18 spaces for `<article>`).

Replace:

```tsx
                  <article
                    key={post.slug}
                    className="border-t border-stone pt-10 pb-10"
                  >
                    <p className="font-body text-xs text-mauve uppercase tracking-widest mb-4">
                      {post.category}
                      {' · '}
                      {new Date(post.date).toLocaleDateString(
                        lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US',
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                      {' · '}
                      {post.readTime} {t('minRead')}
                    </p>
                    <h2 className="font-display text-2xl md:text-3xl text-primary tracking-wide mb-3">
                      {content.title}
                    </h2>
                    <p className="font-body text-base text-dark italic leading-relaxed mb-6">
                      {content.subtitle}
                    </p>
                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      className="font-body text-xs uppercase tracking-widest text-primary border-b border-primary pb-0.5 transition-colors hover:text-mauve hover:border-mauve"
                    >
                      {t('readMore')} →
                    </Link>
                  </article>
```

With:

```tsx
                  <article key={post.slug}>
                    {/* Cover image — sizes accounts for 280px sidebar + 4rem gap */}
                    {post.image ? (
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={post.image}
                          alt={content.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) calc(100vw - 280px - 4rem), 100vw"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-sand" />
                    )}
                    {/* Text content */}
                    <div className="border-t border-stone pt-10 pb-10">
                      <p className="font-body text-xs text-mauve uppercase tracking-widest mb-4">
                        {post.category}
                        {' · '}
                        {new Date(post.date).toLocaleDateString(
                          lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US',
                          { year: 'numeric', month: 'long', day: 'numeric' }
                        )}
                        {' · '}
                        {post.readTime} {t('minRead')}
                      </p>
                      <h2 className="font-display text-2xl md:text-3xl text-primary tracking-wide mb-3">
                        {content.title}
                      </h2>
                      <p className="font-body text-base text-dark italic leading-relaxed mb-6">
                        {content.subtitle}
                      </p>
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        className="font-body text-xs uppercase tracking-widest text-primary border-b border-primary pb-0.5 transition-colors hover:text-mauve hover:border-mauve"
                      >
                        {t('readMore')} →
                      </Link>
                    </div>
                  </article>
```

> Note: `border-t border-stone` moves from `<article>` to the inner text `<div>` — the image itself provides top separation between cards.

- [ ] **Step 3: Verify the file compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 3: Run tests and commit

- [ ] **Step 1: Run the new tests**

```bash
npx jest "blog/__tests__/page.test.tsx" --no-coverage
```

Expected: PASS — both tests green.

- [ ] **Step 2: Run the full test suite to check for regressions**

```bash
npx jest --no-coverage
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add 'src/app/[locale]/blog/page.tsx' 'src/app/[locale]/blog/__tests__/page.test.tsx'
git commit -m "feat(blog): add 16:9 cover image to post cards in listing"
```
