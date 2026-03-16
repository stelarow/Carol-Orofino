import Image from 'next/image'
import { type ProjectImage } from '@/data/projects'
import { type Locale } from '@/lib/i18n'

interface ProjectGalleryProps {
  images: ProjectImage[]
  locale: Locale
}

export default function ProjectGallery({ images, locale }: ProjectGalleryProps) {
  if (images.length === 0) return null

  const [first, ...rest] = images

  return (
    <div className="flex flex-col gap-px">
      {/* First image: full width, landscape */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-neutral">
        <Image
          src={first.src}
          alt={first.altText[locale]}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Remaining images: 2-column portrait grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-2 gap-px">
          {rest.map((image, index) => (
            <div key={index} className="relative aspect-[3/4] overflow-hidden bg-neutral">
              <Image
                src={image.src}
                alt={image.altText[locale]}
                fill
                sizes="(max-width: 768px) 50vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
