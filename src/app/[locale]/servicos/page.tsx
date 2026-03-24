// src/app/[locale]/servicos/page.tsx
import { getTranslations } from 'next-intl/server'
import { services } from '@/data/services'
import { type Locale } from '@/lib/i18n'
import type { Metadata } from 'next'
import { SectionDivider } from '@/components/SectionDivider'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'services' })
  return { title: `${t('title')} — Carol Orofino` }
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'services' })

  return (
    <div className="mx-auto max-w-5xl px-6 py-32">
      <h1 className="font-display text-4xl md:text-5xl text-primary tracking-wide mb-16">
        {t('title')}
      </h1>
      <SectionDivider />
      <div className="grid grid-cols-1 gap-px bg-sage md:grid-cols-2">
        {services.map((service) => {
          const translation = service.translations[locale as Locale]
          return (
            <div key={service.id} className="bg-background p-8">
              <h2 className="font-display text-2xl text-text-primary tracking-wide mb-4">
                {translation.title}
              </h2>
              <p className="font-body text-base text-dark leading-relaxed">
                {translation.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
