import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { posts } from '@/data/posts'
import type { Locale } from '@/lib/i18n'

interface RelatedPostsProps {
  locale: Locale
  currentSlug: string
}

export default async function RelatedPosts({ locale, currentSlug }: RelatedPostsProps) {
  const t = await getTranslations({ locale, namespace: 'blog' })

  const related = [...posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((p) => p.slug !== currentSlug)
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <section className="mt-16 border-t border-stone pt-12">
      <p className="font-body text-xs uppercase tracking-widest text-primary mb-8">
        {t('relatedPostsTitle')}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {related.map((post) => {
          const content = post.translations[locale]
          return (
            <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="group">
              {post.image ? (
                <div className="relative aspect-video overflow-hidden mb-4">
                  <Image
                    src={post.image}
                    alt={content.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-sand mb-4" />
              )}
              <p className="font-body text-xs text-mauve uppercase tracking-widest mb-2">
                {post.category}
              </p>
              <h3 className="font-display text-lg text-primary tracking-wide group-hover:text-walnut transition-colors leading-snug">
                {content.title}
              </h3>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
