# Blog Improvements — Design Spec
**Date:** 2026-03-24
**Status:** Approved

## Goal

Improve the blog (listing and article pages) to align more closely with the reference blog at stylodecore.com, adding author block, breadcrumb navigation, in-article images with captions, and related posts section.

---

## Approach

Incremental additions only — no structural refactors. All new fields are optional so existing posts remain unaffected.

---

## 1. Data Model Changes (`src/data/posts.ts`)

Add two optional fields to `TextSection`:

```ts
interface TextSection {
  type?: 'text'
  heading: string
  body: string
  table?: { label: string; value: string }[]
  tip?: string
  image?: string         // NEW: optional section image path
  imageCaption?: string  // NEW: optional caption shown below the image
}
```

No changes to `FabricSection` or `Post`. All existing posts continue to work as-is.

---

## 2. New Components

### `AuthorBlock` (`src/components/AuthorBlock.tsx`)

- Fixed author: Carol Orofino
- Profile photo: `/images/carol-profile.jpg`
- Name: "Carol Orofino"
- Role: from translation key `blog.authorRole` (e.g. "Especialista em Design de Interiores")
- Date: formatted from `post.date` (localized)
- Read time: `post.readTime` + `t('minRead')` from the `blog` namespace (reuse existing key, do NOT create a new one)
- Styling: uses existing tokens (`font-body`, `font-display`, `text-primary`, `text-dark`, `text-sage`, `border-stone`)
- Placement: directly below the hero section, before article content

### `RelatedPosts` (`src/components/RelatedPosts.tsx`)

Props: `{ locale: Locale; currentSlug: string }`

- Shows 3 most recent posts excluding the current one, sorted descending by date
- Each card: cover image (aspect-video), category tag, post title, link to `/${locale}/blog/${post.slug}`
- Layout: responsive grid (1 col mobile, 3 cols desktop)
- Section heading: translated via `t('relatedPostsTitle')` from the `blog` namespace
- Styling: matches existing card style from blog listing
- Placement: after the CTA button at the end of the article

### `Breadcrumb` (`src/components/Breadcrumb.tsx`)

- Accepts an array of `{ label: string; href?: string }` items
- Renders: `Home › Blog` (listing) or `Home › Blog › Post Title` (article)
- Last item has no link (current page)
- Styling: `font-body text-xs text-sage uppercase tracking-widest` with `›` separator
- Placement: top of content area, before the main heading

---

## 3. Page Changes

### Article page (`src/app/[locale]/blog/[slug]/page.tsx`)

1. Remove the existing "← Back to Blog" `<Link>` (lines 97-102). The breadcrumb replaces it.
2. Add `<Breadcrumb items={[{ label: t('breadcrumbHome'), href: `/${locale}` }, { label: 'Blog', href: `/${locale}/blog` }, { label: content.title }]} />` at the top of the `<article>` element.
3. Add `<AuthorBlock>` between the hero `<div>` and the two-column grid `<div>` (i.e., spanning full width, outside the grid).
4. In `TextSection` rendering only (the `else` branch, lines 153-198): after the `tip` block (or after the `table` block if there is no tip), render `section.image` as a full-width `<Image>` and `section.imageCaption` as a centered caption below it, when those fields are present. The `FabricSection` branch is unchanged.
5. Add `<RelatedPosts locale={lang} currentSlug={post.slug} />` after the CTA button at the bottom.

### Listing page (`src/app/[locale]/blog/page.tsx`)

1. Add `<Breadcrumb>` before the `<h1>` heading
2. No other changes

### `BlogSidebar.tsx` — no changes

---

## 4. Translations

Add to all three locale files (`pt`, `en`, `es`) in the `blog` namespace:

- `authorRole` — Carol's displayed role (e.g. "Especialista em Design de Interiores" / "Interior Design Specialist" / "Especialista en Diseño de Interiores")
- `relatedPostsTitle` — "Continue Lendo" / "Keep Reading" / "Seguir Leyendo"
- `breadcrumbHome` — "Home" (same value in all three languages; intentional duplication to keep all breadcrumb labels within the `blog` namespace and avoid cross-namespace dependencies in a server component)

Note: `minRead` already exists in all three locale files — do NOT add a new key for it.

---

## 5. Out of Scope

- Social sharing buttons
- Comments
- Tags/tagging system
- Author page
- Any change to BlogSidebar
