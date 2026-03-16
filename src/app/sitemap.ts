import { MetadataRoute } from 'next'
import { routing } from '@/lib/i18n'
import { getAllSlugs } from '@/data/projects'

const BASE_URL = 'https://carolorofino.com.br'

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = routing.locales
  const slugs = getAllSlugs()

  const staticRoutes = ['', '/projetos', '/sobre', '/servicos', '/contato']

  const staticEntries = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  )

  const projectEntries = locales.flatMap((locale) =>
    slugs.map((slug) => ({
      url: `${BASE_URL}/${locale}/projetos/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  return [...staticEntries, ...projectEntries]
}
