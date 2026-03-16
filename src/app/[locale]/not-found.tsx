// src/app/[locale]/not-found.tsx
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'

export default async function NotFound() {
  let locale = 'pt'
  let notFoundTitle = 'Página não encontrada'
  let notFoundDesc = 'A página que você procura não existe.'
  let notFoundBack = 'Voltar ao início'

  try {
    locale = await getLocale()
    const t = await getTranslations({ locale, namespace: 'notFound' })
    notFoundTitle = t('title')
    notFoundDesc = t('description')
    notFoundBack = t('back')
  } catch {
    // Fallback to Portuguese defaults if locale context unavailable
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-6xl text-primary tracking-wide">404</h1>
      <p className="mt-4 font-body text-lg text-text-primary">{notFoundTitle}</p>
      <p className="mt-2 font-body text-sm text-text-primary/50">{notFoundDesc}</p>
      <Link
        href={`/${locale}`}
        className="mt-8 font-body text-xs uppercase tracking-widest border-b border-text-primary pb-0.5 text-text-primary hover:text-primary hover:border-primary"
      >
        {notFoundBack}
      </Link>
    </div>
  )
}
