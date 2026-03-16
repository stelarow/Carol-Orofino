export interface ProjectImage {
  src: string
  altText: {
    pt: string
    en: string
    es: string
  }
}

export interface Project {
  slug: string
  category: 'residencial' | 'comercial' | 'reforma' | 'consultoria'
  year: number
  location: string
  coverImage: string
  coverImageAlt: {
    pt: string
    en: string
    es: string
  }
  coverImageBlurDataURL: string
  images: ProjectImage[]
  featured: boolean
  translations: {
    pt: { title: string; description: string }
    en: { title: string; description: string }
    es: { title: string; description: string }
  }
}

// Minimal base64 blur placeholder (1x1 beige pixel)
const BLUR_PLACEHOLDER =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoH' +
  'BwYIDAoMCwsKCwsNCxAQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/wAAR' +
  'CAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAA' +
  'AAAAAAAAAAAAAAAAP/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAA' +
  'AAAAAAAAAAD/2gAMAwEAAhEDEQA/AJIAP//Z'

export const projects: Project[] = [
  {
    slug: 'apartamento-jardins',
    category: 'residencial',
    year: 2024,
    location: 'São Paulo, SP',
    coverImage: '/images/projects/apartamento-jardins/cover.jpg',
    coverImageAlt: {
      pt: 'Sala de estar com sofá bege e detalhes em madeira natural',
      en: 'Living room with beige sofa and natural wood details',
      es: 'Sala de estar con sofá beige y detalles en madera natural',
    },
    coverImageBlurDataURL: BLUR_PLACEHOLDER,
    images: [
      {
        src: '/images/projects/apartamento-jardins/01.jpg',
        altText: {
          pt: 'Vista da sala de jantar integrada',
          en: 'Integrated dining room view',
          es: 'Vista del comedor integrado',
        },
      },
    ],
    featured: true,
    translations: {
      pt: {
        title: 'Apartamento Jardins',
        description:
          'Projeto residencial que une sofisticação escandinava com elementos brasileiros, criando um ambiente acolhedor e atemporal.',
      },
      en: {
        title: 'Jardins Apartment',
        description:
          'Residential project uniting Scandinavian sophistication with Brazilian elements, creating a welcoming and timeless space.',
      },
      es: {
        title: 'Apartamento Jardins',
        description:
          'Proyecto residencial que une sofisticación escandinava con elementos brasileños, creando un ambiente acogedor y atemporal.',
      },
    },
  },
  {
    slug: 'escritorio-itaim',
    category: 'comercial',
    year: 2023,
    location: 'São Paulo, SP',
    coverImage: '/images/projects/escritorio-itaim/cover.jpg',
    coverImageAlt: {
      pt: 'Escritório moderno com iluminação natural e móveis minimalistas',
      en: 'Modern office with natural lighting and minimalist furniture',
      es: 'Oficina moderna con iluminación natural y muebles minimalistas',
    },
    coverImageBlurDataURL: BLUR_PLACEHOLDER,
    images: [
      {
        src: '/images/projects/escritorio-itaim/01.jpg',
        altText: {
          pt: 'Área de reuniões com mesa de vidro',
          en: 'Meeting area with glass table',
          es: 'Área de reuniones con mesa de vidrio',
        },
      },
    ],
    featured: true,
    translations: {
      pt: {
        title: 'Escritório Itaim',
        description:
          'Projeto comercial focado em produtividade e bem-estar, com materiais nobres e paleta neutra.',
      },
      en: {
        title: 'Itaim Office',
        description:
          'Commercial project focused on productivity and well-being, with noble materials and a neutral palette.',
      },
      es: {
        title: 'Oficina Itaim',
        description:
          'Proyecto comercial enfocado en productividad y bienestar, con materiales nobles y paleta neutra.',
      },
    },
  },
  {
    slug: 'casa-higienopolis',
    category: 'reforma',
    year: 2024,
    location: 'São Paulo, SP',
    coverImage: '/images/projects/casa-higienopolis/cover.jpg',
    coverImageAlt: {
      pt: 'Casa reformada com fachada renovada e jardim frontal',
      en: 'Renovated house with updated facade and front garden',
      es: 'Casa reformada con fachada renovada y jardín frontal',
    },
    coverImageBlurDataURL: BLUR_PLACEHOLDER,
    images: [],
    featured: true,
    translations: {
      pt: {
        title: 'Casa Higienópolis',
        description:
          'Reforma completa de residência dos anos 1960, respeitando a arquitetura original e incorporando conforto contemporâneo.',
      },
      en: {
        title: 'Higienópolis House',
        description:
          "Complete renovation of a 1960s residence, respecting the original architecture while incorporating contemporary comfort.",
      },
      es: {
        title: 'Casa Higienópolis',
        description:
          'Reforma completa de residencia de los años 1960, respetando la arquitectura original e incorporando comodidad contemporánea.',
      },
    },
  },
]

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured)
}

export function getProjectBySlug(slug: string): Project | null {
  return projects.find((p) => p.slug === slug) ?? null
}

export function getAllSlugs(): string[] {
  return projects.map((p) => p.slug)
}
