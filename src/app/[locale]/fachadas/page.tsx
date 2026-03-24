// src/app/[locale]/fachadas/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SectionDivider } from '@/components/SectionDivider'

export const metadata: Metadata = {
  title: 'Fachadas — Carol Orofino',
  description:
    'Projetos de fachadas por Carol Orofino — espaços residenciais e comerciais que unem funcionalidade, beleza e identidade com a paisagem.',
}

export default async function FachadasPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <main className="bg-background">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[75vh] min-h-[520px] w-full overflow-hidden">
        <Image
          src="/images/categories/projetos-hero.png"
          alt="Fachadas Carol Orofino"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50" />
        <Link
          href={`/${locale}`}
          className="absolute top-24 left-8 md:left-16 flex items-center gap-2 font-body text-xs uppercase tracking-widest text-white/80 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Voltar
        </Link>
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-12 md:px-16 md:pb-16 text-center">
          <p className="font-body text-xs uppercase tracking-widest text-white/70 mb-3">
            Carol Orofino
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-wide leading-none">
            Fachadas
          </h1>
        </div>
      </section>

      <SectionDivider />

      {/* ── Seção 1: texto à esquerda, imagem à direita ──────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[540px]">
        <div className="flex flex-col items-center justify-center px-8 py-16 md:px-16 md:py-20 text-center">
          <span className="font-body text-xs uppercase tracking-widest text-primary mb-6">
            01 — Presença
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-text-primary tracking-wide leading-tight mb-8">
            A primeira impressão<br />começa do lado de fora
          </h2>
          <p className="font-body text-sm text-dark leading-relaxed max-w-md mb-6">
            A fachada é o rosto de um espaço. Antes de qualquer palavra, ela já
            comunica valores, cuidado e personalidade — para quem passa, para quem chega.
          </p>
          <p className="font-body text-sm text-dark leading-relaxed max-w-md">
            Cada projeto começa com a leitura do entorno: a luz, o volume, os materiais
            que vão dialogar com a paisagem sem perder identidade.
          </p>
        </div>
        <div className="relative aspect-square">
          <Image
            src="/images/categories/fachadas-01.png"
            alt="Fachada vista frontal — Carol Orofino"
            fill
            className="object-cover object-center"
          />
        </div>
      </section>

      {/* ── Seção 2: imagem à esquerda, texto à direita ──────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[540px]">
        <div className="relative aspect-square order-2 md:order-1">
          <Image
            src="/images/categories/fachadas-02.png"
            alt="Fachada com área aberta e piscina — Carol Orofino"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="flex flex-col items-center justify-center px-8 py-16 md:px-16 md:py-20 text-center order-1 md:order-2">
          <span className="font-body text-xs uppercase tracking-widest text-primary mb-6">
            02 — Integração
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-text-primary tracking-wide leading-tight mb-8">
            Dentro e fora<br />em conversa
          </h2>
          <p className="font-body text-sm text-dark leading-relaxed max-w-md mb-6">
            Quando a fachada e os ambientes internos se conversam, o espaço ganha
            fluidez. A área externa deixa de ser um limite e passa a ser uma extensão
            natural da vida dentro de casa.
          </p>
          <p className="font-body text-sm text-dark leading-relaxed max-w-md">
            Volumes, aberturas e mobiliário de área trabalhados em conjunto para
            criar uma experiência contínua.
          </p>
        </div>
      </section>

      {/* ── Seção 3: texto à esquerda, imagem à direita ──────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[540px]">
        <div className="flex flex-col items-center justify-center px-8 py-16 md:px-16 md:py-20 text-center">
          <span className="font-body text-xs uppercase tracking-widest text-primary mb-6">
            03 — Paisagem
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-text-primary tracking-wide leading-tight mb-8">
            O projeto que<br />abraça o entorno
          </h2>
          <p className="font-body text-sm text-dark leading-relaxed max-w-md mb-6">
            A piscina, o jardim, a vista — tudo isso faz parte do projeto. Uma fachada
            bem desenhada enquadra a paisagem, cria perspectivas e valoriza o que a
            natureza já oferece.
          </p>
          <p className="font-body text-sm text-dark leading-relaxed max-w-md">
            O resultado é um espaço que parece ter sempre estado ali.
          </p>
        </div>
        <div className="relative aspect-square">
          <Image
            src="/images/categories/fachadas-03.png"
            alt="Fachada fundos com piscina — Carol Orofino"
            fill
            className="object-cover object-center"
          />
        </div>
      </section>

      {/* ── Seção 4: imagem à esquerda, texto à direita ──────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[540px]">
        <div className="relative aspect-square order-2 md:order-1">
          <Image
            src="/images/categories/fachadas-04.png"
            alt="Fachada à beira-mar — Carol Orofino"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="flex flex-col items-center justify-center px-8 py-16 md:px-16 md:py-20 text-center order-1 md:order-2">
          <span className="font-body text-xs uppercase tracking-widest text-primary mb-6">
            04 — Identidade
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-text-primary tracking-wide leading-tight mb-8">
            Cada lugar<br />tem sua linguagem
          </h2>
          <p className="font-body text-sm text-dark leading-relaxed max-w-md mb-6">
            Uma fachada à beira-mar pede leveza, materiais que resistam e uma paleta
            que dialogue com a água e a areia. Não existe fórmula — existe escuta e
            interpretação de cada contexto.
          </p>
          <p className="font-body text-sm text-dark leading-relaxed max-w-md">
            É essa leitura cuidadosa que transforma um projeto em um lugar com alma.
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center px-8 py-20 text-center">
        <h2 className="font-display text-4xl md:text-5xl text-text-primary tracking-wide mb-6">
          Pronto para começar?
        </h2>
        <p className="font-body text-sm text-dark leading-relaxed max-w-md mb-10">
          Conta sobre o seu espaço e vamos criar algo incrível juntos.
        </p>
        <Link
          href={`/${locale}/questionario`}
          className="bg-slate border border-white/60 px-8 py-3 font-display font-light italic text-white transition-opacity hover:opacity-80"
        >
          Preencher questionário
        </Link>
      </section>
    </main>
  )
}
