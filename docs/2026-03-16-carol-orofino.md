# Carol Orofino Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a trilingual (PT/EN/ES) static portfolio website for Carol Orofino, interior design professional, with luxury editorial aesthetics.

**Architecture:** Next.js 15 App Router with `[locale]` dynamic segment for i18n via next-intl v3+. All content is static TypeScript data files. All pages use SSG via `generateStaticParams`. Deployed to Vercel (Node.js server, default image optimization).

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, next-intl, Google Fonts (Cormorant Garamond + Inter), Jest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-03-16-carol-orofino-design.md`

---

## File Map

| File | Responsibility |
|------|---------------|
| `src/lib/i18n.ts` | Locale routing config (next-intl) |
| `src/lib/i18n-request.ts` | Server-side message loader (next-intl) |
| `middleware.ts` | Locale detection + redirect middleware |
| `src/data/projects.ts` | Static project data + types |
| `src/data/services.ts` | Static services data + types |
| `src/messages/pt.json` | Portuguese UI strings |
| `src/messages/en.json` | English UI strings |
| `src/messages/es.json` | Spanish UI strings |
| `src/app/[locale]/layout.tsx` | Root layout with NextIntlClientProvider |
| `src/app/[locale]/page.tsx` | Home page |
| `src/app/[locale]/projetos/page.tsx` | Projects listing page |
| `src/app/[locale]/projetos/[slug]/page.tsx` | Project detail page |
| `src/app/[locale]/sobre/page.tsx` | About page |
| `src/app/[locale]/servicos/page.tsx` | Services page |
| `src/app/[locale]/contato/page.tsx` | Contact page |
| `src/app/[locale]/not-found.tsx` | 404 page |
| `src/app/sitemap.ts` | Generates sitemap.xml |
| `src/app/robots.ts` | Generates robots.txt |
| `src/components/Navbar.tsx` | Global nav — desktop + mobile drawer + scroll behavior |
| `src/components/Footer.tsx` | Global footer |
| `src/components/WhatsAppButton.tsx` | Fixed floating WhatsApp button |
| `src/components/ProjectCard.tsx` | Project card (image + name + category) |
| `src/components/ProjectGallery.tsx` | Photo grid for project detail |
| `src/components/CategoryFilter.tsx` | `'use client'` filter bar |
| `next.config.ts` | Next.js config with next-intl plugin |
| `tailwind.config.ts` | Custom theme (colors, fonts) |
| `.env.local.example` | Environment variable template |

---

## Chunk 1: Project Setup & Configuration

### Task 1: Scaffold Next.js 15 project

**Files:**
- Create: `carol-orofino/` (project root)

- [ ] **Step 1: Create Next.js project**

Run inside `C:\Site Carol`:
```bash
npx create-next-app@latest carol-orofino \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack
```
Expected: project scaffolded, `npm run dev` starts without errors.

- [ ] **Step 2: Install additional dependencies**

```bash
cd carol-orofino
npm install next-intl
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom
```

- [ ] **Step 3: Install Google Fonts (via next/font)**

No install needed — `next/font/google` is built-in. Verify by checking `next` is in `package.json`.

- [ ] **Step 4: Create `.env.local.example`**

```bash
# .env.local.example
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

- [ ] **Step 5: Create `.env.local` from example**

```bash
cp .env.local.example .env.local
# Edit .env.local and set the real WhatsApp number
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```
Expected: server starts on `http://localhost:3000` with no errors.

- [ ] **Step 7: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js 15 project with TypeScript + Tailwind"
```

---

### Task 2: Configure next-intl

**Files:**
- Create: `src/lib/i18n.ts`
- Create: `src/lib/i18n-request.ts`
- Modify: `middleware.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: Create routing config**

```typescript
// src/lib/i18n.ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['pt', 'en', 'es'] as const,
  defaultLocale: 'pt',
})

export type Locale = (typeof routing.locales)[number]
```

- [ ] **Step 2: Create server-side message loader**

```typescript
// src/lib/i18n-request.ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './i18n'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

- [ ] **Step 3: Configure middleware**

Replace contents of `middleware.ts` at the project root:
```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './src/lib/i18n'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
}
```

- [ ] **Step 4: Update next.config.ts**

```typescript
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/lib/i18n-request.ts')

const nextConfig = {}

export default withNextIntl(nextConfig)
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/i18n.ts src/lib/i18n-request.ts middleware.ts next.config.ts
git commit -m "feat: configure next-intl for PT/EN/ES i18n"
```

---

### Task 3: Configure Tailwind theme + global styles

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Set up custom Tailwind theme**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF9F7',
        'text-primary': '#1A1A1A',
        primary: '#8B7355',
        secondary: '#B8C4BB',
        neutral: '#D4CFC8',
        dark: '#2C2C2C',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        logo: '0.2em',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Update globals.css**

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply bg-background text-text-primary font-body;
    scroll-behavior: smooth;
  }

  body {
    @apply antialiased;
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
```

- [ ] **Step 3: Verify Tailwind classes resolve**

```bash
npm run build
```
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts src/app/globals.css
git commit -m "feat: configure Tailwind theme with brand colors and fonts"
```

---

### Task 4: Set up Jest + React Testing Library

**Files:**
- Create: `jest.config.ts`
- Create: `jest.setup.ts`

- [ ] **Step 1: Create Jest config**

```typescript
// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
```

- [ ] **Step 2: Create Jest setup file**

```typescript
// jest.setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 3: Add test script to package.json**

In `package.json`, under `"scripts"`, add:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 4: Run tests (empty suite should pass)**

```bash
npm test -- --passWithNoTests
```
Expected: "Test Suites: 0 passed" or similar.

- [ ] **Step 5: Commit**

```bash
git add jest.config.ts jest.setup.ts package.json
git commit -m "chore: set up Jest + React Testing Library"
```

---

## Chunk 2: Data Layer & i18n Messages

### Task 5: Create project data types and sample data

**Files:**
- Create: `src/data/projects.ts`

- [ ] **Step 1: Write the test**

```typescript
// src/data/__tests__/projects.test.ts
import { projects, getFeaturedProjects, getProjectBySlug } from '../projects'

describe('projects data', () => {
  it('should export an array of projects', () => {
    expect(Array.isArray(projects)).toBe(true)
    expect(projects.length).toBeGreaterThan(0)
  })

  it('each project should have required fields', () => {
    projects.forEach((p) => {
      expect(p.slug).toBeTruthy()
      expect(p.category).toMatch(/^(residencial|comercial|reforma|design-de-interiores)$/)
      expect(typeof p.year).toBe('number')
      expect(p.coverImage).toBeTruthy()
      expect(p.translations.pt.title).toBeTruthy()
      expect(p.translations.en.title).toBeTruthy()
      expect(p.translations.es.title).toBeTruthy()
    })
  })

  it('getFeaturedProjects should return only featured projects', () => {
    const featured = getFeaturedProjects()
    featured.forEach((p) => expect(p.featured).toBe(true))
  })

  it('getProjectBySlug should return correct project or null', () => {
    const first = projects[0]
    expect(getProjectBySlug(first.slug)).toEqual(first)
    expect(getProjectBySlug('nonexistent-slug')).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- src/data/__tests__/projects.test.ts
```
Expected: FAIL — "Cannot find module '../projects'"

