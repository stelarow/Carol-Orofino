import { render, screen } from '@testing-library/react'
import RelatedPosts from '../RelatedPosts'

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn().mockResolvedValue((key: string) => {
    const map: Record<string, string> = { relatedPostsTitle: 'Continue Lendo' }
    return map[key] ?? key
  }),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

jest.mock('@/data/posts', () => ({
  posts: [
    { slug: 'post-a', date: '2025-01-01', readTime: 5, category: 'Luxo', image: '/a.jpg', translations: { pt: { title: 'Post A' }, en: { title: 'Post A EN' }, es: { title: 'Post A ES' } } },
    { slug: 'post-b', date: '2025-03-20', readTime: 4, category: 'Minimalismo', image: '/b.jpg', translations: { pt: { title: 'Post B' }, en: { title: 'Post B EN' }, es: { title: 'Post B ES' } } },
    { slug: 'post-c', date: '2025-03-10', readTime: 6, category: 'Luxo', image: '/c.jpg', translations: { pt: { title: 'Post C' }, en: { title: 'Post C EN' }, es: { title: 'Post C ES' } } },
    { slug: 'post-d', date: '2025-02-15', readTime: 3, category: 'Design Escandinavo', image: '/d.jpg', translations: { pt: { title: 'Post D' }, en: { title: 'Post D EN' }, es: { title: 'Post D ES' } } },
  ],
}))

describe('RelatedPosts', () => {
  it('renders section heading from translation', async () => {
    const ui = await RelatedPosts({ locale: 'pt', currentSlug: 'post-a' })
    render(ui)
    expect(screen.getByText('Continue Lendo')).toBeInTheDocument()
  })

  it('excludes currentSlug from results', async () => {
    const ui = await RelatedPosts({ locale: 'pt', currentSlug: 'post-b' })
    render(ui)
    expect(screen.queryByText('Post B')).not.toBeInTheDocument()
  })

  it('shows up to 3 most recent posts', async () => {
    const ui = await RelatedPosts({ locale: 'pt', currentSlug: 'post-a' })
    render(ui)
    // post-b (2025-03-20), post-c (2025-03-10), post-d (2025-02-15) — most recent 3 excluding post-a
    expect(screen.getByText('Post B')).toBeInTheDocument()
    expect(screen.getByText('Post C')).toBeInTheDocument()
    expect(screen.getByText('Post D')).toBeInTheDocument()
  })

  it('links each card to the correct post URL', async () => {
    const ui = await RelatedPosts({ locale: 'pt', currentSlug: 'post-a' })
    render(ui)
    const link = screen.getAllByRole('link').find(l => l.getAttribute('href') === '/pt/blog/post-b')
    expect(link).toBeTruthy()
  })

  it('renders titles in the correct locale', async () => {
    const ui = await RelatedPosts({ locale: 'en', currentSlug: 'post-a' })
    render(ui)
    expect(screen.getByText('Post B EN')).toBeInTheDocument()
  })

  it('renders nothing when currentSlug is the only post', async () => {
    // Mutate the mock temporarily so only one post exists
    const postsMock = jest.requireMock('@/data/posts')
    const saved = postsMock.posts
    postsMock.posts = [{ slug: 'only', date: '2025-01-01', readTime: 5, category: 'Luxo', image: '/x.jpg', translations: { pt: { title: 'Only' }, en: { title: 'Only' }, es: { title: 'Only' } } }]
    const ui = await RelatedPosts({ locale: 'pt', currentSlug: 'only' })
    expect(ui).toBeNull()
    postsMock.posts = saved // restore
  })
})
