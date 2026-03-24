# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run lint       # Run ESLint
npm run test       # Run Jest tests
npm run test:watch # Run Jest in watch mode
```

To run a single test file:
```bash
npx jest src/path/to/file.test.ts
```

## Environment Variables

Copy `.env.local.example` to `.env.local`. Required variables:
- `RESEND_API_KEY` — email delivery (questionnaire submissions)
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob (file uploads in questionnaire)

## Architecture

**Next.js App Router** with locale-based dynamic routing. All pages live under `src/app/[locale]/`, where `locale` is `pt` (default), `en`, or `es`. The root `page.tsx` redirects to `/pt`. Middleware at `middleware.ts` handles locale detection using `next-intl`.

**i18n:** Translation strings are in `src/messages/{pt,en,es}.json`. Server components use `getTranslations()` from next-intl. The routing config lives in `src/lib/i18n.ts`.

**Static Data:** Blog posts and services are TypeScript arrays in `src/data/`. Posts include inline multi-language content (not in the messages JSON). Static params are generated at build time via `generateStaticParams()`.

**Server Actions:** Form submission and file upload are handled in `src/actions/submitQuestionnaire.ts` using Vercel Blob for images and Resend for email.

**Components:** Client components use `'use client'`. The questionnaire (`src/components/questionnaire/`) manages multi-step state locally with `useState`. No global state management library is used.

**Styling:** Tailwind CSS v4 with custom color tokens defined as CSS variables (walnut, sage, stone, linen, sand). Fonts: Cormorant Garamond (display) and Inter (body). Framer Motion for animations.

**Path alias:** `@/` maps to `src/`.

## Key Patterns

- New pages go under `src/app/[locale]/` and must export `generateStaticParams()` for all locale combinations if they contain dynamic segments.
- Blog post data is defined in `src/data/posts.ts` — adding a post means adding an entry there with translations for all three locales.
- SEO: `robots.ts` and `sitemap.ts` exist at the app root for search indexing.
- Deployment target is Vercel.