- [ ] **Step 3: Create projects.ts**

```typescript
// src/data/projects.ts

export interface ProjectImage {
  src: string
  altText: {
    pt: string
    en: string
    es: string
  }
}

export interface Project {
  slug: string
  category: 'residencial' | 'comercial' | 'reforma' | 'design-de-interiores'
  year: number
  location: string
  coverImage: string
  coverImageAlt: {
    pt: string
    en: string
    es: string
  }
  coverImageBlurDataURL: string
  images: ProjectImage[]
  featured: boolean
  translations: {
    pt: { title: string; description: string }
    en: { title: string; description: string }
    es: { title: string; description: string }
  }
}

// Minimal base64 blur placeholder (1x1 beige pixel)
const BLUR_PLACEHOLDER =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoH' +
  'BwYIDAoMCwsKCwsNCxAQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/wAAR' +
  'CAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAA' +
  'AAAAAAAAAAAAAAAAP/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAA' +
  'AAAAAAAAAAD/2gAMAwEAAhEDEQA/AJIAP//Z'

export const projects: Project[] = [
  {
    slug: 'apartamento-jardins',
    category: 'residencial',
    year: 2024,
    location: 'São Paulo, SP',
    coverImage: '/images/projects/apartamento-jardins/cover.jpg',
    coverImageAlt: {
      pt: 'Sala de estar com sofá bege e detalhes em madeira natural',
      en: 'Living room with beige sofa and natural wood details',
      es: 'Sala de estar con sofá beige y detalles en madera natural',
    },
    coverImageBlurDataURL: BLUR_PLACEHOLDER,
    images: [
      {
        src: '/images/projects/apartamento-jardins/01.jpg',
        altText: {
          pt: 'Vista da sala de jantar integrada',
          en: 'Integrated dining room view',
          es: 'Vista del comedor integrado',
        },
      },
    ],
    featured: true,
    translations: {
      pt: {
        title: 'Apartamento Jardins',
        description:
          'Projeto residencial que une sofisticação escandinava com elementos brasileiros, criando um ambiente acolhedor e atemporal.',
      },
      en: {
        title: 'Jardins Apartment',
        description:
          'Residential project uniting Scandinavian sophistication with Brazilian elements, creating a welcoming and timeless space.',
      },
      es: {
        title: 'Apartamento Jardins',
        description:
          'Proyecto residencial que une sofisticación escandinava con elementos brasileños, creando un ambiente acogedor y atemporal.',
      },
    },
  },
  {
    slug: 'escritorio-itaim',
    category: 'comercial',
    year: 2023,
    location: 'São Paulo, SP',
    coverImage: '/images/projects/escritorio-itaim/cover.jpg',
    coverImageAlt: {
      pt: 'Escritório moderno com iluminação natural e móveis minimalistas',
      en: 'Modern office with natural lighting and minimalist furniture',
      es: 'Oficina moderna con iluminación natural y muebles minimalistas',
    },
    coverImageBlurDataURL: BLUR_PLACEHOLDER,
    images: [
      {
        src: '/images/projects/escritorio-itaim/01.jpg',
        altText: {
          pt: 'Área de reuniões com mesa de vidro',
          en: 'Meeting area with glass table',
          es: 'Área de reuniones con mesa de vidrio',
        },
      },
    ],
    featured: true,
    translations: {
      pt: {
        title: 'Escritório Itaim',
        description:
          'Projeto comercial focado em produtividade e bem-estar, com materiais nobres e paleta neutra.',
      },
      en: {
        title: 'Itaim Office',
        description:
          'Commercial project focused on productivity and well-being, with noble materials and a neutral palette.',
      },
      es: {
        title: 'Oficina Itaim',
        description:
          'Proyecto comercial enfocado en productividad y bienestar, con materiales nobles y paleta neutra.',
      },
    },
  },
  {
    slug: 'casa-higienopolis',
    category: 'reforma',
    year: 2024,
    location: 'São Paulo, SP',
    coverImage: '/images/projects/casa-higienopolis/cover.jpg',
    coverImageAlt: {
      pt: 'Casa reformada com fachada renovada e jardim frontal',
      en: 'Renovated house with updated facade and front garden',
      es: 'Casa reformada con fachada renovada y jardín frontal',
    },
    coverImageBlurDataURL: BLUR_PLACEHOLDER,
    images: [],
    featured: true,
    translations: {
      pt: {
        title: 'Casa Higienópolis',
        description:
          'Reforma completa de residência dos anos 1960, respeitando a arquitetura original e incorporando conforto contemporâneo.',
      },
      en: {
        title: 'Higienópolis House',
        description:
          "Complete renovation of a 1960s residence, respecting the original architecture while incorporating contemporary comfort.",
      },
      es: {
        title: 'Casa Higienópolis',
        description:
          'Reforma completa de residencia de los años 1960, respetando la arquitectura original e incorporando comodidad contemporánea.',
      },
    },
  },
]

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured)
}

export function getProjectBySlug(slug: string): Project | null {
  return projects.find((p) => p.slug === slug) ?? null
}

export function getAllSlugs(): string[] {
  return projects.map((p) => p.slug)
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- src/data/__tests__/projects.test.ts
```
Expected: PASS — 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/data/projects.ts src/data/__tests__/projects.test.ts
git commit -m "feat: add project data model and sample projects"
```

---

### Task 6: Create services data

**Files:**
- Create: `src/data/services.ts`

- [ ] **Step 1: Write the test**

```typescript
// src/data/__tests__/services.test.ts
import { services } from '../services'

