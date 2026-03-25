'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Post } from '@/data/posts'
import type { Locale } from '@/lib/i18n'
import type { Variants } from 'framer-motion'

interface BlogTeaserProps {
  posts: Post[]
  locale: Locale
  title: string
  readMore: string
  blogLink: string
  blogLinkHref: string
}

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export function BlogTeaser({
  posts,
  locale,
  title,
  readMore,
  blogLink,
  blogLinkHref,
}: BlogTeaserProps) {
  return (
    <section className="py-20">
      <div className="pl-8 md:pl-16 xl:pl-[max(4rem,calc(25vw-14rem))] pr-8 md:pr-16 max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl font-light italic text-primary leading-tight mb-10"
        >
          {title}
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="flex flex-col divide-y divide-stone">
            {posts.map((post) => (
              <motion.div key={post.slug} variants={item} className="py-8">
                <Link href={`/${locale}/blog/${post.slug}`} className="group">
                  <h3 className="font-display text-2xl md:text-3xl text-primary tracking-wide mb-2 group-hover:text-walnut transition-colors">
                    {post.translations[locale].title}
                  </h3>
                  <p className="font-body text-sm text-dark italic leading-relaxed mb-5">
                    {post.translations[locale].subtitle}
                  </p>
                  <span className="font-body text-xs uppercase tracking-widest text-primary border-b border-primary pb-0.5 transition-colors group-hover:text-mauve group-hover:border-mauve">
                    {readMore} →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div variants={item} className="mt-10">
            <Link
              href={blogLinkHref}
              className="inline-block bg-slate border border-white/60 px-8 py-3 font-display font-light italic text-white transition-opacity hover:opacity-80"
            >
              {blogLink}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
