// src/data/__tests__/services.test.ts
import { services } from '../services'

describe('services data', () => {
  it('should export an array of services', () => {
    expect(Array.isArray(services)).toBe(true)
    expect(services.length).toBeGreaterThan(0)
  })

  it('each service should have required translated fields', () => {
    services.forEach((s) => {
      expect(s.id).toBeTruthy()
      expect(s.translations.pt.title).toBeTruthy()
      expect(s.translations.en.title).toBeTruthy()
      expect(s.translations.es.title).toBeTruthy()
    })
  })
})
