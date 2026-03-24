import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n'

interface AuthorBlockProps {
  locale: Locale
  date: string
  readTime: number
}

export default async function AuthorBlock({ locale, date, readTime }: AuthorBlockProps) {
  const t = await getTranslations({ locale, namespace: 'blog' })

  const localeCode =
    locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US'

  const formattedDate = new Date(date).toLocaleDateString(localeCode, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex items-center gap-4 py-6 px-6 max-w-6xl mx-auto border-b border-stone">
      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-sand">
        <Image
          src="/images/carol-profile.jpg"
          alt="Carol Orofino"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="font-body text-sm text-dark font-medium">Carol Orofino</p>
        <p className="font-body text-xs text-sage">{t('authorRole')}</p>
        <p className="font-body text-xs text-sage">
          {formattedDate} · {readTime} {t('minRead')}
        </p>
      </div>
    </div>
  )
}
