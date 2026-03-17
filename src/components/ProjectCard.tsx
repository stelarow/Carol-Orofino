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
      <div className="relative aspect-[16/10] overflow-hidden bg-stone">
        <Image
          src={project.coverImage}
          alt={altText}
          fill
          sizes="(max-width: 768px) 100vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          placeholder="blur"
          blurDataURL={project.coverImageBlurDataURL}
        />
        {/* Gradient overlay — stronger at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
        {/* Bottom-left label */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-4">
          <p className="font-display text-2xl md:text-3xl text-white tracking-wide leading-tight">
            {title}
          </p>
          <p className="font-body text-[11px] text-white/60 uppercase tracking-widest mt-1">
            {project.location} · {project.year}
          </p>
        </div>
      </div>
    </Link>
  )
}
