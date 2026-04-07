# Scroll Reveal Effect — Design Spec

**Date:** 2026-03-16
**Project:** Carol Orofino — Interior Design Portfolio Website
**Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS

---

## 1. Overview

Add a global, sophisticated scroll-reveal animation to all major content elements across the site. As elements enter the viewport, they fade in with a subtle upward shift — imperceptible but refined, aligning with the luxury editorial aesthetic of the brand (Bottega Veneta / Hermès style).

No new dependencies. Pure CSS transitions + native `IntersectionObserver`.

---

## 2. Goals

- Every important element (titles, project cards, body text, standalone images) animates on scroll entry
- Motion is small and contained: `y: 10px → 0`, `opacity: 0 → 1`, `duration: 0.6s ease-out`
- Grid items stagger with an `80ms` delay increment between cards (capped at `320ms`)
- Animates once per element (no re-trigger on scroll back up)
- Zero new npm dependencies
- SSR-safe (no hydration mismatch)
- Hero sections are intentionally excluded — above-the-fold content must never be hidden on load

---

## 3. Architecture

### 3.1 `src/hooks/useInView.ts`

Custom hook using native `IntersectionObserver`.

```typescript
// Returns [ref, isVisible]
useInView(options?: {
  threshold?: number   // default: 0.15
  rootMargin?: string  // default: '0px'
  once?: boolean       // default: true
}): [RefObject<Element>, boolean]
```

- `threshold: 0.15` — triggers when 15% of element is visible
- `once: true` (default) — disconnects observer after first trigger (no re-animation)
- SSR-safe: guard with `typeof window !== 'undefined'`

### 3.2 `src/components/FadeIn.tsx`

`'use client'` wrapper component.

```typescript
interface FadeInProps {
  children: React.ReactNode
  delay?: number       // milliseconds, default 0
  className?: string
}
```

The component renders with `className="fade-in-hidden"` unconditionally in its JSX output — this class is present in both server-rendered HTML and initial client render, ensuring the element starts invisible consistently. When `useInView` fires, the class switches to `fade-in-visible`. There is no dynamic class addition on mount — the initial invisible state comes directly from the render output, preventing FOUC.

Uses inline `style={{ transitionDelay: `${delay}ms` }}` for stagger control.

### 3.3 CSS in `src/app/globals.css`

Animation classes are wrapped in `@media (prefers-reduced-motion: no-preference)` so users who have opted out of motion always see elements immediately. The `transition` declaration lives on `.fade-in-hidden` so it is always present regardless of state.

Also note: any existing `scroll-behavior: smooth` on `html` must be moved inside the same `prefers-reduced-motion: no-preference` guard.

```css
@media (prefers-reduced-motion: no-preference) {
  .fade-in-hidden {
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }

  .fade-in-visible {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 4. Usage Per Page

Hero sections are excluded from `FadeIn`. Below-the-fold content only.

| Location | Element | Delay |
|---|---|---|
| All pages | Section `<h1>` / `<h2>` | `0ms` |
| All pages | Body paragraph after title | `100ms` |
| Home — Specialties panels | Each panel (4 items) | `index * 80ms` |
| Home — Featured Projects grid | Each `<ProjectCard>` | `Math.min(index * 80, 320)ms` |
| Home — About Teaser | Photo | `0ms` |
| Home — About Teaser | Text block | `150ms` |
| Projects listing grid | Each `<ProjectCard>` | `Math.min(index * 80, 320)ms` |
| Project Detail | Title + meta | `0ms` |
| Project Detail | Gallery images | `Math.min(index * 80, 320)ms` |
| About | `<h1>` title | `0ms` |
| About | Photo | `80ms` |
| About | Biography `<p>` | `150ms` |
| About | Philosophy `<h2>` + text | `200ms` |
| Services | Each service item | `Math.min(index * 80, 320)ms` |
| Contact | Page title + contact blocks | `0ms` / `100ms` |

---

## 5. SSR / Hydration Considerations

`FadeIn` is `'use client'`. The component renders `className="fade-in-hidden"` unconditionally — it is present in the server-rendered HTML output. This means:

1. Server renders: element invisible (`fade-in-hidden`)
2. Client hydrates: state matches server — no flash, no mismatch
3. `IntersectionObserver` fires: class switches to `fade-in-visible` → transition plays

This is the only correct approach. Do **not** add the hidden class dynamically in `useEffect` or `useLayoutEffect` after mount — that creates a FOUC where the element appears visible, then disappears, then fades in.

---

## 6. Accessibility

- `prefers-reduced-motion: no-preference` guard wraps all animation CSS — users who opt out see elements immediately with no transition
- `scroll-behavior: smooth` on `html` must also live inside this guard
- Elements are always visible when JS is disabled — the CSS only hides elements inside the media query, and `FadeIn` is a client component, so without JS the wrapper is not rendered at all

---

## 7. Out of Scope

- Parallax effects
- Scroll progress indicator
- Per-character or per-word text animation
- Re-trigger on scroll back (`once: true` is the default and fixed behavior for this feature)
