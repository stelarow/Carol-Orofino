import { projects, getFeaturedProjects, getProjectBySlug, getProjectsByCategory } from '../projects'

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

  it('getProjectsByCategory should return projects matching the given category', () => {
    const residencial = getProjectsByCategory('residencial')
    residencial.forEach((p) => expect(p.category).toBe('residencial'))
  })

  it('getProjectsByCategory with "projetos" should return all projects', () => {
    // 'projetos' is a special slug — no Project has category:'projetos',
    // so the function returns the full array as a special case
    const all = getProjectsByCategory('projetos')
    expect(all).toEqual(projects)
  })

  it('getProjectsByCategory should return empty array for a category with no projects', () => {
    // 'design-de-interiores' may have zero projects — that is a valid empty result
    const result = getProjectsByCategory('design-de-interiores')
    expect(Array.isArray(result)).toBe(true)
    result.forEach((p) => expect(p.category).toBe('design-de-interiores'))
  })
})
