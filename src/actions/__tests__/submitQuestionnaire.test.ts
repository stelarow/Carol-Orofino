import { normalizeWhatsApp, buildEmailHtml } from '../questionnaireUtils'

describe('normalizeWhatsApp', () => {
  it('strips formatting and adds 55 prefix', () => {
    expect(normalizeWhatsApp('(11) 99999-0000')).toBe('5511999990000')
  })

  it('does not double-add 55 prefix', () => {
    expect(normalizeWhatsApp('5511999990000')).toBe('5511999990000')
  })

  it('strips +55 and keeps digits', () => {
    expect(normalizeWhatsApp('+55 11 99999-0000')).toBe('5511999990000')
  })
})

describe('buildEmailHtml', () => {
  it('includes client name in subject line', () => {
    const html = buildEmailHtml({
      name: 'Ana Silva',
      whatsapp: '5511999990000',
      email: 'ana@test.com',
      roomType: ['sala'],
      area: '35 m²',
      floorPlanUrl: null,
      photoUrls: [],
      styles: ['minimalista'],
      mustHave: 'Mesa grande',
      scopeType: 'projeto3d',
      urgency: 'imediata',
      budget: '10a30k',
    })
    expect(html).toContain('Ana Silva')
    expect(html).toContain('wa.me/5511999990000')
  })
})
