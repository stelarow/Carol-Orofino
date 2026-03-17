// src/app/[locale]/projetos/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getProjectBySlug, getAllSlugs } from '@/data/projects'
import { categoryImages, KNOWN_SLUGS, type CategorySlug } from '@/data/categories'
import { routing, type Locale } from '@/lib/i18n'
import CategoryGallery from '@/components/CategoryGallery'
import ProjectGallery from '@/components/ProjectGallery'
import WhatsAppButton from '@/components/WhatsAppButton'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const locales = routing.locales
  const projectSlugs = getAllSlugs()
  const allSlugs = [...KNOWN_SLUGS, ...projectSlugs]
  return locales.flatMap((locale) =>
    allSlugs.map((slug) => ({ locale, slug }))
  )
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://carolorofino.com.br'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params

  if (KNOWN_SLUGS.includes(slug as CategorySlug)) {
    const t = await getTranslations({ locale, namespace: 'home' })
    return { title: `${t(slug)} — Carol Orofino` }
  }

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

export default async function ProjectOrCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params

  // Category page
  if (KNOWN_SLUGS.includes(slug as CategorySlug)) {
    const t = await getTranslations({ locale, namespace: 'home' })
    const tNotFound = await getTranslations({ locale, namespace: 'notFound' })
    const images = categoryImages[slug as CategorySlug]

    return (
      <div className="pt-24 pb-16">
        <div className="text-center mb-10 px-6">
          <Link
            href={`/${locale}`}
            className="font-body text-xs uppercase tracking-widest text-text-primary/50 hover:text-primary transition-colors"
          >
            ← {tNotFound('back')}
          </Link>
          <h1 className="font-display text-4xl md:text-5xl tracking-[0.15em] uppercase text-text-primary mt-4">
            {t(slug)}
          </h1>
          <div className="mx-auto mt-3 h-px w-10 bg-primary" />
        </div>
        <CategoryGallery images={images} locale={locale as Locale} />
      </div>
    )
  }

  // Project detail page
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const t = await getTranslations({ locale, namespace: 'project' })
  const translation = project.translations[locale as Locale]
  const whatsappMessage = t('whatsappMessage', { title: translation.title })

  return (
    <article className="mx-auto max-w-5xl px-6 py-32">
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

      <div className="relative aspect-[16/9] overflow-hidden bg-stone mb-12">
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

      <div className="max-w-2xl mb-16">
        <p className="font-body text-base text-text-primary/80 leading-relaxed">
          {translation.description}
        </p>
      </div>

      <ProjectGallery images={project.images} locale={locale as Locale} />

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
