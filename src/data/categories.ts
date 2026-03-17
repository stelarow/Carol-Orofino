// src/data/categories.ts

export type CategorySlug =
  | 'residencial'
  | 'comercial'
  | 'reforma'
  | 'design-de-interiores'
  | 'projetos'

export interface CategoryImage {
  src: string
  mobileSrc?: string
  alt: { pt: string; en: string; es: string }
}

// Typed as readonly CategorySlug[] so it can be used directly in generateStaticParams
export const KNOWN_SLUGS: readonly CategorySlug[] = [
  'residencial',
  'comercial',
  'reforma',
  'design-de-interiores',
  'projetos',
]

// Hero image shown at the top of each subcategory page.
// Replace placeholder paths with real images when provided by client.
export const categoryHeroImages: Record<CategorySlug, CategoryImage> = {
  residencial: {
    src: '/images/categories/residencial-hero.jpg',
    mobileSrc: '/images/categories/residencial-hero-mobile.jpg',
    alt: { pt: 'Projeto residencial', en: 'Residential project', es: 'Proyecto residencial' },
  },
  comercial: {
    src: '/images/categories/comercial-hero.jpg',
    mobileSrc: '/images/categories/comercial-hero-mobile.jpg',
    alt: { pt: 'Projeto comercial', en: 'Commercial project', es: 'Proyecto comercial' },
  },
  reforma: {
    src: '/images/categories/reforma-hero.jpg',
    alt: { pt: 'Reforma', en: 'Renovation', es: 'Reforma' },
  },
  'design-de-interiores': {
    src: '/images/categories/design-interiores-hero.jpg',
    mobileSrc: '/images/categories/design-interiores-hero-mobile.jpg',
    alt: { pt: 'Design de interiores', en: 'Interior design', es: 'Diseño de interiores' },
  },
  projetos: {
    src: '/images/categories/projetos-hero.png',
    mobileSrc: '/images/categories/projetos-hero-mobile.png',
    alt: { pt: 'Edifício residencial e comercial moderno ao anoitecer', en: 'Modern residential and commercial building at dusk', es: 'Edificio residencial y comercial moderno al anochecer' },
  },
}

// Each entry has EXACTLY 2 images — enforced by the tuple type [CategoryImage, CategoryImage].
// Replace placeholder paths and alt texts with real content when provided by client.
export const categoryImages: Record<CategorySlug, [CategoryImage, CategoryImage]> = {
  residencial: [
    {
      src: '/images/categories/residencial-01.jpg',
      alt: {
        pt: 'Projeto residencial 1',
        en: 'Residential project 1',
        es: 'Proyecto residencial 1',
      },
    },
    {
      src: '/images/categories/residencial-02.jpg',
      alt: {
        pt: 'Projeto residencial 2',
        en: 'Residential project 2',
        es: 'Proyecto residencial 2',
      },
    },
  ],
  comercial: [
    {
      src: '/images/categories/comercial-01.jpg',
      alt: {
        pt: 'Projeto comercial 1',
        en: 'Commercial project 1',
        es: 'Proyecto comercial 1',
      },
    },
    {
      src: '/images/categories/comercial-02.jpg',
      alt: {
        pt: 'Projeto comercial 2',
        en: 'Commercial project 2',
        es: 'Proyecto comercial 2',
      },
    },
  ],
  reforma: [
    {
      src: '/images/categories/reforma-01.jpg',
      alt: {
        pt: 'Reforma 1',
        en: 'Renovation 1',
        es: 'Reforma 1',
      },
    },
    {
      src: '/images/categories/reforma-02.jpg',
      alt: {
        pt: 'Reforma 2',
        en: 'Renovation 2',
        es: 'Reforma 2',
      },
    },
  ],
  'design-de-interiores': [
    {
      src: '/images/categories/design-interiores-01.jpg',
      alt: {
        pt: 'Design de interiores 1',
        en: 'Interior design 1',
        es: 'Diseño de interiores 1',
      },
    },
    {
      src: '/images/categories/design-interiores-02.jpg',
      alt: {
        pt: 'Design de interiores 2',
        en: 'Interior design 2',
        es: 'Diseño de interiores 2',
      },
    },
  ],
  projetos: [
    {
      src: '/images/categories/projetos-01.png',
      alt: {
        pt: 'Sala de estar moderna com sofá bege e jardim externo',
        en: 'Modern living room with beige sofa and outdoor garden',
        es: 'Sala de estar moderna con sofá beige y jardín exterior',
      },
    },
    {
      src: '/images/categories/projetos-02.png',
      alt: {
        pt: 'Sala integrada com adegas em madeira e sofá branco',
        en: 'Open-plan living room with wood wine rack and white sofa',
        es: 'Sala integrada con bodega de madera y sofá blanco',
      },
    },
  ],
}
