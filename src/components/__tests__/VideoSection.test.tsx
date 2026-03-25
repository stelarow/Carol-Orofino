// src/components/__tests__/VideoSection.test.tsx
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import VideoSection from '../VideoSection'

// Framer Motion usa APIs de browser não disponíveis em jsdom
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div className={className}>{children}</div>
    ),
  },
}))

// IntersectionObserver não existe em jsdom
const mockObserve = jest.fn()
const mockDisconnect = jest.fn()
beforeEach(() => {
  mockObserve.mockClear()
  mockDisconnect.mockClear()
  ;(global as any).IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
  }))
})

// HTMLVideoElement.play retorna Promise em browsers; jsdom não implementa
Object.defineProperty(HTMLVideoElement.prototype, 'play', {
  writable: true,
  value: jest.fn().mockResolvedValue(undefined),
})
Object.defineProperty(HTMLVideoElement.prototype, 'pause', {
  writable: true,
  value: jest.fn(),
})

describe('VideoSection', () => {
  it('renderiza um elemento <video> com muted e playsInline', () => {
    const { container } = render(<VideoSection />)
    const video = container.querySelector('video')
    expect(video).toBeInTheDocument()
    expect(video?.muted).toBe(true)
    expect(video).toHaveAttribute('playsInline')
  })

  it('não exibe controles nativos no vídeo', () => {
    const { container } = render(<VideoSection />)
    const video = container.querySelector('video')
    expect(video).not.toHaveAttribute('controls')
  })

  it('a seção raiz tem aria-hidden="true"', () => {
    const { container } = render(<VideoSection />)
    const section = container.querySelector('section')
    expect(section).toHaveAttribute('aria-hidden', 'true')
  })

  it('não exibe a tela de encerramento inicialmente', () => {
    const { queryByText } = render(<VideoSection />)
    expect(queryByText('Ambientes que revelam quem você é.')).not.toBeInTheDocument()
  })

  it('exibe a tela de encerramento quando o vídeo termina', () => {
    const { container, getByText } = render(<VideoSection />)
    const video = container.querySelector('video')!
    fireEvent.ended(video)
    expect(getByText('Ambientes que revelam quem você é.')).toBeInTheDocument()
  })

  it('registra o IntersectionObserver ao montar', () => {
    render(<VideoSection />)
    expect(global.IntersectionObserver).toHaveBeenCalledTimes(1)
    expect(mockObserve).toHaveBeenCalledTimes(1)
  })

  it('chama disconnect ao desmontar', () => {
    const { unmount } = render(<VideoSection />)
    unmount()
    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })
})
