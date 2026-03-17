// src/app/[locale]/projetos/ProjectsList.tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { type Project } from '@/data/projects'
import { type Locale } from '@/lib/i18n'
import ProjectCard from '@/components/ProjectCard'
import CategoryFilter from '@/components/CategoryFilter'

type Category = Project['category'] | 'all'

interface ProjectsListProps {
  projects: Project[]
  locale: Locale
}

export default function ProjectsList({ projects, locale }: ProjectsListProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const t = useTranslations('projects')

  const filtered =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 mb-6">
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-16 grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} locale={locale} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="py-20 text-center font-body text-sm text-text-primary/50">
          {t('noResults')}
        </p>
      )}
    </>
  )
}
