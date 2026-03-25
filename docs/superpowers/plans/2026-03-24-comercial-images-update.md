# Comercial Page — Images & Sections Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir as duas imagens e textos da página `/comercial` por novas imagens PNG, e adicionar uma terceira seção com narrativa progressiva (Identidade → Presença → Equilíbrio).

**Architecture:** Cópia direta de arquivos de imagem para `public/images/categories/`, seguida de edição do único arquivo de página `src/app/[locale]/comercial/page.tsx`. Sem novos componentes nem rotas. Test renderiza a página e verifica presença dos novos labels/títulos/alts.

**Tech Stack:** Next.js App Router, React, Tailwind CSS, Jest + React Testing Library

**Spec:** `docs/superpowers/specs/2026-03-24-comercial-images-update-design.md`

---

### Task 1: Copiar imagens para o projeto

**Files:**
- Create: `public/images/categories/comercial-01.png`
- Create: `public/images/categories/comercial-02.png`
- Create: `public/images/categories/comercial-03.png`

- [ ] **Step 1: Copiar as três imagens**

```bash
cp "C:/Users/Alessandro/Downloads/Adicione_a_logo_202603240843.png" "public/images/categories/comercial-01.png"
cp "C:/Users/Alessandro/Downloads/Adicione_a_logo_202603240848.png" "public/images/categories/comercial-02.png"
cp "C:/Users/Alessandro/Downloads/Adicione_a_logo_202603240844.png" "public/images/categories/comercial-03.png"
```

- [ ] **Step 2: Verificar que os 3 arquivos existem**

```bash
ls public/images/categories/comercial-0*.png
```

Expected: listar `comercial-01.png`, `comercial-02.png`, `comercial-03.png`

---

### Task 2: Escrever o teste (deve falhar antes das mudanças de conteúdo)

**Files:**
- Create: `src/app/[locale]/comercial/__tests__/page.test.tsx`

- [ ] **Step 1: Criar o arquivo de teste**

```tsx
// src/app/[locale]/comercial/__tests__/page.test.tsx
import { render, screen } from '@testing-library/react'
import ComercialPage from '../page'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

jest.mock('@/components/SectionDivider', () => ({
  SectionDivider: () => <hr data-testid="section-divider" />,
}))

async function renderPage() {
  const jsx = await ComercialPage({ params: Promise.resolve({ locale: 'pt' }) })
  return render(jsx)
}

describe('ComercialPage', () => {
  it('renders section 1 with correct label and heading', async () => {
    await renderPage()
    expect(screen.getByText('01 — Identidade')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Design que revela/i })).toBeInTheDocument()
  })

  it('renders section 2 with correct label and heading', async () => {
    await renderPage()
    expect(screen.getByText('02 — Presença')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Ambientes que/i })).toBeInTheDocument()
  })

  it('renders section 3 with correct label and heading', async () => {
    await renderPage()
    expect(screen.getByText('03 — Equilíbrio')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Funcionalidade/i })).toBeInTheDocument()
  })

  it('renders all three new images with correct alt text', async () => {
    await renderPage()
    expect(screen.getByAltText('Escritório comercial Carol Orofino — identidade')).toBeInTheDocument()
    expect(screen.getByAltText('Escritório executivo Carol Orofino — presença')).toBeInTheDocument()
    expect(screen.getByAltText('Escritório comercial Carol Orofino — equilíbrio')).toBeInTheDocument()
  })

  it('uses the new .png image sources', async () => {
    await renderPage()
    const images = screen.getAllByRole('img')
    const srcs = images.map((img) => img.getAttribute('src'))
    expect(srcs).toContain('/images/categories/comercial-01.png')
    expect(srcs).toContain('/images/categories/comercial-02.png')
    expect(srcs).toContain('/images/categories/comercial-03.png')
  })
})
```

- [ ] **Step 2: Rodar o teste — deve falhar**

```bash
npx jest src/app/[locale]/comercial/__tests__/page.test.tsx --no-coverage
```

Expected: FAIL — labels "01 — Identidade", "03 — Equilíbrio" e imagens `.png` ainda não existem na página.

---

### Task 3: Atualizar Seção 1 na página

**Files:**
- Modify: `src/app/[locale]/comercial/page.tsx` (seção 1, linhas ~53-79)

- [ ] **Step 1: Substituir o conteúdo da Seção 1**

Localizar o bloco `{/* ── Seção 1 */}` e substituir o conteúdo interno pela versão abaixo. Manter as classes Tailwind do grid e dos divs inalteradas; trocar apenas texto e `src`/`alt` da imagem.

```tsx
{/* ── Seção 1: texto à esquerda, imagem à direita ──────────────────── */}
<section className="grid grid-cols-1 md:grid-cols-2 min-h-[540px]">
  <div className="flex flex-col items-center justify-center px-8 py-16 md:px-16 md:py-20 text-center">
    <span className="font-body text-xs uppercase tracking-widest text-primary mb-6">
      01 — Identidade
    </span>
    <h2 className="font-display text-4xl md:text-5xl text-text-primary tracking-wide leading-tight mb-8">
      Design que revela<br />quem você é
    </h2>
    <p className="font-body text-sm text-dark leading-relaxed max-w-md mb-6">
      O espaço comercial é uma extensão da sua marca. Antes de qualquer palavra,
      ele já comunica valores, cuidado e personalidade.
    </p>
    <p className="font-body text-sm text-dark leading-relaxed max-w-md">
      Cada escolha — a madeira, a luz, o detalhe curatorial — é pensada para
      traduzir sua essência em ambiente.
    </p>
  </div>
  <div className="relative min-h-[400px] md:min-h-0">
    <Image
      src="/images/categories/comercial-01.png"
      alt="Escritório comercial Carol Orofino — identidade"
      fill
      className="object-cover object-center"
    />
  </div>
</section>
```

