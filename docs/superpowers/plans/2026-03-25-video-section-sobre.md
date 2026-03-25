# VideoSection — Página Sobre — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar um componente de vídeo full-width à página `/sobre`, com autoplay via IntersectionObserver, sem controles, e tela de encerramento tipográfica ao final do vídeo.

**Architecture:** Um client component `VideoSection` encapsula todo o comportamento (observer, estado `ended`, renderização condicional do EndScreen). A página `/sobre` importa e insere o componente entre as seções existentes. O vídeo é servido de `public/videos/carol-reel.mp4`.

**Tech Stack:** Next.js App Router, React (hooks: `useRef`, `useState`, `useEffect`), Tailwind CSS v4, Framer Motion.

---

## Mapa de Arquivos

| Ação | Arquivo | Responsabilidade |
|------|---------|-----------------|
| Criar dir + copiar | `public/videos/carol-reel.mp4` | Servir o vídeo como asset estático |
| Criar | `src/components/VideoSection.tsx` | Client component: autoplay, watermark crop, end screen |
| Criar | `src/components/__tests__/VideoSection.test.tsx` | Testes unitários do componente |
| Modificar | `src/app/[locale]/sobre/page.tsx` | Inserir `<VideoSection />` na posição correta |

---

## Task 1: Copiar o arquivo de vídeo

**Files:**
- Criar: `public/videos/` (diretório)
- Criar: `public/videos/carol-reel.mp4`

- [ ] **Step 1: Criar o diretório e copiar o vídeo**

```bash
mkdir -p public/videos
cp "/c/Users/Alessandro/Downloads/Person_walks_with_202603251421.mp4" public/videos/carol-reel.mp4
```

- [ ] **Step 2: Verificar que o arquivo foi copiado**

```bash
ls -lh public/videos/carol-reel.mp4
```

Esperado: arquivo listado com tamanho > 0.

- [ ] **Step 3: Adicionar ao .gitignore se necessário**

Verificar se `public/videos/` já está no `.gitignore`. Se o arquivo for grande (>50 MB), considerar adicionar a linha `public/videos/*.mp4` ao `.gitignore` para não commitar o binário. Caso contrário, commitar normalmente.

- [ ] **Step 4: Commit**

```bash
git add public/videos/carol-reel.mp4  # ou apenas .gitignore se ignorado
git commit -m "chore: add carol-reel video asset"
```

---

## Task 2: Escrever os testes para VideoSection

**Files:**
- Criar: `src/components/__tests__/VideoSection.test.tsx`

- [ ] **Step 1: Criar o arquivo de teste**

