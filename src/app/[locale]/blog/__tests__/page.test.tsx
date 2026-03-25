import { render, screen } from '@testing-library/react'
import BlogPage from '../page'

// Mock next-intl
jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn().mockResolvedValue((key: string) => key),
}))

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

// Mock BlogSidebar
jest.mock('@/components/BlogSidebar', () => ({
  __esModule: true,
  default: () => <aside data-testid="blog-sidebar" />,
}))

// Mock posts
jest.mock('@/data/posts', () => ({
  posts: [
    {
      slug: 'post-with-image',
      date: '2025-03-20',
      readTime: 5,
      category: 'Luxo',
      image: '/images/blog/post-with-image.png',
      translations: {
        pt: { title: 'Post Com Imagem', subtitle: 'Subtítulo', sections: [], conclusion: '', cta: '' },
        en: { title: 'Post With Image', subtitle: 'Subtitle', sections: [], conclusion: '', cta: '' },
        es: { title: 'Post Con Imagen', subtitle: 'Subtítulo', sections: [], conclusion: '', cta: '' },
      },
    },
    {
      slug: 'post-without-image',
      date: '2025-03-10',
      readTime: 4,
      category: 'Minimalismo',
      image: undefined,
      translations: {
        pt: { title: 'Post Sem Imagem', subtitle: 'Subtítulo', sections: [], conclusion: '', cta: '' },
        en: { title: 'Post Without Image', subtitle: 'Subtitle', sections: [], conclusion: '', cta: '' },
        es: { title: 'Post Sin Imagen', subtitle: 'Subtítulo', sections: [], conclusion: '', cta: '' },
      },
    },
  ],
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      className,
    }: {
      children: React.ReactNode
      className?: string
    }) => <div className={className}>{children}</div>,
  },
}))

const defaultProps = {
  params: Promise.resolve({ locale: 'pt' }),
  searchParams: Promise.resolve({}),
}

describe('BlogPage — card images', () => {
  it('renders an img with the post image and localized alt text for posts with an image', async () => {
    const ui = await BlogPage(defaultProps)
    render(ui)
    const img = screen.getByRole('img', { name: 'Post Com Imagem' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/images/blog/post-with-image.png')
  })

  it('does not render an img for posts without an image', async () => {
    const ui = await BlogPage(defaultProps)
    render(ui)
    // Confirm the post card itself renders (guards against vacuous negative)
    expect(screen.getByText('Post Sem Imagem')).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: 'Post Sem Imagem' })).not.toBeInTheDocument()
  })
})
