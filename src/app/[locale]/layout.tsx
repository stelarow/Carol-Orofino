// src/app/[locale]/layout.tsx
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/lib/i18n'
import NavbarWrapper from '@/components/NavbarWrapper'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Carol Orofino — Design de Interiores',
  description: 'Design de Interiores que transforma espaços em experiências.',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  const messages = await getMessages()
  const t = await getTranslations({ locale, namespace: 'contact' })

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="flex min-h-screen flex-col">
        <NavbarWrapper />
        <main className="fade-in flex-1">{children}</main>
        <Footer />
      </div>

    </NextIntlClientProvider>
  )
}
