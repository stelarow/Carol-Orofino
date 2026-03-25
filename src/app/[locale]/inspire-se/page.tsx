// src/app/[locale]/inspire-se/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { SectionDivider } from '@/components/SectionDivider'
import { StyleSection } from '@/components/StyleSection'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'inspireSe' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default async function InspireSeePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'inspireSe' })

  const styles = [
    {
      img: '/images/inspire-se/gallery-featured.png',
      title: t('classicos.title'),
      text: t('classicos.text'),
      colors: [
        { hex: '#D9D9D9', name: 'Pérola' },
        { hex: '#F5F5DC', name: 'Bege' },
        { hex: '#2B2B2B', name: 'Carvão' },
        { hex: '#FFFFFF', name: 'Branco' },
        { hex: '#1C2A44', name: 'Azul Naval' },
        { hex: '#EAE0D5', name: 'Linho' },
      ],
    },
    {
      img: '/images/inspire-se/contemporaneo.png',
      title: t('contemporaneo.title'),
      text: t('contemporaneo.text'),
      colors: [
        { hex: '#FFFFFF', name: 'Branco' },
        { hex: '#F5F5F5', name: 'Gelo' },
        { hex: '#CFCFCF', name: 'Névoa' },
        { hex: '#2B2B2B', name: 'Carvão' },
        { hex: '#000000', name: 'Preto' },
        { hex: '#6B8E23', name: 'Oliva' },
        { hex: '#1F3A5F', name: 'Índigo' },
        { hex: '#C65D3B', name: 'Terracota' },
        { hex: '#A47148', name: 'Caramelo' },
      ],
    },
    {
      img: '/images/inspire-se/minimalista.png',
      title: t('minimalista.title'),
      text: t('minimalista.text'),
      colors: [
        { hex: '#FFFFFF', name: 'Branco' },
        { hex: '#F5F5F5', name: 'Gelo' },
        { hex: '#D9D9D9', name: 'Pérola' },
        { hex: '#CFCFCF', name: 'Névoa' },
        { hex: '#E8E1D9', name: 'Areia' },
        { hex: '#BFA58A', name: 'Camelo' },
        { hex: '#2B2B2B', name: 'Carvão' },
      ],
    },
    {
      img: '/images/inspire-se/escandinavo.png',
      title: t('escandinavo.title'),
      text: t('escandinavo.text'),
      colors: [
        { hex: '#FFFFFF', name: 'Branco' },
        { hex: '#F2F2F2', name: 'Gelo' },
        { hex: '#D9D9D9', name: 'Cinza Claro' },
        { hex: '#E8E3D9', name: 'Areia' },
        { hex: '#C7BFB0', name: 'Pedra' },
        { hex: '#A3B18A', name: 'Sage' },
        { hex: '#D6A77A', name: 'Mel' },
        { hex: '#2E2E2E', name: 'Antracite' },
      ],
    },
    {
      img: '/images/inspire-se/industrial.png',
      title: t('industrial.title'),
      text: t('industrial.text'),
      colors: [
        { hex: '#F2F2F2', name: 'Gelo' },
        { hex: '#B0B0B0', name: 'Prata' },
        { hex: '#5A5A5A', name: 'Aço' },
        { hex: '#2B2B2B', name: 'Carvão' },
        { hex: '#8C6F5A', name: 'Argila' },
        { hex: '#A47551', name: 'Canela' },
        { hex: '#C65D3B', name: 'Ferrugem' },
        { hex: '#6E6E6E', name: 'Grafite' },
        { hex: '#B87333', name: 'Cobre' },
      ],
    },
    {
      img: '/images/inspire-se/japandi.png',
      title: t('japandi.title'),
      text: t('japandi.text'),
      colors: [
        { hex: '#F4F1EC', name: 'Washi' },
        { hex: '#E6DDCF', name: 'Areia Quente' },
        { hex: '#D2C2A8', name: 'Linho' },
        { hex: '#A1866F', name: 'Bambu' },
        { hex: '#6E5A4B', name: 'Cedro' },
        { hex: '#8C8C8C', name: 'Pedra' },
        { hex: '#7A8F6A', name: 'Musgo' },
        { hex: '#2B2B2B', name: 'Ébano' },
      ],
    },
    {
      img: '/images/inspire-se/boho.png',
      title: t('boho.title'),
      text: t('boho.text'),
      colors: [
        { hex: '#E6C9A8', name: 'Juta' },
        { hex: '#C97A40', name: 'Âmbar' },
        { hex: '#8B5A2B', name: 'Mogno' },
        { hex: '#D4A017', name: 'Açafrão' },
        { hex: '#A63D40', name: 'Bordô' },
        { hex: '#3A7D44', name: 'Esmeralda' },
        { hex: '#FFFFFF', name: 'Branco' },
        { hex: '#2B2B2B', name: 'Carvão' },
      ],
    },
    {
      img: '/images/inspire-se/moderno.png',
      title: t('moderno.title'),
      text: t('moderno.text'),
      colors: [
        { hex: '#FFFFFF', name: 'Branco' },
        { hex: '#F2F2F2', name: 'Gelo' },
        { hex: '#BFBFBF', name: 'Prata' },
        { hex: '#A8A8A8', name: 'Platina' },
        { hex: '#6E6E6E', name: 'Grafite' },
        { hex: '#D9D4CC', name: 'Nude' },
        { hex: '#2B2B2B', name: 'Carvão' },
        { hex: '#E63946', name: 'Rubi' },
        { hex: '#1D3557', name: 'Safira' },
      ],
    },
    {
      img: '/images/inspire-se/rustico.png',
      title: t('rustico.title'),
      text: t('rustico.text'),
      colors: [
        { hex: '#F5F0E6', name: 'Creme' },
        { hex: '#C2A27C', name: 'Siena' },
        { hex: '#8B5A2B', name: 'Carvalho' },
        { hex: '#A0522D', name: 'Mogno' },
        { hex: '#D2691E', name: 'Chocolate' },
        { hex: '#7A8450', name: 'Oliveira' },
        { hex: '#6E6E6E', name: 'Pedra' },
      ],
    },
    {
      img: '/images/inspire-se/provencal.png',
      title: t('provencal.title'),
      text: t('provencal.text'),
      colors: [
        { hex: '#FFFFFF', name: 'Branco' },
        { hex: '#F5F0E6', name: 'Creme' },
        { hex: '#E6D5C3', name: 'Bege Rosé' },
        { hex: '#D8D8D8', name: 'Cinza' },
        { hex: '#C8A2C8', name: 'Lavanda' },
        { hex: '#A7C7E7', name: 'Azul Céu' },
        { hex: '#F4C2C2', name: 'Rosa' },
        { hex: '#CDE7D8', name: 'Menta' },
      ],
    },
  ]

  return (
    <main className="bg-background">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[75vh] min-h-[520px] w-full overflow-hidden">
        <Image
          src="/images/inspire-se/hero.png"
          alt={t('heroTitle')}
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
          {t('back')}
        </Link>

        <div className="absolute bottom-0 left-0 right-0 px-8 pb-12 md:px-16 md:pb-16 text-center">
          <p className="font-body text-xs uppercase tracking-widest text-white/70 mb-3">
            {t('heroLabel')}
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-wide leading-none">
            {t('heroTitle')}
          </h1>
        </div>
      </section>

      <div className="pt-16 md:pt-24" />

      {/* ── Seções de estilo ─────────────────────────────────────────────── */}
      {styles.map(({ img, title, text, colors }, index, arr) => (
        <div key={title}>
          <StyleSection
            img={img}
            title={title}
            text={text}
            colors={colors}
            reversed={index % 2 !== 0}
          />
          {index < arr.length - 1 && <SectionDivider />}
        </div>
      ))}

      <SectionDivider />

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center px-8 py-20 text-center">
        <h2 className="font-display text-4xl md:text-5xl text-text-primary tracking-wide mb-6">
          {t('cta.title')}
        </h2>
        <p className="font-body text-sm text-dark leading-relaxed max-w-md mb-10">
          {t('cta.body')}
        </p>
        <Link
          href={`/${locale}/questionario`}
          className="bg-slate border border-white/60 px-8 py-3 font-display font-light italic text-white transition-opacity hover:opacity-80"
        >
          {t('cta.button')}
        </Link>
      </section>
    </main>
  )
}
