import { render } from '@testing-library/react'
import { SectionDivider } from '../SectionDivider'

// Framer Motion uses browser APIs not available in jsdom — mock it
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div className={className}>{children}</div>
    ),
  },
}))

describe('SectionDivider', () => {
  it('renders a decorative span element', () => {
    const { container } = render(<SectionDivider />)
    const span = container.querySelector('span')
    expect(span).toBeInTheDocument()
  })

  it('applies the walnut gradient classes to the span', () => {
    const { container } = render(<SectionDivider />)
    const span = container.querySelector('span')
    expect(span?.className).toContain('via-walnut')
    expect(span?.className).toContain('bg-gradient-to-r')
  })

  it('accepts and applies a custom className to the wrapper', () => {
    const { container } = render(<SectionDivider className="my-custom" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper?.className).toContain('my-custom')
  })
})
