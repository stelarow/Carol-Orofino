# Blog Teaser Animations — Design Spec

**Date:** 2026-03-24
**Status:** Approved

## Overview

Add scroll-triggered entrance animations to the blog teaser section on the home page (`src/app/[locale]/page.tsx`). Posts appear with a staggered slide-up + fade effect as the section enters the viewport.

## Goals

- Improve perceived quality and elegance of the home page
- Animate posts sequentially (stagger) as the user scrolls to the section
- Animate only once per page load (no re-trigger on scroll back)
- Keep data fetching on the server; only animation logic on the client

## Non-Goals

- Hover card effects (not requested)
- Animating other sections of the home page
- Adding any new content or changing the blog section layout

## Architecture

### New Component: `BlogTeaser`

**File:** `src/components/BlogTeaser.tsx`
**Type:** Client component (`'use client'`)

Receives all data as props from the server component and handles animation logic. This keeps `page.tsx` as a pure server component.

**Props:**
```ts
import type { Post } from '@/data/posts'

interface BlogTeaserProps {
  posts: Post[]
  locale: string
  title: string         // t('blogTitle')
  readMore: string      // tBlog('readMore')
  blogLink: string      // t('blogLink')
  blogLinkHref: string  // `/${locale}/blog`
}
```

### Animation Design

Uses Framer Motion `motion` components with `whileInView` and `viewport: { once: true }`.

**Container variants:**
```ts
const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 }
  }
}
```

**Item variants (each post + CTA button):**
```ts
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}
```

### DOM Structure

The stagger container (`motion.div` with `container` variants) wraps **both** the post list and the CTA button together, so all elements participate in the same stagger sequence:

```
<motion.h2>                     ← title, standalone animation (no stagger)
<motion.div container>          ← stagger root: whileInView="visible" initial="hidden"
  <motion.div item>post 1</motion.div>
  <motion.div item>post 2</motion.div>
  ...
  <motion.div item>             ← CTA button, last in stagger
    <Link>Ver todos os posts</Link>
  </motion.div>
</motion.div>
```

Child `motion.div` elements with `item` variants do **not** need their own `whileInView`. Framer Motion propagates the variant state from the parent container to all descendants automatically — the stagger is controlled entirely by the container's `staggerChildren` transition.

### Viewport Configuration

**Section title (`motion.h2`):** `viewport: { once: true }` — no `amount` threshold. The title animates as soon as any part of it enters the viewport.

**Stagger container (`motion.div`):** `viewport: { once: true, amount: 0.1 }` — waits until 10% of the container is visible before triggering. This prevents the stagger from firing before the section is meaningfully on screen, which would make the animation invisible on fast scrolls.

Neither element uses a `margin` offset (unlike `AboutTeaser` which uses `margin: '-80px'`). The `y: 20` offset is small enough that the animation completes well within the viewport without needing early triggering.

### Update to `page.tsx`

Replace the inline blog section (lines 173–205) with `<BlogTeaser ... />`, passing all required strings and data as props.

## File Changes

| File | Action |
|------|--------|
| `src/components/BlogTeaser.tsx` | Create — new client component |
| `src/app/[locale]/page.tsx` | Update — import and use `BlogTeaser`, remove inline blog section |

## Dependencies

- `framer-motion` — already installed in the project

## Testing

- Verify stagger animation triggers on scroll on both desktop and mobile
- Verify `once: true` prevents re-animation on scroll back
- Verify no layout shift during animation (use `y` offset only, not height/width)
- Verify all locale strings render correctly in pt, en, es
- Verify the CTA button animates as the last item in the stagger sequence
