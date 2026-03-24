import { render, screen } from '@testing-library/react'
import Breadcrumb from '../Breadcrumb'

// Mock next/link — Breadcrumb uses Link for navigation items
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('Breadcrumb', () => {
  it('renders all item labels', () => {
    render(<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/pt/blog' }, { label: 'Post Title' }]} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(screen.getByText('Post Title')).toBeInTheDocument()
  })

  it('links items that have href', () => {
    render(<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/pt/blog' }, { label: 'Post Title' }]} />)
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/pt/blog')
  })

  it('last item has no link and aria-current="page"', () => {
    render(<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Post Title' }]} />)
    expect(screen.queryByRole('link', { name: 'Post Title' })).not.toBeInTheDocument()
    expect(screen.getByText('Post Title')).toHaveAttribute('aria-current', 'page')
  })

  it('renders separators between items', () => {
    // NOTE: the separator character is U+203A (›). Ensure your editor saves this file as UTF-8.
    render(<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />)
    expect(screen.getByText('›')).toBeInTheDocument()
  })

  it('nav has aria-label="breadcrumb"', () => {
    render(<Breadcrumb items={[{ label: 'Home', href: '/' }]} />)
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument()
  })
})
