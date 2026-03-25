import { render, screen, fireEvent } from '@testing-library/react'
import Step2Environment from '../questionnaire/Step2Environment'

// Mock URL APIs (not available in jsdom)
beforeEach(() => {
  global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
  global.URL.revokeObjectURL = jest.fn()
})

const messages = {
  roomType: 'Ambiente', roomTypePlaceholder: '', roomOptions: { sala: 'Sala' },
  roomTypeError: 'Selecione um ambiente', area: 'Medidas', areaPlaceholder: '',
  floorPlan: 'Planta baixa', floorPlanHint: 'PDF, PNG ou JPG — máx. 10MB',
  photos: 'Fotos ou vídeos', photosHint: 'Múltiplos arquivos — máx. 50MB no total',
  fileTooLarge: 'Arquivo muito grande', fileInvalidType: 'Tipo inválido',
}

const defaultData = {
  roomType: [], area: '', floorPlanFile: null, photoFiles: [],
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
  describe('Zone 1: Floor plan drop zone', () => {
    it('zone 1: shows hint text when no file is selected', () => {
      renderStep()
      expect(screen.getByText('PDF, PNG ou JPG — máx. 10MB')).toBeInTheDocument()
    })

    it('zone 1: hidden file input is present in the DOM', () => {
      renderStep()
      const input = document.querySelector('input[accept=".pdf,.png,.jpg,.jpeg"]') as HTMLInputElement
      expect(input).toBeInTheDocument()
    })

    it('zone 1: shows error for invalid file type', () => {
      const { onChange } = renderStep()
      const input = document.querySelector('input[accept=".pdf,.png,.jpg,.jpeg"]') as HTMLInputElement
      const file = new File(['x'], 'doc.gif', { type: 'image/gif' })
      fireEvent.change(input, { target: { files: [file] } })
      expect(screen.getByText('Tipo inválido')).toBeInTheDocument()
      expect(onChange).not.toHaveBeenCalled()
    })

    it('zone 1: shows error for file exceeding 10 MB', () => {
      const { onChange } = renderStep()
      const input = document.querySelector('input[accept=".pdf,.png,.jpg,.jpeg"]') as HTMLInputElement
      const bigFile = new File(['x'], 'big.png', { type: 'image/png' })
      // jsdom ignores File content size — must override the property
      Object.defineProperty(bigFile, 'size', { value: 11 * 1024 * 1024 })
      fireEvent.change(input, { target: { files: [bigFile] } })
      expect(screen.getByText('Arquivo muito grande')).toBeInTheDocument()
      expect(onChange).not.toHaveBeenCalled()
    })

    it('zone 1: valid PNG calls onChange with the file and creates a blob URL', () => {
      const { onChange } = renderStep()
      const input = document.querySelector('input[accept=".pdf,.png,.jpg,.jpeg"]') as HTMLInputElement
      const file = new File(['x'], 'photo.png', { type: 'image/png' })
      fireEvent.change(input, { target: { files: [file] } })
      expect(URL.createObjectURL).toHaveBeenCalledTimes(1)
      expect(URL.createObjectURL).toHaveBeenCalledWith(file)
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ floorPlanFile: file }))
    })

    it('zone 1: cancelling the picker does not clear existing floorPlanFile', () => {
      const existingFile = new File(['x'], 'existing.png', { type: 'image/png' })
      const { onChange } = renderStep({ floorPlanFile: existingFile })
      const input = document.querySelector('input[accept=".pdf,.png,.jpg,.jpeg"]') as HTMLInputElement
      // Simulate cancel: files is empty/null
      fireEvent.change(input, { target: { files: [] } })
      // onChange must NOT be called with floorPlanFile: null
      expect(onChange).not.toHaveBeenCalled()
    })

    it('zone 1: dragEnter sets data-dragging to true on the drop zone', () => {
      renderStep()
      const zone = screen.getByText('PDF, PNG ou JPG — máx. 10MB')
        .closest('[data-testid="floor-plan-zone"]') as HTMLElement
      fireEvent.dragEnter(zone, { relatedTarget: null })
      expect(zone).toHaveAttribute('data-dragging', 'true')
    })
  })

  describe('Zone 2: Photos/videos drop zone', () => {
    it('zone 2: shows hint text when no files are selected', () => {
      renderStep()
      expect(screen.getByText('Múltiplos arquivos — máx. 50MB no total')).toBeInTheDocument()
    })

    it('zone 2: shows error for invalid file type', () => {
      const { onChange } = renderStep()
      const input = document.querySelector('input[data-testid="photos-input"]') as HTMLInputElement
      const file = new File(['x'], 'audio.mp3', { type: 'audio/mp3' })
      fireEvent.change(input, { target: { files: [file] } })
      expect(screen.getByText('Tipo inválido')).toBeInTheDocument()
      expect(onChange).not.toHaveBeenCalled()
    })

    it('zone 2: shows error when total size exceeds 50 MB', () => {
      const { onChange } = renderStep()
      const input = document.querySelector('input[data-testid="photos-input"]') as HTMLInputElement
      const bigFile = new File(['x'], 'big.jpg', { type: 'image/jpeg' })
      // jsdom ignores content size — override the property
      Object.defineProperty(bigFile, 'size', { value: 51 * 1024 * 1024 })
      fireEvent.change(input, { target: { files: [bigFile] } })
      expect(screen.getByText('Arquivo muito grande')).toBeInTheDocument()
      expect(onChange).not.toHaveBeenCalled()
    })

    it('zone 2: valid files call onChange and create blob URLs for images', () => {
      const { onChange } = renderStep()
      const input = document.querySelector('input[data-testid="photos-input"]') as HTMLInputElement
      const file1 = new File(['x'], 'a.jpg', { type: 'image/jpeg' })
      const file2 = new File(['x'], 'b.png', { type: 'image/png' })
      fireEvent.change(input, { target: { files: [file1, file2] } })
      expect(URL.createObjectURL).toHaveBeenCalledTimes(2)
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ photoFiles: [file1, file2] }))
    })

    it('zone 2: add-more input appends new files to existing selection', () => {
      const existingFile = new File(['x'], 'existing.jpg', { type: 'image/jpeg' })
      const { onChange } = renderStep({ photoFiles: [existingFile] })
      const addMoreInput = document.querySelector('input[data-testid="add-more-input"]') as HTMLInputElement
      const newFile = new File(['x'], 'new.png', { type: 'image/png' })
      fireEvent.change(addMoreInput, { target: { files: [newFile] } })
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ photoFiles: [existingFile, newFile] })
      )
    })

    it('zone 2: cumulative size check blocks append exceeding 50 MB', () => {
      const existingFile = new File(['x'], 'existing.jpg', { type: 'image/jpeg' })
      // jsdom ignores content size — override the property
      Object.defineProperty(existingFile, 'size', { value: 40 * 1024 * 1024 })
      const { onChange } = renderStep({ photoFiles: [existingFile] })
      const addMoreInput = document.querySelector('input[data-testid="add-more-input"]') as HTMLInputElement
      const newFile = new File(['x'], 'new.jpg', { type: 'image/jpeg' })
      Object.defineProperty(newFile, 'size', { value: 15 * 1024 * 1024 })
      fireEvent.change(addMoreInput, { target: { files: [newFile] } })
      expect(screen.getByText('Arquivo muito grande')).toBeInTheDocument()
      expect(onChange).not.toHaveBeenCalled()
    })
  })
})
