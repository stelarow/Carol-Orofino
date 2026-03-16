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
        <Image
          src="/hero-brand-mobile.jpg"
          alt="Carol Orofino Interior Design"
          fill
          priority
          className="object-cover md:hidden"
        />
        <Image
          src="/hero-brand-desktop.png"
          alt="Carol Orofino Interior Design"
          fill
          priority
          className="object-cover hidden md:block"
        />
      </section>

      {/* Featured Projects */}
      <section className="pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              locale={locale as Locale}
            />
          ))}
        </div>
        <div className="mt-12 text-center px-6">
          <Link
            href={`/${locale}/projetos`}
            className="font-body text-xs uppercase tracking-widest border border-text-primary px-8 py-3 text-text-primary transition-colors hover:bg-text-primary hover:text-background"
          >
            {t('viewAllProjects')}
          </Link>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-primary tracking-wide">
            {t('aboutTitle')}
          </h2>
          <p className="mt-6 font-body text-base text-dark leading-relaxed max-w-2xl mx-auto">
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
