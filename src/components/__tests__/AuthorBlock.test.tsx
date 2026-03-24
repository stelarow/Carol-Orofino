import { render, screen } from '@testing-library/react'
import AuthorBlock from '../AuthorBlock'

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn().mockResolvedValue((key: string) => {
    const map: Record<string, string> = {
      authorRole: 'Especialista em Design de Interiores',
      minRead: 'min de leitura',
    }
    return map[key] ?? key
  }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

describe('AuthorBlock', () => {
  it('renders author name', async () => {
    const ui = await AuthorBlock({ locale: 'pt', date: '2025-03-18', readTime: 5 })
    render(ui)
    expect(screen.getByText('Carol Orofino')).toBeInTheDocument()
  })

  it('renders author role from translation', async () => {
    const ui = await AuthorBlock({ locale: 'pt', date: '2025-03-18', readTime: 5 })
    render(ui)
    expect(screen.getByText('Especialista em Design de Interiores')).toBeInTheDocument()
  })

  it('renders read time with minRead label', async () => {
    const ui = await AuthorBlock({ locale: 'pt', date: '2025-03-18', readTime: 7 })
    render(ui)
    // readTime and minRead are rendered in the same <p>, so match the combined text
    expect(screen.getByText(/7.*min de leitura/)).toBeInTheDocument()
  })

  it('renders profile image', async () => {
    const ui = await AuthorBlock({ locale: 'pt', date: '2025-03-18', readTime: 5 })
    render(ui)
    expect(screen.getByAltText('Carol Orofino')).toBeInTheDocument()
  })
})
