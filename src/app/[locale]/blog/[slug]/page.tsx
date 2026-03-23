import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { posts } from '@/data/posts'
import BlogSidebar from '@/components/BlogSidebar'
import type { Locale } from '@/lib/i18n'

export async function generateStaticParams() {
  const locales: Locale[] = ['pt', 'en', 'es']
  return locales.flatMap((locale) =>
    posts.map((post) => ({ locale, slug: post.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = posts.find((p) => p.slug === slug)
  if (!post) return {}
  const content = post.translations[locale as Locale]
  return { title: `${content.title} — Carol Orofino` }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const post = posts.find((p) => p.slug === slug)
  if (!post) notFound()

  const lang = locale as Locale
  const content = post.translations[lang]
  const t = await getTranslations({ locale, namespace: 'blog' })

  const localeCode =
    lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US'

  return (
    <>
      {/* Hero — full viewport width, dark background */}
      <div
        className="w-full text-center py-20 px-6"
        style={{ backgroundColor: '#2a2118' }}
      >
        <p className="font-body text-xs text-latte uppercase tracking-widest mb-6">
          {post.category}
          {' · '}
          {new Date(post.date).toLocaleDateString(localeCode, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          {' · '}
          {post.readTime} {t('minRead')}
        </p>
        <h1 className="font-display text-4xl md:text-6xl text-linen tracking-wide leading-tight mb-6 max-w-4xl mx-auto">
          {content.title}
        </h1>
        <p className="font-body text-lg text-latte italic max-w-2xl mx-auto">
          {content.subtitle}
        </p>
      </div>

      {/* Featured image — only if post.image is defined */}
      {post.image && (
        <div className="max-w-6xl mx-auto">
          <Image
            src={post.image}
            alt={content.title}
            width={1200}
            height={600}
            className="w-full object-cover"
          />
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16 py-16 px-6 max-w-6xl mx-auto">
        {/* Main: article content */}
        <article>
          <Link
            href={`/${locale}/blog`}
            className="font-body text-xs uppercase tracking-widest text-dark hover:text-primary transition-colors mb-12 inline-block"
          >
            ← {t('backToBlog')}
          </Link>

          {/* Sections */}
          <div className="flex flex-col gap-12 mt-8">
            {content.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-2xl text-primary tracking-wide mb-5">
                  {section.heading}
                </h2>
                <div className="flex flex-col gap-4">
                  {section.body.split('\n\n').map((paragraph, i) => (
                    <p
                      key={i}
                      className="font-body text-base text-dark leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Conclusion */}
          <div className="mt-16 border-t border-stone pt-12">
            <p className="font-body text-base text-dark leading-relaxed italic mb-8">
              {content.conclusion}
            </p>
            <p className="font-body text-sm text-dark leading-relaxed">
              {content.cta}
            </p>
          </div>

          {/* CTA button */}
          <div className="mt-12">
            <Link
              href={`/${locale}/contato`}
              className="inline-block font-body text-xs uppercase tracking-widest border border-primary text-primary px-8 py-3 transition-colors hover:bg-mauve hover:text-background"
            >
              {t('contactCta')}
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <BlogSidebar locale={lang} currentSlug={post.slug} />
      </div>
    </>
  )
}
