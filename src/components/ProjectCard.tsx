import Link from 'next/link'
import Image from 'next/image'
import { type Project } from '@/data/projects'
import { type Locale } from '@/lib/i18n'

interface ProjectCardProps {
  project: Project
  locale: Locale
}

export default function ProjectCard({ project, locale }: ProjectCardProps) {
  const title = project.translations[locale].title
  const altText = project.coverImageAlt[locale]
  const href = `/${locale}/projetos/${project.slug}`

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[3/4] md:aspect-[16/9] overflow-hidden bg-stone">
        <Image
          src={project.coverImage}
          alt={altText}
          fill
          sizes="(max-width: 768px) 100vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          placeholder="blur"
          blurDataURL={project.coverImageBlurDataURL}
        />
        {/* Permanent dark overlay */}
        <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/55" />
        {/* Centered label */}
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
          <p className="font-display text-2xl md:text-3xl text-white tracking-wide">
            {title}
          </p>
        </div>
      </div>
    </Link>
  )
}
