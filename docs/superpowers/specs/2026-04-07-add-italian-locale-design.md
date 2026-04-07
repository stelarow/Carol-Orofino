# Add Italian (it) Locale — Design Spec

**Date:** 2026-04-07  
**Status:** Approved

## Overview

Add Italian as the fourth language on the Carol Orofino website. The site currently supports `pt` (default), `en`, and `es`. This adds `it` across all layers: routing config, UI strings, blog post content, language switcher, locale format mappings, questionnaire, and email confirmation.

## Scope

All changes are delivered in a single branch. No feature flag. No partial state.

---

## 1. Routing Config

**File:** `src/lib/i18n.ts`

Add `'it'` to the `locales` array:

```ts
locales: ['pt', 'en', 'es', 'it'] as const,
```

The middleware (`middleware.ts`) and sitemap (`src/app/sitemap.ts`) both consume `routing.locales` dynamically — no changes needed in those files.

---

## 2. UI Translation File

**File:** `src/messages/it.json` (new file)

Create Italian translation of all ~352 strings from `pt.json`/`en.json`. Covers namespaces: `nav`, `home`, `about`, `services`, `projects`, `blog`, `contact`, `questionnaire`, `footer`, `notFound`, `404`, and any others present in the existing files.

Translation tone: consistent with the luxury interior design brand voice — elegant, warm, professional Italian.

---

## 3. Blog Post Type and Translations

**File:** `src/data/posts.ts`

Update `Post['translations']` type to include `it`:

```ts
translations: {
  pt: { ... }
  en: { ... }
  es: { ... }
  it: {
    title: string
    subtitle: string
    sections: PostSection[]
    conclusion: string
    cta: string
  }
}
```

Add Italian translations for all 3 existing posts:
- `the-new-language-of-luxury`
- `the-discipline-of-subtraction`
- `where-silence-has-a-shape`

---

## 4. `generateStaticParams` — Blog Slug Page

**File:** `src/app/[locale]/blog/[slug]/page.tsx` line 11

Hardcoded array `['pt', 'en', 'es']` must include `'it'`:

```ts
const locales: Locale[] = ['pt', 'en', 'es', 'it']
```

Or refactor to use `routing.locales` from `src/lib/i18n.ts` for automatic future-proofing.

---

## 5. Locale Format Mappings

Four files use the pattern `locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US'` for `Intl` date formatting. Add `it-IT` case before the `'en-US'` fallback in each:

- `src/components/AuthorBlock.tsx`
- `src/components/BlogSidebar.tsx`
- `src/app/[locale]/blog/page.tsx`
- `src/app/[locale]/blog/[slug]/page.tsx`

Result pattern: `locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : locale === 'it' ? 'it-IT' : 'en-US'`

---

## 6. Language Switcher

**Files:** `src/components/Navbar.tsx` and `src/components/Footer.tsx`

Add `{ code: 'it', label: 'IT' }` to the locale array in both components. The `IT` button appears alongside PT / EN / ES.

---

## 7. Questionnaire Page — Metadata Description

**File:** `src/app/[locale]/questionario/page.tsx`

The `generateMetadata` function has a hardcoded locale chain for the meta description. Add the Italian case:

```ts
locale === 'en'
  ? 'Fill out our questionnaire ...'
  : locale === 'es'
    ? 'Completa nuestro cuestionario ...'
    : locale === 'it'
      ? 'Compila il nostro questionario per aiutarci a capire il tuo progetto e preparare una proposta personalizzata.'
      : 'Preencha nosso questionário ...'
```

---

## 8. Phone Masking — Step1Identity

**File:** `src/components/questionnaire/Step1Identity.tsx`

Add Italian phone format before the `pt`/`es` fallback. Italy uses `+39` prefix, 10-digit numbers:

```ts
if (locale === 'it') {
  // +39 XXX XXX XXXX format (10 digits, no leading country code in local entry)
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('39')) digits = digits.slice(2)
  digits = digits.slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `+39 ${digits}`
  if (digits.length <= 6) return `+39 ${digits.slice(0, 3)} ${digits.slice(3)}`
  return `+39 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
}
```

**File:** `src/actions/questionnaireUtils.ts` — `normalizeWhatsApp`

Add Italian DDI normalization (`+39`):

```ts
if (locale === 'it') {
  return digits.startsWith('39') ? digits : `39${digits}`
}
```

---

## 9. Email Confirmation Strings

**File:** `src/actions/questionnaireUtils.ts` — `CLIENT_EMAIL_STRINGS`

Add Italian entry:

```ts
it: {
  subject: 'Abbiamo ricevuto il tuo questionario — Carol Orofino',
  greeting: (name) => `Ciao, ${name}!`,
  confirmation: 'Abbiamo ricevuto il tuo questionario e ti contatteremo a breve.',
  summaryTitle: 'Riepilogo del tuo invio',
  roomLabel: 'Ambiente/i',
  stylesLabel: 'Stile/i',
  nextSteps: 'Carol Orofino esaminerà le tue risposte e ti contatterà via WhatsApp o email.',
},
```

---

## Files Changed Summary

| File | Change |
|------|--------|
| `src/lib/i18n.ts` | Add `'it'` to locales |
| `src/messages/it.json` | New file — ~352 lines of Italian UI strings |
| `src/data/posts.ts` | Add `it` to type + 3 post translations |
| `src/app/[locale]/blog/[slug]/page.tsx` | Add `'it'` to static params + locale format |
| `src/app/[locale]/blog/page.tsx` | Add `it-IT` to locale format mapping |
| `src/components/AuthorBlock.tsx` | Add `it-IT` to locale format mapping |
| `src/components/BlogSidebar.tsx` | Add `it-IT` to locale format mapping |
| `src/components/Navbar.tsx` | Add `IT` to language switcher |
| `src/components/Footer.tsx` | Add `IT` to language switcher |
| `src/app/[locale]/questionario/page.tsx` | Add Italian meta description |
| `src/components/questionnaire/Step1Identity.tsx` | Add Italian phone mask |
| `src/actions/questionnaireUtils.ts` | Add Italian phone normalization + email strings |

---

## Out of Scope

- Translating alt text / image captions (not currently i18n-ized)
- Adding Italian to test fixtures (tests use `'pt'` hardcoded, no behavioral change from adding `'it'`)
- URL slug localization (slugs remain in English across all locales, consistent with current behavior)
