# Blog Teaser Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the blog teaser section from `page.tsx` into a new `BlogTeaser` client component that adds scroll-triggered staggered slide-up + fade entrance animations using Framer Motion.

**Architecture:** A new `'use client'` component (`BlogTeaser`) receives all data and strings as props from the server component (`page.tsx`), keeping data fetching server-side. Framer Motion variant propagation drives the stagger — only the container needs `whileInView`; children inherit the variant state automatically.

**Tech Stack:** Next.js App Router, Framer Motion (already installed), TypeScript, Tailwind CSS v4

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/BlogTeaser.tsx` | **Create** | Client component: renders blog posts + CTA with Framer Motion animations |
| `src/app/[locale]/page.tsx` | **Modify** (lines 173–205) | Remove inline blog section, import and use `BlogTeaser` |

---

## Task 1: Create `BlogTeaser` component

**Files:**
- Create: `src/components/BlogTeaser.tsx`

### Background

The existing `AboutTeaser` component (`src/components/AboutTeaser.tsx`) is the established pattern: a `'use client'` component that imports `motion` from `framer-motion` and uses `whileInView` + `viewport: { once: true }` for scroll-triggered animations. Follow the same conventions.

The `Post` type is exported from `src/data/posts.ts`:
```ts
export interface Post {
  slug: string
  date: string
  readTime: number
  category: string
  image?: string
  translations: { pt: {...}; en: {...}; es: {...} }
}
```

Each locale translation has `title: string` and `subtitle: string`.

### Animation variants

Two variants are needed:

```ts
// Stagger container — controls timing only, no visual change on the container itself
const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

// Each post item and the CTA button
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
```

### DOM structure (critical)

```
<section>
  <div max-w-4xl>
    <motion.h2 standalone>        ← title, no stagger
    <motion.div container>        ← stagger root, wraps posts AND cta
      <motion.div item>           ← post 1 (inside divide-y wrapper)
      <motion.div item>           ← post 2
      ...
      <motion.div item>           ← CTA button (last in stagger)
    </motion.div>
  </div>
</section>
```

The `divide-y divide-stone` class goes on a plain inner `div` that wraps only the posts. The CTA `motion.div` sits as a direct sibling of that inner div, both inside the stagger container. This way all post items and the CTA participate in the stagger, while the dividers still appear only between posts:

```
<motion.div container>           ← stagger root
  <div divide-y>                 ← plain div for dividers between posts
    <motion.div item>post 1</motion.div>
    <motion.div item>post 2</motion.div>
    ...
  </div>
  <motion.div item mt-10>        ← CTA, last child of stagger container
    <Link>...</Link>
  </motion.div>
</motion.div>
```

> **Important:** Child `motion.div` items do NOT need their own `whileInView`. Framer Motion propagates the `"visible"` variant state from the parent container to all descendants. Adding `whileInView` on children would break the stagger and make each post animate independently.

### Steps

- [ ] **Step 1: Create `src/components/BlogTeaser.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Post } from '@/data/posts'
import type { Locale } from '@/lib/i18n'

interface BlogTeaserProps {
  posts: Post[]
  locale: Locale
  title: string
  readMore: string
  blogLink: string
  blogLinkHref: string
}

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export function BlogTeaser({
  posts,
  locale,
  title,
  readMore,
  blogLink,
  blogLinkHref,
}: BlogTeaserProps) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl font-light italic text-primary leading-tight mb-10"
        >
          {title}
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="flex flex-col divide-y divide-stone">
            {posts.map((post) => (
              <motion.div key={post.slug} variants={item} className="py-8">
                <Link href={`/${locale}/blog/${post.slug}`} className="group">
                  <h2 className="font-display text-2xl md:text-3xl text-primary tracking-wide mb-2 group-hover:text-walnut transition-colors">
                    {post.translations[locale].title}
                  </h2>
                  <p className="font-body text-sm text-dark italic leading-relaxed mb-5">
                    {post.translations[locale].subtitle}
                  </p>
                  <span className="font-body text-xs uppercase tracking-widest text-primary border-b border-primary pb-0.5 transition-colors group-hover:text-mauve group-hover:border-mauve">
                    {readMore} →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div variants={item} className="mt-10">
            <Link
              href={blogLinkHref}
              className="inline-block bg-slate border border-white/60 px-8 py-3 font-display font-light italic text-white transition-opacity hover:opacity-80"
            >
              {blogLink}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors related to `BlogTeaser.tsx`.

---

## Task 2: Update `page.tsx` to use `BlogTeaser`

**Files:**
- Modify: `src/app/[locale]/page.tsx`

### Steps

- [ ] **Step 1: Add import at the top of `page.tsx`**

After the existing imports (around line 10), add:

```ts
import { BlogTeaser } from '@/components/BlogTeaser'
```

- [ ] **Step 2: Replace inline blog section with `<BlogTeaser />`**

Remove lines 173–205 (the entire `{/* Blog Teaser */}` section) and replace with:

```tsx
{/* Blog Teaser */}
<BlogTeaser
  posts={posts}
  locale={locale}
  title={t('blogTitle')}
  readMore={tBlog('readMore')}
  blogLink={t('blogLink')}
  blogLinkHref={`/${locale}/blog`}
/>
```

- [ ] **Step 3: Verify `tBlog` is still used**

The `tBlog` constant (line 37 in the original `page.tsx`) calls `getTranslations` and produces the `readMore` string, which is then forwarded as a prop to `BlogTeaser`. The call `tBlog('readMore')` stays in `page.tsx` — it is NOT moved into `BlogTeaser`. Just verify it wasn't accidentally deleted during the replacement.

- [ ] **Step 4: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Lint check**

```bash
npm run lint
```

Expected: no new errors or warnings.

---

## Task 3: Manual verification

**No automated tests exist for Framer Motion animations** — the animation itself is purely visual and cannot be asserted by Jest. Verify manually:

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Open `http://localhost:3000/pt` in a browser.

- [ ] **Step 2: Check stagger on scroll**

Scroll down to the blog section. Expected: the section title fades in first, then each blog post appears sequentially with a slide-up + fade (0.12s delay between each), and the "Ver todos os posts" button appears last.

- [ ] **Step 3: Verify `once: true` behavior**

Scroll back up past the blog section, then scroll down again. Expected: no re-animation — posts remain visible.

- [ ] **Step 4: Check other locales**

Visit `http://localhost:3000/en` and `http://localhost:3000/es`. Expected: blog section renders correctly in English and Spanish with animations intact.

- [ ] **Step 5: Check mobile**

Resize browser to mobile width (< 768px). Expected: animations work the same way; no layout shift.

---

## Task 4: Commit

- [ ] **Step 1: Stage and commit**

```bash
git add src/components/BlogTeaser.tsx src/app/[locale]/page.tsx
git commit -m "feat(home): add staggered scroll animations to blog teaser section"
```

---

## Done

The blog teaser section now animates on scroll with a staggered slide-up + fade effect, matching the quality of the `AboutTeaser` component already on the page.
