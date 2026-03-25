import { buildClientEmailHtml } from '../questionnaireUtils'

describe('buildClientEmailHtml', () => {
  it('returns correct Portuguese subject', () => {
    const { subject } = buildClientEmailHtml({ name: 'Ana', roomType: ['sala'], styles: [] }, 'pt')
    expect(subject).toBe('Recebemos seu questionário — Carol Orofino')
  })

  it('returns correct English subject', () => {
    const { subject } = buildClientEmailHtml({ name: 'Ana', roomType: ['sala'], styles: [] }, 'en')
    expect(subject).toBe('We received your questionnaire — Carol Orofino')
  })

  it('returns correct Spanish subject', () => {
    const { subject } = buildClientEmailHtml({ name: 'Ana', roomType: ['sala'], styles: [] }, 'es')
    expect(subject).toBe('Recibimos tu cuestionario — Carol Orofino')
  })

  it('falls back to pt for unknown locale', () => {
    const { subject } = buildClientEmailHtml({ name: 'Ana', roomType: ['sala'], styles: [] }, 'fr')
    expect(subject).toBe('Recebemos seu questionário — Carol Orofino')
  })

  it('includes the client name in html', () => {
    const { html } = buildClientEmailHtml({ name: 'Maria', roomType: ['quarto'], styles: ['moderno'] }, 'pt')
    expect(html).toContain('Maria')
  })

  it('includes room types in html', () => {
    const { html } = buildClientEmailHtml({ name: 'Ana', roomType: ['sala', 'cozinha'], styles: [] }, 'pt')
    expect(html).toContain('sala, cozinha')
  })

  it('shows em dash when no styles selected', () => {
    const { html } = buildClientEmailHtml({ name: 'Ana', roomType: ['sala'], styles: [] }, 'pt')
    expect(html).toContain('—')
  })

  it('escapes HTML in name', () => {
    const { html } = buildClientEmailHtml({ name: '<script>alert(1)</script>', roomType: ['sala'], styles: [] }, 'pt')
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })
})
