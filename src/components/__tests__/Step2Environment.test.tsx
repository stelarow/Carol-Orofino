import { render, screen, fireEvent } from '@testing-library/react'
import Step2Environment from '../questionnaire/Step2Environment'

const messages = {
  roomType: 'Ambiente', roomTypePlaceholder: '', roomOptions: { sala: 'Sala', quarto: 'Quarto' },
  roomTypeError: 'Selecione um ambiente', area: 'Medidas', areaPlaceholder: 'Ex: 20m²',
}

const defaultData = {
  roomType: [], area: '',
}

function renderStep(overrides = {}) {
  const onChange = jest.fn()
  const onNext = jest.fn()
  const onBack = jest.fn()
  render(
    <Step2Environment
      data={{ ...defaultData, ...overrides }}
      onChange={onChange}
      onNext={onNext}
      onBack={onBack}
      messages={messages}
      nextLabel="Próximo"
      backLabel="Voltar"
    />
  )
  return { onChange, onNext, onBack }
}

describe('Step2Environment', () => {
  it('renders room type chips', () => {
    renderStep()
    expect(screen.getByText('Sala')).toBeInTheDocument()
    expect(screen.getByText('Quarto')).toBeInTheDocument()
  })

  it('toggles room type selection on chip click', () => {
    const { onChange } = renderStep()
    fireEvent.click(screen.getByText('Sala'))
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ roomType: ['sala'] }))
  })

  it('deselects a previously selected room type', () => {
    const { onChange } = renderStep({ roomType: ['sala'] })
    fireEvent.click(screen.getByText('Sala'))
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ roomType: [] }))
  })

  it('shows validation error when no room type is selected and Next is clicked', () => {
    const { onNext } = renderStep()
    fireEvent.click(screen.getByText('Próximo'))
    expect(screen.getByText('Selecione um ambiente')).toBeInTheDocument()
    expect(onNext).not.toHaveBeenCalled()
  })

  it('calls onNext when validation passes', () => {
    const { onNext } = renderStep({ roomType: ['sala'] })
    fireEvent.click(screen.getByText('Próximo'))
    expect(onNext).toHaveBeenCalled()
  })

  it('calls onBack when back button is clicked', () => {
    const { onBack } = renderStep()
    fireEvent.click(screen.getByText('← Voltar'))
    expect(onBack).toHaveBeenCalled()
  })

  it('updates area on textarea change', () => {
    const { onChange } = renderStep()
    fireEvent.change(screen.getByPlaceholderText('Ex: 20m²'), { target: { value: '30m²' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ area: '30m²' }))
  })
})
