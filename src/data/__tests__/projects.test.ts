import { projects, getFeaturedProjects, getProjectBySlug } from '../projects'

describe('projects data', () => {
  it('should export an array of projects', () => {
    expect(Array.isArray(projects)).toBe(true)
    expect(projects.length).toBeGreaterThan(0)
  })

  it('each project should have required fields', () => {
    projects.forEach((p) => {
      expect(p.slug).toBeTruthy()
      expect(p.category).toMatch(/^(residencial|comercial|reforma|design-de-interiores)$/)
      expect(typeof p.year).toBe('number')
      expect(p.coverImage).toBeTruthy()
      expect(p.translations.pt.title).toBeTruthy()
      expect(p.translations.en.title).toBeTruthy()
      expect(p.translations.es.title).toBeTruthy()
    })
  })

  it('getFeaturedProjects should return only featured projects', () => {
    const featured = getFeaturedProjects()
    featured.forEach((p) => expect(p.featured).toBe(true))
  })

  it('getProjectBySlug should return correct project or null', () => {
    const first = projects[0]
    expect(getProjectBySlug(first.slug)).toEqual(first)
    expect(getProjectBySlug('nonexistent-slug')).toBeNull()
  })
})