```tsx
// src/components/__tests__/VideoSection.test.tsx
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import VideoSection from '../VideoSection'

// Framer Motion usa APIs de browser não disponíveis em jsdom
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div className={className}>{children}</div>
    ),
  },
}))

// IntersectionObserver não existe em jsdom
const mockObserve = jest.fn()
const mockDisconnect = jest.fn()
beforeEach(() => {
  mockObserve.mockClear()
  mockDisconnect.mockClear()
  ;(global as any).IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
  }))
})

// HTMLVideoElement.play retorna Promise em browsers; jsdom não implementa
Object.defineProperty(HTMLVideoElement.prototype, 'play', {
  writable: true,
  value: jest.fn().mockResolvedValue(undefined),
})
Object.defineProperty(HTMLVideoElement.prototype, 'pause', {
  writable: true,
  value: jest.fn(),
})

describe('VideoSection', () => {
  it('renderiza um elemento <video> com muted e playsInline', () => {
    const { container } = render(<VideoSection />)
    const video = container.querySelector('video')
    expect(video).toBeInTheDocument()
    expect(video).toHaveAttribute('muted')
    expect(video).toHaveAttribute('playsInline')
  })

  it('não exibe controles nativos no vídeo', () => {
    const { container } = render(<VideoSection />)
    const video = container.querySelector('video')
    expect(video).not.toHaveAttribute('controls')
  })

  it('a seção raiz tem aria-hidden="true"', () => {
    const { container } = render(<VideoSection />)
    const section = container.querySelector('section')
    expect(section).toHaveAttribute('aria-hidden', 'true')
  })

  it('não exibe a tela de encerramento inicialmente', () => {
    const { queryByText } = render(<VideoSection />)
    expect(queryByText('Ambientes que revelam quem você é.')).not.toBeInTheDocument()
  })

  it('exibe a tela de encerramento quando o vídeo termina', () => {
    const { container, getByText } = render(<VideoSection />)
    const video = container.querySelector('video')!
    fireEvent.ended(video)
    expect(getByText('Ambientes que revelam quem você é.')).toBeInTheDocument()
  })

  it('registra o IntersectionObserver ao montar', () => {
    render(<VideoSection />)
    expect(global.IntersectionObserver).toHaveBeenCalledTimes(1)
    expect(mockObserve).toHaveBeenCalledTimes(1)
  })

  it('chama disconnect ao desmontar', () => {
    const { unmount } = render(<VideoSection />)
    unmount()
    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Rodar os testes para confirmar que falham**

```bash
npx jest src/components/__tests__/VideoSection.test.tsx --no-coverage
```

Esperado: todos os testes falham com `Cannot find module '../VideoSection'`.

---

## Task 3: Implementar o componente VideoSection

**Files:**
- Criar: `src/components/VideoSection.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
// src/components/VideoSection.tsx
'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ended, setEnded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!videoRef.current) return
        if (entry.isIntersecting) {
          videoRef.current.play().catch(() => {})
        } else {
          videoRef.current.pause()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <section aria-hidden="true">
      <div className="relative w-full overflow-hidden aspect-video">
        <video
          ref={videoRef}
          src="/videos/carol-reel.mp4"
          muted
          playsInline
          preload="none"
          className="w-full h-full object-cover scale-105"
          onEnded={() => setEnded(true)}
        />
        {ended && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-linen flex items-center justify-center px-8"
          >
            <p className="font-display text-5xl md:text-7xl font-light italic text-primary text-center">
              Ambientes que revelam quem você é.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Rodar os testes para confirmar que passam**

```bash
npx jest src/components/__tests__/VideoSection.test.tsx --no-coverage
```

Esperado: todos os 7 testes passam.

- [ ] **Step 3: Rodar a suite completa para garantir ausência de regressões**

```bash
npm run test -- --no-coverage
```

Esperado: todos os testes passam.

- [ ] **Step 4: Commit**

```bash
git add src/components/VideoSection.tsx src/components/__tests__/VideoSection.test.tsx
git commit -m "feat(sobre): add VideoSection component with autoplay and end screen"
```

---

## Task 4: Integrar VideoSection na página /sobre

**Files:**
- Modificar: `src/app/[locale]/sobre/page.tsx`

- [ ] **Step 1: Adicionar o import de VideoSection**

No topo do arquivo, após os imports existentes, adicionar:

```tsx
import VideoSection from '@/components/VideoSection'
```

- [ ] **Step 2: Inserir o componente na posição correta**

Localizar o bloco que fecha a seção "Projetos sob medida" (Section 1b) seguido de `<SectionDivider />` (~linha 100). O trecho atual é:

```tsx
      </section>

      <SectionDivider />

      {/* Section 2 — Filosofia de Design */}
```

Substituir por:

```tsx
      </section>

      <SectionDivider />
      <VideoSection />
      <SectionDivider />

      {/* Section 2 — Filosofia de Design */}
```

- [ ] **Step 3: Rodar a suite de testes para garantir ausência de regressões**

```bash
npm run test -- --no-coverage
```

Esperado: todos os testes passam.

- [ ] **Step 4: Verificar a build**

```bash
npm run build
```

Esperado: build sem erros de tipo ou compilação.

- [ ] **Step 5: Verificar visualmente no browser**

```bash
npm run dev
```

Abrir `http://localhost:3000/pt/sobre`, rolar até o vídeo e confirmar:
- Vídeo inicia automaticamente ao entrar na viewport
- Marca d'água no canto inferior direito não está visível
- Ao terminar, a frase "Ambientes que revelam quem você é." aparece com fade-in
- Nenhum controle de vídeo visível

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/sobre/page.tsx
git commit -m "feat(sobre): integrate VideoSection between projetos and filosofia sections"
```