describe('services data', () => {
  it('should export an array of services', () => {
    expect(Array.isArray(services)).toBe(true)
    expect(services.length).toBeGreaterThan(0)
  })

  it('each service should have required translated fields', () => {
    services.forEach((s) => {
      expect(s.id).toBeTruthy()
      expect(s.translations.pt.title).toBeTruthy()
      expect(s.translations.en.title).toBeTruthy()
      expect(s.translations.es.title).toBeTruthy()
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- src/data/__tests__/services.test.ts
```
Expected: FAIL

- [ ] **Step 3: Create services.ts**

```typescript
// src/data/services.ts

export interface Service {
  id: string
  icon?: string
  translations: {
    pt: { title: string; description: string }
    en: { title: string; description: string }
    es: { title: string; description: string }
  }
}

export const services: Service[] = [
  {
    id: 'projeto-residencial',
    translations: {
      pt: {
        title: 'Projeto Residencial',
        description:
          'Criação de ambientes residenciais personalizados, do conceito ao acabamento final.',
      },
      en: {
        title: 'Residential Design',
        description:
          'Creation of personalized residential spaces, from concept to final finish.',
      },
      es: {
        title: 'Proyecto Residencial',
        description:
          'Creación de ambientes residenciales personalizados, del concepto al acabado final.',
      },
    },
  },
  {
    id: 'projeto-comercial',
    translations: {
      pt: {
        title: 'Projeto Comercial',
        description:
          'Design de interiores para escritórios, lojas e espaços corporativos que refletem a identidade da sua marca.',
      },
      en: {
        title: 'Commercial Design',
        description:
          'Interior design for offices, stores, and corporate spaces that reflect your brand identity.',
      },
      es: {
        title: 'Proyecto Comercial',
        description:
          'Diseño de interiores para oficinas, tiendas y espacios corporativos que reflejan la identidad de su marca.',
      },
    },
  },
  {
    id: 'reforma',
    translations: {
      pt: {
        title: 'Reforma e Renovação',
        description:
          'Transformação de espaços existentes com planejamento estratégico e execução cuidadosa.',
      },
      en: {
        title: 'Renovation',
        description:
          'Transformation of existing spaces with strategic planning and careful execution.',
      },
      es: {
        title: 'Reforma y Renovación',
        description:
          'Transformación de espacios existentes con planificación estratégica y ejecución cuidadosa.',
      },
    },
  },
  {
    id: 'design-de-interiores',
    translations: {
      pt: {
        title: 'Design de Interiores',
        description:
          'Orientação especializada para escolha de materiais, móveis, cores e decoração.',
      },
      en: {
        title: 'Interior Design',
        description:
          'Expert guidance for the selection of materials, furniture, colors, and decor.',
      },
      es: {
        title: 'Diseño de Interiores',
        description:
          'Orientación especializada para la elección de materiales, muebles, colores y decoración.',
      },
    },
  },
]
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- src/data/__tests__/services.test.ts
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/data/services.ts src/data/__tests__/services.test.ts
git commit -m "feat: add services data model and sample services"
```

---

### Task 7: Create i18n message files

**Files:**
- Create: `src/messages/pt.json`
- Create: `src/messages/en.json`
- Create: `src/messages/es.json`

- [ ] **Step 1: Create pt.json**

```json
{
  "nav": {
    "projects": "Projetos",
    "about": "Sobre",
    "services": "Serviços",
    "contact": "Contato"
  },
  "home": {
    "tagline": "Design de Interiores que transforma espaços em experiências",
    "viewAllProjects": "Ver todos os projetos",
    "aboutTitle": "Carol Orofino",
    "aboutTeaser": "Acredito que cada espaço conta uma história. Com mais de 10 anos de experiência, crio ambientes que unem funcionalidade, beleza e identidade.",
    "aboutLink": "Conheça mais"
  },
  "projects": {
    "title": "Projetos",
    "filter": {
      "all": "Todos",
      "residencial": "Residencial",
      "comercial": "Comercial",
      "reforma": "Reforma",
      "design-de-interiores": "Design de Interiores"
    }
  },
  "project": {
    "location": "Localização",
    "year": "Ano",
    "category": "Categoria",
    "whatsappCta": "Quero um projeto assim",
    "whatsappMessage": "Olá Carol, me interessei pelo projeto {title} e gostaria de saber mais."
  },
  "about": {
    "title": "Sobre Carol Orofino",
    "bio": "Carol Orofino é designer de interiores formada pela Universidade Mackenzie, com especialização em Design Sustentável. Ao longo de mais de 10 anos de carreira, desenvolveu projetos residenciais e comerciais que traduzem a personalidade dos clientes em espaços únicos e funcionais.",
    "philosophy": "Filosofia de Design",
    "philosophyText": "Acredito que o design de interiores vai além da estética. É sobre criar espaços que transformam a experiência de quem vive neles — espaços que inspiram, acolhem e duram."
  },
  "services": {
    "title": "Serviços"
  },
  "contact": {
    "title": "Contato",
    "whatsappLabel": "Fale pelo WhatsApp",
    "whatsappMessage": "Olá Carol, gostaria de saber mais sobre seus serviços.",
    "emailLabel": "E-mail",
    "instagramLabel": "Instagram",
    "followOn": "Siga no Instagram"
  },
  "footer": {
    "rights": "Todos os direitos reservados."
  },
  "notFound": {
    "title": "Página não encontrada",
    "description": "A página que você procura não existe.",
    "back": "Voltar ao início"
  }
}
```

- [ ] **Step 2: Create en.json**

```json
{
  "nav": {
    "projects": "Projects",
    "about": "About",
    "services": "Services",
    "contact": "Contact"
  },
  "home": {
    "tagline": "Interior Design that transforms spaces into experiences",
    "viewAllProjects": "View all projects",
    "aboutTitle": "Carol Orofino",
    "aboutTeaser": "I believe every space tells a story. With over 10 years of experience, I create environments that unite functionality, beauty, and identity.",
    "aboutLink": "Learn more"
  },
  "projects": {
    "title": "Projects",
    "filter": {
      "all": "All",
      "residencial": "Residential",
      "comercial": "Commercial",
      "reforma": "Renovation",
      "design-de-interiores": "Interior Design"
    }
  },
  "project": {
    "location": "Location",
    "year": "Year",
    "category": "Category",
    "whatsappCta": "I want a project like this",
    "whatsappMessage": "Hello Carol, I'm interested in the {title} project and would like to know more."
  },
  "about": {
    "title": "About Carol Orofino",
    "bio": "Carol Orofino is an interior designer graduated from Mackenzie University, with a specialization in Sustainable Design. Over more than 10 years of career, she has developed residential and commercial projects that translate the personality of her clients into unique and functional spaces.",
    "philosophy": "Design Philosophy",
    "philosophyText": "I believe interior design goes beyond aesthetics. It's about creating spaces that transform the experience of those who live in them — spaces that inspire, welcome, and endure."
  },
  "services": {
    "title": "Services"
  },
  "contact": {
    "title": "Contact",
    "whatsappLabel": "Chat on WhatsApp",
    "whatsappMessage": "Hello Carol, I'd like to know more about your services.",
    "emailLabel": "Email",
    "instagramLabel": "Instagram",
    "followOn": "Follow on Instagram"
  },
  "footer": {
    "rights": "All rights reserved."
  },
  "notFound": {
    "title": "Page not found",
    "description": "The page you are looking for does not exist.",
    "back": "Back to home"
  }
}
```

- [ ] **Step 3: Create es.json**

```json
{
  "nav": {
    "projects": "Proyectos",
    "about": "Sobre mí",
    "services": "Servicios",
    "contact": "Contacto"
  },
  "home": {
    "tagline": "Diseño de Interiores que transforma espacios en experiencias",
    "viewAllProjects": "Ver todos los proyectos",
    "aboutTitle": "Carol Orofino",
    "aboutTeaser": "Creo que cada espacio cuenta una historia. Con más de 10 años de experiencia, creo ambientes que unen funcionalidad, belleza e identidad.",
    "aboutLink": "Conocer más"
  },
  "projects": {
    "title": "Proyectos",
    "filter": {
      "all": "Todos",
      "residencial": "Residencial",
      "comercial": "Comercial",
      "reforma": "Reforma",
      "design-de-interiores": "Diseño de Interiores"
    }
  },
  "project": {
    "location": "Ubicación",
    "year": "Año",
    "category": "Categoría",
    "whatsappCta": "Quiero un proyecto así",
    "whatsappMessage": "Hola Carol, me interesó el proyecto {title} y me gustaría saber más."
  },
  "about": {
    "title": "Sobre Carol Orofino",
    "bio": "Carol Orofino es diseñadora de interiores graduada por la Universidad Mackenzie, con especialización en Diseño Sostenible. A lo largo de más de 10 años de carrera, ha desarrollado proyectos residenciales y comerciales que traducen la personalidad de sus clientes en espacios únicos y funcionales.",
    "philosophy": "Filosofía de Diseño",
    "philosophyText": "Creo que el diseño de interiores va más allá de la estética. Se trata de crear espacios que transformen la experiencia de quienes los habitan — espacios que inspiran, acogen y perduran."
  },
  "services": {
    "title": "Servicios"
  },
  "contact": {
    "title": "Contacto",
    "whatsappLabel": "Hablar por WhatsApp",
    "whatsappMessage": "Hola Carol, me gustaría saber más sobre sus servicios.",
    "emailLabel": "Correo electrónico",
    "instagramLabel": "Instagram",
    "followOn": "Seguir en Instagram"
  },
  "footer": {
    "rights": "Todos los derechos reservados."
  },
  "notFound": {
    "title": "Página no encontrada",
    "description": "La página que buscas no existe.",
    "back": "Volver al inicio"
  }
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/messages/
git commit -m "feat: add trilingual i18n messages (PT/EN/ES)"
```

---

## Chunk 3: Core Layout Components

### Task 8: WhatsAppButton component

**Files:**
- Create: `src/components/WhatsAppButton.tsx`
- Create: `src/components/__tests__/WhatsAppButton.test.tsx`

- [ ] **Step 1: Write the test**

```typescript
// src/components/__tests__/WhatsAppButton.test.tsx
import { render, screen } from '@testing-library/react'
import WhatsAppButton from '../WhatsAppButton'

// next-intl mock
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

describe('WhatsAppButton', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv, NEXT_PUBLIC_WHATSAPP_NUMBER: '5511999999999' }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('renders a link with correct WhatsApp URL', () => {
    render(<WhatsAppButton message="Test message" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining('wa.me/5511999999999')
    )
  })

  it('opens in a new tab', () => {
    render(<WhatsAppButton message="Test" />)
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- src/components/__tests__/WhatsAppButton.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Create WhatsAppButton component**

```typescript
// src/components/WhatsAppButton.tsx
import Link from 'next/link'

interface WhatsAppButtonProps {
  message: string
  label?: string
  variant?: 'floating' | 'inline'
  className?: string
}

export default function WhatsAppButton({
  message,
  label,
  variant = 'floating',
  className = '',
}: WhatsAppButtonProps) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`

  if (variant === 'floating') {
    return (
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir WhatsApp"
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 ${className}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </Link>
    )
  }

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-none border border-text-primary px-6 py-3 text-sm font-body uppercase tracking-widest text-text-primary transition-colors hover:bg-text-primary hover:text-background focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-2 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      {label}
    </Link>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- src/components/__tests__/WhatsAppButton.test.tsx
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/WhatsAppButton.tsx src/components/__tests__/WhatsAppButton.test.tsx
git commit -m "feat: add WhatsAppButton component (floating + inline variants)"
```

---

### Task 9: Navbar component

**Files:**
- Create: `src/components/Navbar.tsx`

- [ ] **Step 1: Create Navbar component**

The Navbar is a client component (needs scroll detection + mobile drawer state + usePathname).

```typescript
// src/components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { routing, type Locale } from '@/lib/i18n'

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
]

interface NavbarProps {
  transparent?: boolean
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const t = useTranslations('nav')
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (!transparent) return
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [transparent])

  const isTransparentMode = transparent && !scrolled

  const navLinks = [
    { href: `/${locale}/projetos`, label: t('projects') },
    { href: `/${locale}/sobre`, label: t('about') },
    { href: `/${locale}/servicos`, label: t('services') },
    { href: `/${locale}/contato`, label: t('contact') },
  ]

  function switchLocale(newLocale: Locale) {
    // Replace the locale prefix in the current path
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
    setDrawerOpen(false)
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const whatsappUrl = `https://wa.me/${whatsappNumber}`

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isTransparentMode
            ? 'bg-transparent'
            : 'bg-background border-b border-neutral'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center px-6 py-4">
          {/* Desktop: nav links left */}
          <div className="hidden flex-1 items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-xs uppercase tracking-widest transition-colors hover:text-primary ${
                  isTransparentMode ? 'text-white' : 'text-text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Center: brand name */}
          <div className="flex-1 text-center md:flex-none">
            <Link
              href={`/${locale}`}
              className={`font-display text-xl tracking-logo transition-colors hover:text-primary ${
                isTransparentMode ? 'text-white' : 'text-text-primary'
              }`}
            >
              Carol Orofino
            </Link>
          </div>

          {/* Desktop: language selector + WhatsApp icon right */}
          <div className="hidden flex-1 items-center justify-end gap-4 md:flex">
            <div className="flex items-center gap-1">
              {LOCALES.map((loc, i) => (
                <span key={loc.code} className="flex items-center">
                  <button
                    onClick={() => switchLocale(loc.code)}
                    className={`font-body text-xs uppercase tracking-widest transition-colors hover:text-primary ${
                      locale === loc.code
                        ? isTransparentMode
                          ? 'text-white font-semibold'
                          : 'text-text-primary font-semibold'
                        : isTransparentMode
                        ? 'text-white/70'
                        : 'text-text-primary/50'
                    }`}
                    aria-label={`Switch to ${loc.label}`}
                  >
                    {loc.label}
                  </button>
                  {i < LOCALES.length - 1 && (
                    <span
                      className={`mx-1 text-xs ${
                        isTransparentMode ? 'text-white/30' : 'text-neutral'
                      }`}
                    >
                      /
                    </span>
                  )}
                </span>
              ))}
            </div>
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className={`transition-colors hover:text-primary ${
                isTransparentMode ? 'text-white' : 'text-text-primary'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </Link>
          </div>

          {/* Mobile: hamburger button */}
          <div className="flex flex-1 justify-end md:hidden">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menu"
              className={`p-2 transition-colors ${
                isTransparentMode ? 'text-white' : 'text-text-primary'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-72 bg-background shadow-xl transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!drawerOpen}
      >
        <div className="flex h-full flex-col px-6 py-6">
          <div className="flex justify-end">
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Fechar menu"
              className="p-2 text-text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="mt-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                className="font-body text-sm uppercase tracking-widest text-text-primary transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex items-center gap-2 pb-4">
            {LOCALES.map((loc, i) => (
              <span key={loc.code} className="flex items-center">
                <button
                  onClick={() => switchLocale(loc.code)}
                  className={`font-body text-xs uppercase tracking-widest ${
                    locale === loc.code
                      ? 'font-semibold text-text-primary'
                      : 'text-text-primary/50'
                  }`}
                >
                  {loc.label}
                </button>
                {i < LOCALES.length - 1 && (
                  <span className="mx-1 text-xs text-neutral">/</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: add Navbar component with mobile drawer and scroll transparency"
```

---

### Task 10: Footer component

**Files:**
- Create: `src/components/Footer.tsx`

- [ ] **Step 1: Create Footer**

```typescript
// src/components/Footer.tsx
'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { routing, type Locale } from '@/lib/i18n'

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
]

export default function Footer() {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const year = new Date().getFullYear()

  return (
    <footer className="bg-dark text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="font-display text-2xl tracking-logo text-white">
              Carol Orofino
            </p>
            <p className="mt-2 font-body text-xs uppercase tracking-widest text-white/50">
              Design de Interiores
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-3">
            <Link
              href={`/${locale}/projetos`}
              className="font-body text-xs uppercase tracking-widest text-white/70 transition-colors hover:text-white"
            >
              {t('nav.projects')}
            </Link>
            <Link
              href={`/${locale}/sobre`}
              className="font-body text-xs uppercase tracking-widest text-white/70 transition-colors hover:text-white"
            >
              {t('nav.about')}
            </Link>
            <Link
              href={`/${locale}/servicos`}
              className="font-body text-xs uppercase tracking-widest text-white/70 transition-colors hover:text-white"
            >
              {t('nav.services')}
            </Link>
            <Link
              href={`/${locale}/contato`}
              className="font-body text-xs uppercase tracking-widest text-white/70 transition-colors hover:text-white"
            >
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Language + Social */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              {LOCALES.map((loc, i) => (
                <span key={loc.code} className="flex items-center">
                  <Link
                    href={`/${loc.code}`}
                    className={`font-body text-xs uppercase tracking-widest transition-colors hover:text-white ${
                      locale === loc.code ? 'text-white' : 'text-white/50'
                    }`}
                  >
                    {loc.label}
                  </Link>
                  {i < LOCALES.length - 1 && (
                    <span className="mx-1 text-xs text-white/20">/</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center">
          <p className="font-body text-xs text-white/30">
            © {year} Carol Orofino. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: add Footer component with nav links and language switcher"
```

---

### Task 11: Root layout

**Files:**
- Create: `src/app/[locale]/layout.tsx`
- Delete: `src/app/layout.tsx` (replaced by locale layout)
- Delete: `src/app/page.tsx` (will be replaced)

- [ ] **Step 1: Create locale layout**

```typescript
// src/app/[locale]/layout.tsx
import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/lib/i18n'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import '@/app/globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Carol Orofino — Design de Interiores',
  description: 'Design de Interiores que transforma espaços em experiências.',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  const messages = await getMessages()
  const t = await getTranslations({ locale, namespace: 'contact' })

  return (
    <html lang={locale} className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-background">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="fade-in">{children}</main>
          <Footer />
          <WhatsAppButton message={t('whatsappMessage')} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Remove old root layout/page if they exist**

```bash
rm -f src/app/layout.tsx src/app/page.tsx
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: build succeeds (may warn about missing pages — that's OK for now).

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/layout.tsx
git commit -m "feat: add locale root layout with fonts, providers, and global components"
```

---

## Chunk 4: Pages

### Task 12: ProjectCard component

**Files:**
- Create: `src/components/ProjectCard.tsx`
- Create: `src/components/__tests__/ProjectCard.test.tsx`

- [ ] **Step 1: Write the test**

```typescript
// src/components/__tests__/ProjectCard.test.tsx
import { render, screen } from '@testing-library/react'
import ProjectCard from '../ProjectCard'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={props.alt} src={props.src} />
  ),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockProject = {
  slug: 'test-project',
  category: 'residencial' as const,
  year: 2024,
  location: 'São Paulo, SP',
  coverImage: '/images/test.jpg',
  coverImageAlt: { pt: 'Imagem de teste', en: 'Test image', es: 'Imagen de prueba' },
  coverImageBlurDataURL: 'data:image/jpeg;base64,abc',
  images: [],
  featured: false,
  translations: {
    pt: { title: 'Projeto Teste', description: 'Descrição' },
    en: { title: 'Test Project', description: 'Description' },
    es: { title: 'Proyecto Prueba', description: 'Descripción' },
  },
}

describe('ProjectCard', () => {
  it('renders project title', () => {
    render(<ProjectCard project={mockProject} locale="pt" />)
    expect(screen.getByText('Projeto Teste')).toBeInTheDocument()
  })

  it('renders link to project detail', () => {
    render(<ProjectCard project={mockProject} locale="pt" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/pt/projetos/test-project')
  })

  it('renders cover image with correct alt text', () => {
    render(<ProjectCard project={mockProject} locale="pt" />)
    expect(screen.getByAltText('Imagem de teste')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- src/components/__tests__/ProjectCard.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Create ProjectCard component**

```typescript
// src/components/ProjectCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { type Project } from '@/data/projects'
import { type Locale } from '@/lib/i18n'

interface ProjectCardProps {
  project: Project
  locale: Locale
}

export default function ProjectCard({ project, locale }: ProjectCardProps) {
  const title = project.translations[locale].title
  const altText = project.coverImageAlt[locale]
  const href = `/${locale}/projetos/${project.slug}`

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-square overflow-hidden bg-neutral">
        <Image
          src={project.coverImage}
          alt={altText}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          placeholder="blur"
          blurDataURL={project.coverImageBlurDataURL}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/35 flex items-end p-4 opacity-0 group-hover:opacity-100">
          <p className="font-display text-lg text-white">{title}</p>
        </div>
      </div>
      <div className="mt-3">
        <p className="font-body text-sm text-text-primary">{title}</p>
        <p className="font-body text-xs uppercase tracking-widest text-text-primary/50 mt-1">
          {project.category}
        </p>
      </div>
    </Link>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- src/components/__tests__/ProjectCard.test.tsx
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ProjectCard.tsx src/components/__tests__/ProjectCard.test.tsx
git commit -m "feat: add ProjectCard component"
```

---

### Task 13: CategoryFilter component

**Files:**
- Create: `src/components/CategoryFilter.tsx`

- [ ] **Step 1: Create CategoryFilter**

```typescript
// src/components/CategoryFilter.tsx
'use client'

import { useTranslations } from 'next-intl'
import { type Project } from '@/data/projects'

type Category = Project['category'] | 'all'

interface CategoryFilterProps {
  active: Category
  onChange: (category: Category) => void
}

const CATEGORIES: Category[] = ['all', 'residencial', 'comercial', 'reforma', 'design-de-interiores']

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  const t = useTranslations('projects.filter')

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`font-body text-xs uppercase tracking-widest px-4 py-2 border transition-colors ${
            active === cat
              ? 'border-text-primary bg-text-primary text-background'
              : 'border-neutral text-text-primary/60 hover:border-text-primary hover:text-text-primary'
          }`}
          aria-pressed={active === cat}
        >
          {t(cat)}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/CategoryFilter.tsx
git commit -m "feat: add CategoryFilter client component"
```

---

### Task 14: ProjectGallery component

**Files:**
- Create: `src/components/ProjectGallery.tsx`

- [ ] **Step 1: Create ProjectGallery**

```typescript
// src/components/ProjectGallery.tsx
import Image from 'next/image'
import { type ProjectImage } from '@/data/projects'
import { type Locale } from '@/lib/i18n'

interface ProjectGalleryProps {
  images: ProjectImage[]
  locale: Locale
}

export default function ProjectGallery({ images, locale }: ProjectGalleryProps) {
  if (images.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {images.map((image, index) => (
        <div key={index} className="relative aspect-[4/3] overflow-hidden bg-neutral">
          <Image
            src={image.src}
            alt={image.altText[locale]}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProjectGallery.tsx
git commit -m "feat: add ProjectGallery component"
```

---

### Task 15: Home page

**Files:**
- Create: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Create Home page**

Note: The Navbar on the Home page needs `transparent={true}` to enable hero scroll behavior. Pass this via a prop. The root layout renders `<Navbar />` without transparent — we need to override per page. Solution: render Navbar inside the page rather than in layout for the transparent variant. Alternative: use a layout slot or context. Simplest: remove Navbar from layout, render it in each page individually. However, that's repetitive.

Better approach: Use a client wrapper that reads the current pathname and passes `transparent` only on the home page. Create a `NavbarWrapper` component.

- [ ] **Step 2: Create NavbarWrapper component**

```typescript
// src/components/NavbarWrapper.tsx
'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function NavbarWrapper() {
  const pathname = usePathname()
  // Transparent on home page (e.g., /pt, /en, /es)
  const isHome = /^\/[a-z]{2}\/?$/.test(pathname)
  return <Navbar transparent={isHome} />
}
```

- [ ] **Step 3: Wire NavbarWrapper into layout**

In `src/app/[locale]/layout.tsx`, replace:
```typescript
import Navbar from '@/components/Navbar'
// ...
<Navbar />
```
With:
```typescript
import NavbarWrapper from '@/components/NavbarWrapper'
// ...
<NavbarWrapper />
```

- [ ] **Step 4: Create Home page**

```typescript
// src/app/[locale]/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getFeaturedProjects } from '@/data/projects'
import ProjectCard from '@/components/ProjectCard'
import { type Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://carolorofino.com.br'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return {
    title: 'Carol Orofino — Design de Interiores',
    description: t('tagline'),
    openGraph: {
      images: [{ url: `${BASE_URL}/og-default.jpg`, width: 1200, height: 630 }],
    },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const featured = getFeaturedProjects()
  const t = await getTranslations({ locale, namespace: 'home' })

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen w-full">
        {featured[0] && (
          <Image
            src={featured[0].coverImage}
            alt={featured[0].coverImageAlt[locale as Locale]}
            fill
            priority
            className="object-cover"
            placeholder="blur"
            blurDataURL={featured[0].coverImageBlurDataURL}
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <h1 className="font-display text-5xl md:text-7xl tracking-logo text-white">
            Carol Orofino
          </h1>
          <p className="mt-4 font-body text-sm md:text-base uppercase tracking-widest text-white/80 max-w-xl">
            {t('tagline')}
          </p>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              locale={locale as Locale}
            />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/projetos`}
            className="font-body text-xs uppercase tracking-widest border border-text-primary px-8 py-3 text-text-primary transition-colors hover:bg-text-primary hover:text-background"
          >
            {t('viewAllProjects')}
          </Link>
        </div>
      </section>

      {/* About Teaser */}
      <section className="bg-neutral/20 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-primary tracking-wide">
            {t('aboutTitle')}
          </h2>
          <p className="mt-6 font-body text-base text-text-primary/70 leading-relaxed max-w-2xl mx-auto">
            {t('aboutTeaser')}
          </p>
          <Link
            href={`/${locale}/sobre`}
            className="mt-8 inline-block font-body text-xs uppercase tracking-widest border-b border-text-primary pb-0.5 text-text-primary transition-colors hover:text-primary hover:border-primary"
          >
            {t('aboutLink')}
          </Link>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 5: Verify dev server shows home page**

```bash
npm run dev
```
Open `http://localhost:3000` — should redirect to `/pt` and show home page.

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/page.tsx src/components/NavbarWrapper.tsx src/app/[locale]/layout.tsx
git commit -m "feat: add Home page with hero, featured projects, and about teaser"
```

---

### Task 16: Projects listing page

**Files:**
- Create: `src/app/[locale]/projetos/page.tsx`
- Create: `src/app/[locale]/projetos/ProjectsList.tsx` (client component for filter state)

- [ ] **Step 1: Create client projects list with filter**

Add `"noResults"` key to all three message files under `"projects"`. Edit each file:

In `src/messages/pt.json`, change the `"projects"` section to:
```json
"projects": {
  "title": "Projetos",
  "noResults": "Nenhum projeto encontrado.",
  "filter": {
    "all": "Todos",
    "residencial": "Residencial",
    "comercial": "Comercial",
    "reforma": "Reforma",
    "design-de-interiores": "Design de Interiores"
  }
}
```

In `src/messages/en.json`, change the `"projects"` section to:
```json
"projects": {
  "title": "Projects",
  "noResults": "No projects found.",
  "filter": {
    "all": "All",
    "residencial": "Residential",
    "comercial": "Commercial",
    "reforma": "Renovation",
    "design-de-interiores": "Interior Design"
  }
}
```

In `src/messages/es.json`, change the `"projects"` section to:
```json
"projects": {
  "title": "Proyectos",
  "noResults": "No se encontraron proyectos.",
  "filter": {
    "all": "Todos",
    "residencial": "Residencial",
    "comercial": "Comercial",
    "reforma": "Reforma",
    "design-de-interiores": "Diseño de Interiores"
  }
}
```

```typescript
// src/app/[locale]/projetos/ProjectsList.tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { type Project } from '@/data/projects'
import { type Locale } from '@/lib/i18n'
import ProjectCard from '@/components/ProjectCard'
import CategoryFilter from '@/components/CategoryFilter'

type Category = Project['category'] | 'all'

interface ProjectsListProps {
  projects: Project[]
  locale: Locale
}

export default function ProjectsList({ projects, locale }: ProjectsListProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const t = useTranslations('projects')

  const filtered =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  return (
    <>
      <div className="mb-10">
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} locale={locale} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="py-20 text-center font-body text-sm text-text-primary/50">
          {t('noResults')}
        </p>
      )}
    </>
  )
}
```

- [ ] **Step 2: Create projects listing page**

```typescript
// src/app/[locale]/projetos/page.tsx
import { getTranslations } from 'next-intl/server'
import { projects } from '@/data/projects'
import { type Locale } from '@/lib/i18n'
import ProjectsList from './ProjectsList'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'projects' })
  return { title: `${t('title')} — Carol Orofino` }
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'projects' })

  return (
    <div className="mx-auto max-w-7xl px-6 py-32">
      <h1 className="font-display text-4xl md:text-5xl text-primary tracking-wide mb-12">
        {t('title')}
      </h1>
      <ProjectsList projects={projects} locale={locale as Locale} />
    </div>
  )
}
```

- [ ] **Step 3: Verify page loads**

```bash
npm run dev
```
Visit `http://localhost:3000/pt/projetos` — should show projects grid with category filter.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/projetos/
git commit -m "feat: add Projects listing page with category filter"
```

---

### Task 17: Project detail page

**Files:**
- Create: `src/app/[locale]/projetos/[slug]/page.tsx`

- [ ] **Step 1: Create project detail page**

```typescript
// src/app/[locale]/projetos/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { getProjectBySlug, getAllSlugs } from '@/data/projects'
import { routing, type Locale } from '@/lib/i18n'
import ProjectGallery from '@/components/ProjectGallery'
import WhatsAppButton from '@/components/WhatsAppButton'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const locales = routing.locales
  const slugs = getAllSlugs()
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  )
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://carolorofino.com.br'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}
  const title = project.translations[locale as Locale]?.title ?? slug
  return {
    title: `${title} — Carol Orofino`,
    openGraph: {
      images: [{ url: `${BASE_URL}${project.coverImage}`, width: 1200, height: 630 }],
    },
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) notFound()

  const t = await getTranslations({ locale, namespace: 'project' })
  const translation = project.translations[locale as Locale]
  const whatsappMessage = t('whatsappMessage', { title: translation.title })

  return (
    <article className="mx-auto max-w-5xl px-6 py-32">
      {/* Header */}
      <header className="mb-12">
        <p className="font-body text-xs uppercase tracking-widest text-primary mb-3">
          {project.category} · {project.year}
        </p>
        <h1 className="font-display text-4xl md:text-6xl text-text-primary tracking-wide">
          {translation.title}
        </h1>
        <p className="mt-2 font-body text-sm text-text-primary/50">
          {project.location}
        </p>
      </header>

      {/* Cover image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-neutral mb-12">
        <Image
          src={project.coverImage}
          alt={project.coverImageAlt[locale as Locale]}
          fill
          priority
          className="object-cover"
          placeholder="blur"
          blurDataURL={project.coverImageBlurDataURL}
        />
      </div>

      {/* Description */}
      <div className="max-w-2xl mb-16">
        <p className="font-body text-base text-text-primary/80 leading-relaxed">
          {translation.description}
        </p>
      </div>

      {/* Gallery */}
      <ProjectGallery images={project.images} locale={locale as Locale} />

      {/* WhatsApp CTA */}
      <div className="mt-20 flex justify-center">
        <WhatsAppButton
          message={whatsappMessage}
          label={t('whatsappCta')}
          variant="inline"
        />
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Verify static params generate correctly**

```bash
npm run build
```
Expected: all project detail pages are pre-rendered (should see them in build output).

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/projetos/[slug]/page.tsx
git commit -m "feat: add Project detail page with gallery and WhatsApp CTA"
```

---

### Task 18: About, Services, Contact, and 404 pages

**Files:**
- Create: `src/app/[locale]/sobre/page.tsx`
- Create: `src/app/[locale]/servicos/page.tsx`
- Create: `src/app/[locale]/contato/page.tsx`
- Create: `src/app/[locale]/not-found.tsx`

- [ ] **Step 1: Create About page**

```typescript
// src/app/[locale]/sobre/page.tsx
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return { title: `${t('title')} — Carol Orofino` }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  return (
    <div className="mx-auto max-w-4xl px-6 py-32">
      <h1 className="font-display text-4xl md:text-5xl text-primary tracking-wide mb-12">
        {t('title')}
      </h1>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Photo placeholder */}
        <div className="aspect-[3/4] bg-neutral" aria-hidden="true" />
        <div className="flex flex-col justify-center gap-8">
          <p className="font-body text-base text-text-primary/80 leading-relaxed">
            {t('bio')}
          </p>
          <div>
            <h2 className="font-display text-2xl text-primary tracking-wide mb-4">
              {t('philosophy')}
            </h2>
            <p className="font-body text-base text-text-primary/80 leading-relaxed italic">
              {t('philosophyText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create Services page**

```typescript
// src/app/[locale]/servicos/page.tsx
import { getTranslations } from 'next-intl/server'
import { services } from '@/data/services'
import { type Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'services' })
  return { title: `${t('title')} — Carol Orofino` }
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'services' })

  return (
    <div className="mx-auto max-w-5xl px-6 py-32">
      <h1 className="font-display text-4xl md:text-5xl text-primary tracking-wide mb-16">
        {t('title')}
      </h1>
      <div className="grid grid-cols-1 gap-px bg-neutral md:grid-cols-2">
        {services.map((service) => {
          const translation = service.translations[locale as Locale]
          return (
            <div key={service.id} className="bg-background p-8">
              <h2 className="font-display text-2xl text-text-primary tracking-wide mb-4">
                {translation.title}
              </h2>
              <p className="font-body text-sm text-text-primary/70 leading-relaxed">
                {translation.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create Contact page**

```typescript
// src/app/[locale]/contato/page.tsx
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return { title: `${t('title')} — Carol Orofino` }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const message = t('whatsappMessage')
  const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`

  return (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="font-display text-4xl md:text-5xl text-primary tracking-wide mb-16">
        {t('title')}
      </h1>

      <div className="flex flex-col items-center gap-6">
        {/* WhatsApp CTA */}
        <Link
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 border border-text-primary px-10 py-4 font-body text-sm uppercase tracking-widest text-text-primary transition-colors hover:bg-text-primary hover:text-background"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {t('whatsappLabel')}
        </Link>

        <p className="font-body text-sm text-text-primary/50">
          {t('emailLabel')}:{' '}
          <Link
            href="mailto:carol@carolorofino.com.br"
            className="text-text-primary underline hover:text-primary"
          >
            carol@carolorofino.com.br
          </Link>
        </p>

        <p className="font-body text-sm text-text-primary/50">
          {t('followOn')}:{' '}
          <Link
            href="https://instagram.com/carolorofino"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary underline hover:text-primary"
          >
            @carolorofino
          </Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create 404 page**

Note: `not-found.tsx` should use `getTranslations`/`getLocale` from `next-intl/server` (server component) to avoid hook failures when Next.js renders the 404 outside locale context.

```typescript
// src/app/[locale]/not-found.tsx
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'

export default async function NotFound() {
  let locale = 'pt'
  let notFoundTitle = 'Página não encontrada'
  let notFoundDesc = 'A página que você procura não existe.'
  let notFoundBack = 'Voltar ao início'

  try {
    locale = await getLocale()
    const t = await getTranslations({ locale, namespace: 'notFound' })
    notFoundTitle = t('title')
    notFoundDesc = t('description')
    notFoundBack = t('back')
  } catch {
    // Fallback to Portuguese defaults if locale context unavailable
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-6xl text-primary tracking-wide">404</h1>
      <p className="mt-4 font-body text-lg text-text-primary">{notFoundTitle}</p>
      <p className="mt-2 font-body text-sm text-text-primary/50">{notFoundDesc}</p>
      <Link
        href={`/${locale}`}
        className="mt-8 font-body text-xs uppercase tracking-widest border-b border-text-primary pb-0.5 text-text-primary hover:text-primary hover:border-primary"
      >
        {notFoundBack}
      </Link>
    </div>
  )
}
```

- [ ] **Step 5: Run full build**

```bash
npm run build
```
Expected: all pages pre-rendered successfully.

- [ ] **Step 6: Run all tests**

```bash
npm test
```
Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/app/[locale]/sobre/ src/app/[locale]/servicos/ src/app/[locale]/contato/ src/app/[locale]/not-found.tsx
git commit -m "feat: add About, Services, Contact, and 404 pages"
```

---

## Chunk 5: SEO & Final Polish

### Task 19: Sitemap and robots.txt

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

- [ ] **Step 1: Create sitemap.ts**

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { routing } from '@/lib/i18n'
import { getAllSlugs } from '@/data/projects'

const BASE_URL = 'https://carolorofino.com.br'

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = routing.locales
  const slugs = getAllSlugs()

  const staticRoutes = ['', '/projetos', '/sobre', '/servicos', '/contato']

  const staticEntries = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  )

  const projectEntries = locales.flatMap((locale) =>
    slugs.map((slug) => ({
      url: `${BASE_URL}/${locale}/projetos/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  return [...staticEntries, ...projectEntries]
}
```

- [ ] **Step 2: Create robots.ts**

```typescript
// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://carolorofino.com.br/sitemap.xml',
  }
}
```

- [ ] **Step 3: Verify build includes sitemap**

```bash
npm run build
```
Expected: build completes. After deploy, `https://carolorofino.com.br/sitemap.xml` will return the sitemap.

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts
git commit -m "feat: add sitemap.xml and robots.txt generation"
```

---

### Task 20: Final verification

- [ ] **Step 1: Run all tests**

```bash
npm test
```
Expected: all tests pass.

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: ESLint check**

```bash
npm run lint
```
Expected: no errors or only warnings.

- [ ] **Step 4: Production build**

```bash
npm run build
```
Expected: all pages statically generated:
- `/pt`, `/en`, `/es` (Home)
- `/pt/projetos`, `/en/projetos`, `/es/projetos`
- `/pt/projetos/[slug]`, `/en/projetos/[slug]`, `/es/projetos/[slug]`
- `/pt/sobre`, `/en/sobre`, `/es/sobre`
- `/pt/servicos`, `/en/servicos`, `/es/servicos`
- `/pt/contato`, `/en/contato`, `/es/contato`

- [ ] **Step 5: Test locally in production mode**

```bash
npm run start
```
Visit `http://localhost:3000` and verify all pages load correctly.

- [ ] **Step 6: Commit final state**

```bash
git add .
git commit -m "chore: final polish and build verification"
```

---

## Deployment Checklist

Before deploying to Vercel:

- [ ] Add `NEXT_PUBLIC_WHATSAPP_NUMBER` environment variable in Vercel dashboard
- [ ] Replace placeholder `carol@carolorofino.com.br` with real email in `contato/page.tsx`
- [ ] Replace placeholder `@carolorofino` with real Instagram handle in `contato/page.tsx`
- [ ] Replace `https://carolorofino.com.br` with real domain in `sitemap.ts` and `robots.ts`
- [ ] Add real project photos to `public/images/projects/`
- [ ] Update `coverImageBlurDataURL` fields with real blur placeholders (use `plaiceholder` npm package or generate manually)
- [ ] Add `/public/favicon.ico`, `/public/apple-touch-icon.png`, and `/public/og-default.jpg`
- [ ] Review and update Carol's biography text in all 3 message files
- [ ] Update project data in `src/data/projects.ts` with real projects

---

## Notes for Future Expansion

- To add a new project: add an entry to `src/data/projects.ts` and add images to `public/images/projects/[slug]/`
- To add CMS: replace `src/data/projects.ts` exports with API calls — the page components remain unchanged
- To add localized URL paths (`/en/projects`): configure `pathnames` in `src/lib/i18n.ts` using next-intl docs
