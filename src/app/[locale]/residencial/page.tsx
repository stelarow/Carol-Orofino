// src/app/[locale]/residencial/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { SectionDivider } from '@/components/SectionDivider'
import type { Locale } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'residencial' })
  return {
    title: `${t('hero')} — Carol Orofino`,
  }
}

export default async function ResidencialPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'residencial' })

  return (
    <main className="bg-background">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[75vh] min-h-[520px] w-full overflow-hidden">
        <Image
          src="/images/categories/residencial-hero.png"
          alt={t('hero')}
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
            Carol Orofino
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-wide leading-none">
            {t('hero')}
          </h1>
        </div>
      </section>

      <SectionDivider />

      {/* ── Seção 1 ──────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[540px]">
        <div className="flex flex-col items-center justify-center px-8 py-16 md:px-16 md:py-20 text-center">
          <span className="font-body text-xs uppercase tracking-widest text-primary mb-6">
            {t('s1.label')}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-text-primary tracking-wide leading-tight mb-8" style={{ whiteSpace: 'pre-line' }}>
            {t('s1.title')}
          </h2>
          <p className="font-body text-sm text-dark leading-relaxed max-w-md mb-6">
            {t('s1.p1')}
          </p>
          <p className="font-body text-sm text-dark leading-relaxed max-w-md">
            {t('s1.p2')}
          </p>
        </div>
        <div className="relative aspect-square">
          <Image
            src="/images/categories/residencial-01.png"
            alt={t('hero')}
            fill
            className="object-cover object-center"
          />
        </div>
      </section>

      {/* ── Seção 2 ──────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[540px]">
        <div className="relative aspect-square order-2 md:order-1">
          <Image
            src="/images/categories/residencial-02.png"
            alt={t('hero')}
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="flex flex-col items-center justify-center px-8 py-16 md:px-16 md:py-20 text-center order-1 md:order-2">
          <span className="font-body text-xs uppercase tracking-widest text-primary mb-6">
            {t('s2.label')}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-text-primary tracking-wide leading-tight mb-8" style={{ whiteSpace: 'pre-line' }}>
            {t('s2.title')}
          </h2>
          <p className="font-body text-sm text-dark leading-relaxed max-w-md mb-6">
            {t('s2.p1')}
          </p>
          <p className="font-body text-sm text-dark leading-relaxed max-w-md">
            {t('s2.p2')}
          </p>
        </div>
      </section>

      {/* ── Seção 3 ──────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[540px]">
        <div className="flex flex-col items-center justify-center px-8 py-16 md:px-16 md:py-20 text-center">
          <span className="font-body text-xs uppercase tracking-widest text-primary mb-6">
            {t('s3.label')}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-text-primary tracking-wide leading-tight mb-8" style={{ whiteSpace: 'pre-line' }}>
            {t('s3.title')}
          </h2>
          <p className="font-body text-sm text-dark leading-relaxed max-w-md mb-6">
            {t('s3.p1')}
          </p>
          <p className="font-body text-sm text-dark leading-relaxed max-w-md">
            {t('s3.p2')}
          </p>
        </div>
        <div className="relative aspect-square">
          <Image
            src="/images/categories/residencial-03.png"
            alt={t('hero')}
            fill
            className="object-cover object-center"
          />
        </div>
      </section>

      {/* ── Seção 4 ──────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[540px]">
        <div className="relative aspect-square order-2 md:order-1">
          <Image
            src="/images/categories/residencial-04.png"
            alt={t('hero')}
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="flex flex-col items-center justify-center px-8 py-16 md:px-16 md:py-20 text-center order-1 md:order-2">
          <span className="font-body text-xs uppercase tracking-widest text-primary mb-6">
            {t('s4.label')}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-text-primary tracking-wide leading-tight mb-8" style={{ whiteSpace: 'pre-line' }}>
            {t('s4.title')}
          </h2>
          <p className="font-body text-sm text-dark leading-relaxed max-w-md mb-6">
            {t('s4.p1')}
          </p>
          <p className="font-body text-sm text-dark leading-relaxed max-w-md">
            {t('s4.p2')}
          </p>
        </div>
      </section>

      {/* ── Seção 5 ──────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[540px]">
        <div className="flex flex-col items-center justify-center px-8 py-16 md:px-16 md:py-20 text-center">
          <span className="font-body text-xs uppercase tracking-widest text-primary mb-6">
            {t('s5.label')}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-text-primary tracking-wide leading-tight mb-8" style={{ whiteSpace: 'pre-line' }}>
            {t('s5.title')}
          </h2>
          <p className="font-body text-sm text-dark leading-relaxed max-w-md mb-6">
            {t('s5.p1')}
          </p>
          <p className="font-body text-sm text-dark leading-relaxed max-w-md">
            {t('s5.p2')}
          </p>
        </div>
        <div className="relative aspect-square">
          <Image
            src="/images/categories/residencial-05.png"
            alt={t('hero')}
            fill
            className="object-cover object-center"
          />
        </div>
      </section>

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
