// src/app/[locale]/sobre/page.tsx
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return { title: `${t('title')} — Carol Orofino` }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  return (
    <div className="mx-auto max-w-4xl px-6 py-32">
      <h1 className="font-display text-4xl md:text-5xl text-primary tracking-wide mb-12">
        {t('title')}
      </h1>
      <div className="flex flex-col gap-8 max-w-2xl">
        <p className="font-body text-base text-dark leading-relaxed">
          {t('bio')}
        </p>
        <div>
          <h2 className="font-display text-2xl text-primary tracking-wide mb-4">
            {t('philosophy')}
          </h2>
          <p className="font-body text-base text-dark leading-relaxed italic">
            {t('philosophyText')}
          </p>
        </div>
      </div>
    </div>
  )
}
