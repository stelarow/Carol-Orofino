# Scroll Reveal Effect Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a global, sophisticated scroll-reveal animation (fade + 10px lift, 0.6s ease-out) to all below-the-fold content across the Carol Orofino portfolio site.

**Architecture:** A `useInView` custom hook wraps the native `IntersectionObserver` API. A `FadeIn` client component uses that hook and renders `fade-in-hidden` unconditionally in its initial JSX (SSR-safe), switching to `fade-in-visible` when the observer fires. CSS transitions handle the actual animation inside a `prefers-reduced-motion` guard.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS 4, Jest + React Testing Library (jsdom)

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/hooks/useInView.ts` | IntersectionObserver hook returning `[ref, isVisible]` |
| Create | `src/components/FadeIn.tsx` | Client wrapper applying fade-in-hidden/visible classes |
| Create | `src/hooks/__tests__/useInView.test.ts` | Unit tests for hook behavior |
| Create | `src/components/__tests__/FadeIn.test.tsx` | Unit tests for FadeIn component |
| Modify | `src/app/globals.css` | Add scroll-reveal CSS, fix scroll-behavior motion guard |
| Modify | `src/app/[locale]/page.tsx` | Wrap specialties title, featured grid, about teaser |
| Modify | `src/app/[locale]/projetos/ProjectsList.tsx` | Wrap each ProjectCard with stagger |
| Modify | `src/app/[locale]/projetos/[slug]/page.tsx` | Wrap header, description |
| Modify | `src/components/ProjectGallery.tsx` | Wrap rest images with stagger |
| Modify | `src/app/[locale]/sobre/page.tsx` | Wrap all content elements |
| Modify | `src/app/[locale]/servicos/page.tsx` | Wrap h1, each service card |
| Modify | `src/app/[locale]/contato/page.tsx` | Wrap contact blocks |

---

## Chunk 1: Foundation — Hook, Component, CSS

### Task 1: CSS — Add scroll-reveal classes and fix motion guard

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace the entire contents of `src/app/globals.css` with the following**

  > **IMPORTANT:** This is the complete final file. Do not drop any block. The existing `@layer utilities { .fade-in }` and `@keyframes fadeIn` blocks are preserved at the bottom — they handle page transitions and are unrelated to scroll reveal.

  ```css
  /* src/app/globals.css */
  @import "tailwindcss";

  @theme {
    /* ── Palette aliases (60-30-10) ───────────────────────────────────────── */

    /* 60% — Dominant: backgrounds & large surfaces */
    --color-linen: #edeae1;   /* main page background */
    --color-sand:  #e0cfb3;   /* warm section backgrounds */

    /* 30% — Secondary: supporting surfaces, UI, text */
    --color-stone: #d5d0cc;   /* card backgrounds, subtle surfaces */
    --color-mist:  #dfe3e6;   /* borders, dividers */
    --color-sky:   #ccdae3;   /* cool accent surfaces */
    --color-latte: #c0af9b;   /* hover areas, warm secondary */
    --color-sage:  #95978a;   /* secondary text, captions */
    --color-slate: #7c777d;   /* footer, dark UI labels */

    /* 10% — Accent: CTAs, headings, brand */
    --color-walnut: #86725a;

    /* ── Semantic tokens (mapped to palette) ─────────────────────────────── */
    --color-background: #e0cfb3;   /* → sand */
    --color-text-primary: #1A1A1A;
    --color-primary: #86725a;      /* → walnut */
    --color-secondary: #c0af9b;    /* → latte */
    --color-neutral: #d5d0cc;      /* → stone */
    --color-dark: #7c777d;         /* → slate */

    /* Font families */
    --font-display: var(--font-cormorant), Georgia, serif;
    --font-body: var(--font-inter), system-ui, sans-serif;

    /* Letter spacing */
    --letter-spacing-logo: 0.2em;
  }

  @layer base {
    html {
      background-color: theme(--color-background);
      color: theme(--color-text-primary);
      font-family: theme(--font-body);
      /* scroll-behavior is in the motion guard below */
    }

    body {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  }

  @layer utilities {
    .fade-in {
      animation: fadeIn 200ms ease-in forwards;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (prefers-reduced-motion: no-preference) {
    html {
      scroll-behavior: smooth;
    }

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

- [ ] **Step 2: Verify no syntax errors**

  Run: `cd "/c/Site carol/carol-orofino" && npm run build 2>&1 | head -30`
  Expected: No CSS parse errors.

- [ ] **Step 3: Commit**

  ```bash
  cd "/c/Site carol/carol-orofino"
  git add src/app/globals.css
  git commit -m "style: add scroll-reveal CSS classes with prefers-reduced-motion guard"
  ```

---

### Task 2: `useInView` hook

**Files:**
- Create: `src/hooks/__tests__/useInView.test.ts`
- Create: `src/hooks/useInView.ts`

- [ ] **Step 1: Create the test file**

  Create `src/hooks/__tests__/useInView.test.ts`:

  ```typescript
  import { renderHook, act } from '@testing-library/react'
  import { useInView } from '../useInView'

  // Mock IntersectionObserver
  const mockObserve = jest.fn()
  const mockDisconnect = jest.fn()
  let intersectionCallback: IntersectionObserverCallback | undefined

  beforeEach(() => {
    intersectionCallback = undefined
    mockObserve.mockClear()
    mockDisconnect.mockClear()
    window.IntersectionObserver = jest.fn((cb) => {
      intersectionCallback = cb
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: jest.fn(),
        root: null,
        rootMargin: '',
        thresholds: [],
        takeRecords: () => [],
      }
    }) as unknown as typeof IntersectionObserver
  })

  describe('useInView', () => {
    it('returns isVisible false initially', () => {
      const { result } = renderHook(() => useInView())
      const [, isVisible] = result.current
      expect(isVisible).toBe(false)
    })

    it('returns isVisible true when intersection fires', () => {
      const { result } = renderHook(() => useInView())
      act(() => {
        intersectionCallback!(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver
        )
      })
      const [, isVisible] = result.current
      expect(isVisible).toBe(true)
    })

    it('disconnects observer after first intersection when once is true (default)', () => {
      renderHook(() => useInView())
      act(() => {
        intersectionCallback!(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver
        )
      })
      expect(mockDisconnect).toHaveBeenCalledTimes(1)
    })

    it('does NOT disconnect observer when once is false', () => {
      renderHook(() => useInView({ once: false }))
      act(() => {
        intersectionCallback!(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver
        )
      })
      expect(mockDisconnect).not.toHaveBeenCalled()
    })

    it('still sets isVisible true when once is false', () => {
      const { result } = renderHook(() => useInView({ once: false }))
      act(() => {
        intersectionCallback!(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver
        )
      })
      const [, isVisible] = result.current
      expect(isVisible).toBe(true)
    })
  })
  ```

- [ ] **Step 2: Run test to verify it fails**

  Run: `cd "/c/Site carol/carol-orofino" && npx jest src/hooks/__tests__/useInView.test.ts --no-coverage 2>&1`
  Expected: FAIL — "Cannot find module '../useInView'"

- [ ] **Step 3: Create the hook**

  Create `src/hooks/useInView.ts`:

  ```typescript
  import { useRef, useState, useEffect, RefObject } from 'react'

  interface UseInViewOptions {
    threshold?: number
    rootMargin?: string
    once?: boolean
  }

  export function useInView(options: UseInViewOptions = {}): [RefObject<HTMLDivElement>, boolean] {
    const { threshold = 0.15, rootMargin = '0px', once = true } = options
    const ref = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
      if (typeof window === 'undefined') return
      const el = ref.current
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (once) observer.disconnect()
          }
        },
        { threshold, rootMargin }
      )

      observer.observe(el)
      return () => observer.disconnect()
    }, [threshold, rootMargin, once])

    return [ref, isVisible]
  }
  ```

- [ ] **Step 4: Run tests to verify they pass**

  Run: `cd "/c/Site carol/carol-orofino" && npx jest src/hooks/__tests__/useInView.test.ts --no-coverage 2>&1`
  Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

  ```bash
  cd "/c/Site carol/carol-orofino"
  git add src/hooks/useInView.ts src/hooks/__tests__/useInView.test.ts
  git commit -m "feat: add useInView hook with IntersectionObserver"
  ```

---

### Task 3: `FadeIn` component

**Files:**
- Create: `src/components/__tests__/FadeIn.test.tsx`
- Create: `src/components/FadeIn.tsx`

- [ ] **Step 1: Create the test file**

  Create `src/components/__tests__/FadeIn.test.tsx`:

  ```typescript
  import { render, screen } from '@testing-library/react'
  import FadeIn from '../FadeIn'

  // Mock useInView so we control isVisible
  jest.mock('@/hooks/useInView', () => ({
    useInView: jest.fn(),
  }))

  import { useInView } from '@/hooks/useInView'
  const mockUseInView = useInView as jest.Mock

  describe('FadeIn', () => {
    it('renders children', () => {
      mockUseInView.mockReturnValue([{ current: null }, false])
      render(<FadeIn><span>hello</span></FadeIn>)
      expect(screen.getByText('hello')).toBeInTheDocument()
    })

    it('applies fade-in-hidden class when not visible', () => {
      mockUseInView.mockReturnValue([{ current: null }, false])
      const { container } = render(<FadeIn><span>hello</span></FadeIn>)
      expect(container.firstChild).toHaveClass('fade-in-hidden')
      expect(container.firstChild).not.toHaveClass('fade-in-visible')
    })

    it('applies fade-in-visible class when visible', () => {
      mockUseInView.mockReturnValue([{ current: null }, true])
      const { container } = render(<FadeIn><span>hello</span></FadeIn>)
      expect(container.firstChild).toHaveClass('fade-in-visible')
      expect(container.firstChild).not.toHaveClass('fade-in-hidden')
    })

    it('applies transitionDelay when delay prop is provided', () => {
      mockUseInView.mockReturnValue([{ current: null }, false])
      const { container } = render(<FadeIn delay={200}><span>hello</span></FadeIn>)
      expect(container.firstChild).toHaveStyle('transition-delay: 200ms')
    })

    it('passes extra className to wrapper div', () => {
      mockUseInView.mockReturnValue([{ current: null }, false])
      const { container } = render(<FadeIn className="my-class"><span>hello</span></FadeIn>)
      expect(container.firstChild).toHaveClass('my-class')
    })

    it('does not set inline style when delay is 0 (default)', () => {
      mockUseInView.mockReturnValue([{ current: null }, false])
      const { container } = render(<FadeIn><span>hello</span></FadeIn>)
      expect(container.firstChild).not.toHaveAttribute('style')
    })
  })
  ```

- [ ] **Step 2: Run test to verify it fails**

  Run: `cd "/c/Site carol/carol-orofino" && npx jest src/components/__tests__/FadeIn.test.tsx --no-coverage 2>&1`
  Expected: FAIL — "Cannot find module '../FadeIn'"

- [ ] **Step 3: Create the component**

  Create `src/components/FadeIn.tsx`:

  ```typescript
  'use client'

  import { useInView } from '@/hooks/useInView'

  interface FadeInProps {
    children: React.ReactNode
    delay?: number
    className?: string
  }

  export default function FadeIn({ children, delay = 0, className = '' }: FadeInProps) {
    const [ref, isVisible] = useInView()

    return (
      <div
        ref={ref}
        className={`${isVisible ? 'fade-in-visible' : 'fade-in-hidden'} ${className}`.trim()}
        style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
      >
        {children}
      </div>
    )
  }
  ```

- [ ] **Step 4: Run tests to verify they pass**

  Run: `cd "/c/Site carol/carol-orofino" && npx jest src/components/__tests__/FadeIn.test.tsx --no-coverage 2>&1`
  Expected: PASS — 6 tests passing.

- [ ] **Step 5: Run full test suite**

  Run: `cd "/c/Site carol/carol-orofino" && npx jest --no-coverage 2>&1`
  Expected: All tests pass.

- [ ] **Step 6: Commit**

  ```bash
  cd "/c/Site carol/carol-orofino"
  git add src/components/FadeIn.tsx src/components/__tests__/FadeIn.test.tsx
  git commit -m "feat: add FadeIn scroll-reveal component"
  ```

---

## Chunk 2: Apply FadeIn to All Pages

### Task 4: Home page (`src/app/[locale]/page.tsx`)

**Files:**
- Modify: `src/app/[locale]/page.tsx`

The Hero section (`<section className="relative h-[80vh] ...">`) is intentionally excluded.

- [ ] **Step 1: Add FadeIn import at the top of the file**

  Add after the last import:
  ```typescript
  import FadeIn from '@/components/FadeIn'
  ```

- [ ] **Step 2: Wrap Specialties section heading**

  In the Specialties section, wrap the `<h2>` and its divider together:

  ```tsx
  {/* Before */}
  <div className="py-14 text-center">
    <h2 className="font-display text-3xl md:text-4xl tracking-[0.15em] uppercase text-text-primary">
      {t('collectionsTitle')}
    </h2>
    <div className="mx-auto mt-3 h-px w-10 bg-primary" />
  </div>

  {/* After */}
  <FadeIn>
    <div className="py-14 text-center">
      <h2 className="font-display text-3xl md:text-4xl tracking-[0.15em] uppercase text-text-primary">
        {t('collectionsTitle')}
      </h2>
      <div className="mx-auto mt-3 h-px w-10 bg-primary" />
    </div>
  </FadeIn>
  ```

- [ ] **Step 3: Wrap each Specialties panel Link with FadeIn stagger**

  Wrap each of the 4 `<Link>` panels. Assign delays: Residencial=0, Comercial=80, Reforma=160, Design de Interiores=240.

  Example for the first panel:
  ```tsx
  {/* Before */}
  <Link href={`/${locale}/projetos?categoria=residencial`} className="group relative ...">
    ...
  </Link>

  {/* After */}
  <FadeIn delay={0}>
    <Link href={`/${locale}/projetos?categoria=residencial`} className="group relative ...">
      ...
    </Link>
  </FadeIn>
  ```

  Apply `delay={80}` to Comercial, `delay={160}` to Reforma, `delay={240}` to Design de Interiores.

  > Note: The `FadeIn` wrapper div must not break the grid layout. The specialties grid uses `grid-cols-2`. Since `FadeIn` wraps each Link in a `div`, the grid must be on the outer `div` wrapper — but since `FadeIn` renders a `div`, the grid children become the `FadeIn` divs. The outer grid (`<div className="grid grid-cols-2 w-full">`) should remain. The `FadeIn` wrapper div will receive the grid cell sizing automatically.

- [ ] **Step 4: Wrap Featured Projects section heading**

  ```tsx
  {/* Before */}
  <div className="pb-10 text-center">
    <h2 ...>{t('featuredTitle')}</h2>
    <div className="mx-auto mt-3 h-px w-10 bg-primary" />
  </div>

  {/* After */}
  <FadeIn>
    <div className="pb-10 text-center">
      <h2 ...>{t('featuredTitle')}</h2>
      <div className="mx-auto mt-3 h-px w-10 bg-primary" />
    </div>
  </FadeIn>
  ```

- [ ] **Step 5: Wrap Featured Projects cards with stagger**

  ```tsx
  {/* Before */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {featured.map((project) => (
      <ProjectCard key={project.slug} project={project} locale={locale as Locale} />
    ))}
  </div>

  {/* After */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {featured.map((project, index) => (
      <FadeIn key={project.slug} delay={Math.min(index * 80, 320)}>
        <ProjectCard project={project} locale={locale as Locale} />
      </FadeIn>
    ))}
  </div>
  ```

  > Remove `key` from `ProjectCard` (it's now on `FadeIn`).

- [ ] **Step 6: Wrap the "View all projects" link**

  ```tsx
  {/* Before */}
  <div className="mt-12 text-center px-6">
    <Link href={...} className="...">
      {t('viewAllProjects')}
    </Link>
  </div>

  {/* After */}
  <FadeIn delay={100}>
    <div className="mt-12 text-center px-6">
      <Link href={...} className="...">
        {t('viewAllProjects')}
      </Link>
    </div>
  </FadeIn>
  ```

- [ ] **Step 7: Wrap About Teaser elements**

  ```tsx
  {/* Before */}
  <div className="mx-auto max-w-4xl px-6 text-center">
    <h2 ...>{t('aboutTitle')}</h2>
    <p ...>{t('aboutTeaser')}</p>
    <Link ...>{t('aboutLink')}</Link>
  </div>

  {/* After */}
  <div className="mx-auto max-w-4xl px-6 text-center">
    <FadeIn>
      <h2 ...>{t('aboutTitle')}</h2>
    </FadeIn>
    <FadeIn delay={100}>
      <p ...>{t('aboutTeaser')}</p>
    </FadeIn>
    <FadeIn delay={200}>
      <Link ...>{t('aboutLink')}</Link>
    </FadeIn>
  </div>
  ```

- [ ] **Step 8: Build check**

  Run: `cd "/c/Site carol/carol-orofino" && npm run build 2>&1 | tail -20`
  Expected: Build succeeds with no errors.

- [ ] **Step 9: Commit**

  ```bash
  cd "/c/Site carol/carol-orofino"
  git add src/app/[locale]/page.tsx
  git commit -m "feat: apply scroll-reveal FadeIn to home page"
  ```

---

### Task 5: Projects listing (`src/app/[locale]/projetos/ProjectsList.tsx`)

**Files:**
- Modify: `src/app/[locale]/projetos/ProjectsList.tsx`

- [ ] **Step 1: Add FadeIn import**

  ```typescript
  import FadeIn from '@/components/FadeIn'
  ```

- [ ] **Step 2: Wrap each ProjectCard with stagger**

  ```tsx
  {/* Before */}
  <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-3">
    {filtered.map((project) => (
      <ProjectCard key={project.slug} project={project} locale={locale} />
    ))}
  </div>

  {/* After */}
  <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-3">
    {filtered.map((project, index) => (
      <FadeIn key={project.slug} delay={Math.min(index * 80, 320)}>
        <ProjectCard project={project} locale={locale} />
      </FadeIn>
    ))}
  </div>
  ```

- [ ] **Step 3: Build check**

  Run: `cd "/c/Site carol/carol-orofino" && npm run build 2>&1 | tail -20`
  Expected: Build succeeds.

- [ ] **Step 4: Commit**

  ```bash
  cd "/c/Site carol/carol-orofino"
  git add src/app/[locale]/projetos/ProjectsList.tsx
  git commit -m "feat: apply scroll-reveal stagger to projects listing"
  ```

---

### Task 6: Project Detail page (`src/app/[locale]/projetos/[slug]/page.tsx`)

**Files:**
- Modify: `src/app/[locale]/projetos/[slug]/page.tsx`

- [ ] **Step 1: Add FadeIn import**

  ```typescript
  import FadeIn from '@/components/FadeIn'
  ```

- [ ] **Step 2: Wrap the page header**

  ```tsx
  {/* Before */}
  <header className="mb-12">
    <p className="font-body text-xs ...">{project.category} · {project.year}</p>
    <h1 className="font-display text-4xl ...">{translation.title}</h1>
    <p className="mt-2 ...">{project.location}</p>
  </header>

  {/* After */}
  <FadeIn>
    <header className="mb-12">
      <p className="font-body text-xs ...">{project.category} · {project.year}</p>
      <h1 className="font-display text-4xl ...">{translation.title}</h1>
      <p className="mt-2 ...">{project.location}</p>
    </header>
  </FadeIn>
  ```

- [ ] **Step 3: Wrap the description paragraph**

  ```tsx
  {/* Before */}
  <div className="max-w-2xl mb-16">
    <p className="font-body text-base ...">{translation.description}</p>
  </div>

  {/* After */}
  <FadeIn delay={100}>
    <div className="max-w-2xl mb-16">
      <p className="font-body text-base ...">{translation.description}</p>
    </div>
  </FadeIn>
  ```

  > Note: The cover image (`<div className="relative aspect-[16/9]...">`) is NOT wrapped — it is a prominent feature image immediately below the fold on entry, and should load immediately.

- [ ] **Step 4: Build check**

  Run: `cd "/c/Site carol/carol-orofino" && npm run build 2>&1 | tail -20`
  Expected: Build succeeds.

- [ ] **Step 5: Commit**

  ```bash
  cd "/c/Site carol/carol-orofino"
  git add "src/app/[locale]/projetos/[slug]/page.tsx"
  git commit -m "feat: apply scroll-reveal to project detail header and description"
  ```

---

### Task 7: Project Gallery (`src/components/ProjectGallery.tsx`)

**Files:**
- Modify: `src/components/ProjectGallery.tsx`

- [ ] **Step 1: Add FadeIn import**

  ```typescript
  import FadeIn from '@/components/FadeIn'
  ```

- [ ] **Step 2: Wrap gallery images with stagger**

  The first image (`first`) has `priority` and is above-the-fold on mobile — do NOT wrap it. Wrap only the `rest` images.

  > **Layout risk:** `FadeIn` renders a `<div>` wrapper around each `aspect-[3/4]` container. Since the inner div has `position: relative` (required by `next/image fill`), the aspect ratio and fill behavior are preserved. However, after the build check (Step 3), verify in the browser that gallery images render at the correct aspect ratio. If the layout breaks, pass `className="contents"` to each `FadeIn` — this sets `display: contents` on the wrapper div, making it invisible to the layout engine while preserving the animation.

  ```tsx
  {/* Before */}
  {rest.length > 0 && (
    <div className="grid grid-cols-2 gap-px">
      {rest.map((image, index) => (
        <div key={index} className="relative aspect-[3/4] overflow-hidden bg-neutral">
          <Image src={image.src} alt={image.altText[locale]} fill ... />
        </div>
      ))}
    </div>
  )}

  {/* After */}
  {rest.length > 0 && (
    <div className="grid grid-cols-2 gap-px">
      {rest.map((image, index) => (
        <FadeIn key={index} delay={Math.min(index * 80, 320)}>
          <div className="relative aspect-[3/4] overflow-hidden bg-neutral">
            <Image src={image.src} alt={image.altText[locale]} fill ... />
          </div>
        </FadeIn>
      ))}
    </div>
  )}
  ```

- [ ] **Step 3: Build check**

  Run: `cd "/c/Site carol/carol-orofino" && npm run build 2>&1 | tail -20`
  Expected: Build succeeds.

- [ ] **Step 4: Commit**

  ```bash
  cd "/c/Site carol/carol-orofino"
  git add src/components/ProjectGallery.tsx
  git commit -m "feat: apply scroll-reveal stagger to project gallery images"
  ```

---

### Task 8: About page (`src/app/[locale]/sobre/page.tsx`)

**Files:**
- Modify: `src/app/[locale]/sobre/page.tsx`

- [ ] **Step 1: Add FadeIn import**

  ```typescript
  import FadeIn from '@/components/FadeIn'
  ```

- [ ] **Step 2: Wrap all content elements**

  ```tsx
  {/* Before */}
  <div className="mx-auto max-w-4xl px-6 py-32">
    <h1 className="font-display text-4xl md:text-5xl text-primary tracking-wide mb-12">
      {t('title')}
    </h1>
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
      <div className="aspect-[3/4] bg-stone" aria-hidden="true" />
      <div className="flex flex-col justify-center gap-8">
        <p className="font-body text-base text-dark leading-relaxed">{t('bio')}</p>
        <div>
          <h2 className="font-display text-2xl text-primary tracking-wide mb-4">
            {t('philosophy')}
          </h2>
          <p className="font-body text-base text-dark leading-relaxed italic">
            {t('philosophyText')}
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* After */}
  <div className="mx-auto max-w-4xl px-6 py-32">
    <FadeIn>
      <h1 className="font-display text-4xl md:text-5xl text-primary tracking-wide mb-12">
        {t('title')}
      </h1>
    </FadeIn>
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
      <FadeIn delay={80}>
        <div className="aspect-[3/4] bg-stone" aria-hidden="true" />
      </FadeIn>
      <div className="flex flex-col justify-center gap-8">
        <FadeIn delay={150}>
          <p className="font-body text-base text-dark leading-relaxed">{t('bio')}</p>
        </FadeIn>
        <FadeIn delay={200}>
          <div>
            <h2 className="font-display text-2xl text-primary tracking-wide mb-4">
              {t('philosophy')}
            </h2>
            <p className="font-body text-base text-dark leading-relaxed italic">
              {t('philosophyText')}
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  </div>
  ```

- [ ] **Step 3: Build check**

  Run: `cd "/c/Site carol/carol-orofino" && npm run build 2>&1 | tail -20`
  Expected: Build succeeds.

- [ ] **Step 4: Commit**

  ```bash
  cd "/c/Site carol/carol-orofino"
  git add "src/app/[locale]/sobre/page.tsx"
  git commit -m "feat: apply scroll-reveal to about page"
  ```

---

### Task 9: Services page (`src/app/[locale]/servicos/page.tsx`)

**Files:**
- Modify: `src/app/[locale]/servicos/page.tsx`

- [ ] **Step 1: Add FadeIn import**

  ```typescript
  import FadeIn from '@/components/FadeIn'
  ```

- [ ] **Step 2: Wrap h1 and each service card**

  ```tsx
  {/* Before */}
  <div className="mx-auto max-w-5xl px-6 py-32">
    <h1 className="font-display text-4xl md:text-5xl text-primary tracking-wide mb-16">
      {t('title')}
    </h1>
    <div className="grid grid-cols-1 gap-px bg-sage md:grid-cols-2">
      {services.map((service) => {
        const translation = service.translations[locale as Locale]
        return (
          <div key={service.id} className="bg-background p-8">
            <h2 ...>{translation.title}</h2>
            <p ...>{translation.description}</p>
          </div>
        )
      })}
    </div>
  </div>

  {/* After */}
  <div className="mx-auto max-w-5xl px-6 py-32">
    <FadeIn>
      <h1 className="font-display text-4xl md:text-5xl text-primary tracking-wide mb-16">
        {t('title')}
      </h1>
    </FadeIn>
    <div className="grid grid-cols-1 gap-px bg-sage md:grid-cols-2">
      {services.map((service, index) => {
        const translation = service.translations[locale as Locale]
        return (
          <FadeIn key={service.id} delay={Math.min(index * 80, 320)}>
            <div className="bg-background p-8">
              <h2 ...>{translation.title}</h2>
              <p ...>{translation.description}</p>
            </div>
          </FadeIn>
        )
      })}
    </div>
  </div>
  ```

  > Move `key` from inner `div` to `FadeIn`.

- [ ] **Step 3: Build check**

  Run: `cd "/c/Site carol/carol-orofino" && npm run build 2>&1 | tail -20`
  Expected: Build succeeds.

- [ ] **Step 4: Commit**

  ```bash
  cd "/c/Site carol/carol-orofino"
  git add "src/app/[locale]/servicos/page.tsx"
  git commit -m "feat: apply scroll-reveal to services page"
  ```

---

### Task 10: Contact page (`src/app/[locale]/contato/page.tsx`)

**Files:**
- Modify: `src/app/[locale]/contato/page.tsx`

- [ ] **Step 1: Add FadeIn import**

  ```typescript
  import FadeIn from '@/components/FadeIn'
  ```

- [ ] **Step 2: Wrap contact blocks**

  The `<AnimatedHero />` already has its own animation — do not wrap it. Wrap the contact link blocks below it:

  ```tsx
  {/* Before */}
  <div className="flex flex-col items-center gap-6 mt-16">
    {/* WhatsApp CTA */}
    <Link href={whatsappUrl} ...>...</Link>
    <p ...>{t('emailLabel')}: <Link ...>carol@carolorofino.com.br</Link></p>
    <p ...>{t('followOn')}: <Link ...>@carolorofino</Link></p>
  </div>

  {/* After */}
  <div className="flex flex-col items-center gap-6 mt-16">
    <FadeIn>
      <Link href={whatsappUrl} ...>...</Link>
    </FadeIn>
    <FadeIn delay={80}>
      <p ...>{t('emailLabel')}: <Link ...>carol@carolorofino.com.br</Link></p>
    </FadeIn>
    <FadeIn delay={160}>
      <p ...>{t('followOn')}: <Link ...>@carolorofino</Link></p>
    </FadeIn>
  </div>
  ```

- [ ] **Step 3: Final build check**

  Run: `cd "/c/Site carol/carol-orofino" && npm run build 2>&1 | tail -20`
  Expected: Build succeeds with no errors.

- [ ] **Step 4: Run full test suite**

  Run: `cd "/c/Site carol/carol-orofino" && npx jest --no-coverage 2>&1`
  Expected: All tests pass.

- [ ] **Step 5: Commit**

  ```bash
  cd "/c/Site carol/carol-orofino"
  git add "src/app/[locale]/contato/page.tsx"
  git commit -m "feat: apply scroll-reveal to contact page"
  ```