- [ ] **Step 2: Rodar o teste — 2 de 5 casos devem passar agora**

```bash
npx jest src/app/[locale]/comercial/__tests__/page.test.tsx --no-coverage
```

Expected: testes de seção 1 e alt "identidade" passando; seção 3 e "equilíbrio" ainda falhando.

---

### Task 4: Atualizar Seção 2 na página

**Files:**
- Modify: `src/app/[locale]/comercial/page.tsx` (seção 2, linhas ~81-107)

- [ ] **Step 1: Substituir o conteúdo da Seção 2**

Localizar o bloco `{/* ── Seção 2 */}` e substituir pela versão abaixo. **Manter** as classes `order-2 md:order-1` e `order-1 md:order-2` nos divs.

```tsx
{/* ── Seção 2: imagem à esquerda, texto à direita ──────────────────── */}
<section className="grid grid-cols-1 md:grid-cols-2 min-h-[540px]">
  <div className="relative min-h-[400px] md:min-h-0 order-2 md:order-1">
    <Image
      src="/images/categories/comercial-02.png"
      alt="Escritório executivo Carol Orofino — presença"
      fill
      className="object-cover object-center"
    />
  </div>
  <div className="flex flex-col items-center justify-center px-8 py-16 md:px-16 md:py-20 text-center order-1 md:order-2">
    <span className="font-body text-xs uppercase tracking-widest text-primary mb-6">
      02 — Presença
    </span>
    <h2 className="font-display text-4xl md:text-5xl text-text-primary tracking-wide leading-tight mb-8">
      Ambientes que<br />constroem autoridade
    </h2>
    <p className="font-body text-sm text-dark leading-relaxed max-w-md mb-6">
      Credibilidade se constrói também no espaço. Um ambiente bem projetado
      transmite seriedade, inspira confiança e posiciona sua marca antes mesmo
      da primeira reunião.
    </p>
    <p className="font-body text-sm text-dark leading-relaxed max-w-md">
      Do mobiliário à paleta, cada elemento reforça a mensagem que você quer passar.
    </p>
  </div>
</section>
```

- [ ] **Step 2: Rodar o teste — 4 de 5 casos devem passar**

```bash
npx jest src/app/[locale]/comercial/__tests__/page.test.tsx --no-coverage
```

Expected: seções 1 e 2 passando; apenas seção 3 e "equilíbrio" falhando.

---

### Task 5: Adicionar Seção 3

**Files:**
- Modify: `src/app/[locale]/comercial/page.tsx` (inserir após `</section>` da Seção 2, antes de `<SectionDivider />`)

- [ ] **Step 1: Inserir a Seção 3**

Localizar o `<SectionDivider />` que precede a seção CTA e inserir o bloco abaixo imediatamente antes dele:

```tsx
{/* ── Seção 3: texto à esquerda, imagem à direita ──────────────────── */}
<section className="grid grid-cols-1 md:grid-cols-2 min-h-[540px]">
  <div className="flex flex-col items-center justify-center px-8 py-16 md:px-16 md:py-20 text-center">
    <span className="font-body text-xs uppercase tracking-widest text-primary mb-6">
      03 — Equilíbrio
    </span>
    <h2 className="font-display text-4xl md:text-5xl text-text-primary tracking-wide leading-tight mb-8">
      Funcionalidade<br />com leveza
    </h2>
    <p className="font-body text-sm text-dark leading-relaxed max-w-md mb-6">
      Produtividade real exige conforto. Espaços que integram luz natural,
      proporção e materiais certos criam ambientes onde as pessoas trabalham
      melhor — e permanecem com prazer.
    </p>
    <p className="font-body text-sm text-dark leading-relaxed max-w-md">
      Projeto para que beleza e função andem juntas, sem concessões.
    </p>
  </div>
  <div className="relative min-h-[400px] md:min-h-0">
    <Image
      src="/images/categories/comercial-03.png"
      alt="Escritório comercial Carol Orofino — equilíbrio"
      fill
      className="object-cover object-center"
    />
  </div>
</section>
```

- [ ] **Step 2: Rodar todos os testes — todos devem passar**

```bash
npx jest src/app/[locale]/comercial/__tests__/page.test.tsx --no-coverage
```

Expected: 5/5 PASS

---

### Task 6: Verificar build e commitar

**Files:** nenhum novo

- [ ] **Step 1: Rodar lint**

```bash
npm run lint
```

Expected: sem erros

- [ ] **Step 2: Rodar build de produção**

```bash
npm run build
```

Expected: build finaliza sem erros de tipo ou de imagem

- [ ] **Step 3: Commitar**

```bash
git add public/images/categories/comercial-01.png \
        public/images/categories/comercial-02.png \
        public/images/categories/comercial-03.png \
        src/app/[locale]/comercial/page.tsx \
        src/app/[locale]/comercial/__tests__/page.test.tsx
git commit -m "feat(comercial): replace images and add third section with narrative arc"
```
