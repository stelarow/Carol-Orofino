import { render, screen, fireEvent } from '@testing-library/react'
import Step1Identity from '../questionnaire/Step1Identity'

const messages = {
  name: 'Nome completo', whatsapp: 'WhatsApp', email: 'E-mail',
  namePlaceholder: 'Seu nome', whatsappPlaceholder: '(11) 99999-0000',
  emailPlaceholder: 'seu@email.com',
  nameError: 'Nome obrigatório', whatsappError: 'WhatsApp inválido', emailError: 'E-mail inválido',
}

const defaultData = { name: '', whatsapp: '', email: '' }

describe('Step1Identity', () => {
  it('shows name error when name is empty on submit attempt', () => {
    const onNext = jest.fn()
    render(<Step1Identity data={defaultData} onChange={jest.fn()} onNext={onNext} messages={messages} nextLabel="Próximo" />)
    fireEvent.click(screen.getByText('Próximo'))
    expect(screen.getByText('Nome obrigatório')).toBeInTheDocument()
    expect(onNext).not.toHaveBeenCalled()
  })

  it('calls onNext with valid data', () => {
    const onNext = jest.fn()
    render(<Step1Identity data={{ name: 'Ana', whatsapp: '11999990000', email: 'a@b.com' }} onChange={jest.fn()} onNext={onNext} messages={messages} nextLabel="Próximo" />)
    fireEvent.click(screen.getByText('Próximo'))
    expect(onNext).toHaveBeenCalled()
  })
})
