# Blog Card Images — Design Spec

**Date:** 2026-03-23
**Status:** Approved

## Problem

The blog listing page (`/blog`) shows posts as a plain text list. No visual hierarchy beyond typography — posts lack immediate visual identity.

## Goal

Add a cover image (16:9, `object-cover`) above each post card in the listing. Posts without an image get a warm placeholder (`bg-sand`).

## Scope

Single file change: `src/app/[locale]/blog/page.tsx`

## Design

Each `<article>` in the listing gets a `next/image` block inserted before the metadata line:

- **Image wrapper:** `<div className="relative aspect-video overflow-hidden">` containing `<Image fill className="object-cover" alt={content.title} src={post.image} />`
- **`fill` mode required:** parent must be `relative` with `overflow-hidden` — consistent with the pattern in `projetos/page.tsx` and `[slug]/page.tsx`
- **`alt` text:** `content.title` (the post's localized title)
- **Fallback:** `<div className="aspect-video bg-sand" />` when `post.image` is undefined
- **Border:** `border-t border-stone` moves from `<article>` to the inner text `<div>`; the image provides top separation between cards, and the border sits between the image and the text content
- **Spacing:** `pt-10 pb-10` moves from `<article>` to an inner `<div>` wrapping the text content below the image — so padding sits below the image, not above it

## Data

Posts already have an optional `image` field on the `Post` interface — no data changes needed.

## Out of Scope

- Article page (`[slug]/page.tsx`) — unchanged
- Sidebar — unchanged
- Post data structure — unchanged
