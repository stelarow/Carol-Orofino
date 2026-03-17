'use client'

import { useState } from 'react'
import Image from 'next/image'
import { type Locale } from '@/lib/i18n'
import { type CategoryImage } from '@/data/categories'

interface Props {
  images: [CategoryImage, CategoryImage]
  locale: Locale
}

export default function CategoryGallery({ images, locale }: Props) {
  const [lightbox, setLightbox] = useState<CategoryImage | null>(null)

  return (
    <>
      <div className="flex justify-center px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
          {images.map((image) => (
            <div
              key={image.src}
              className="relative aspect-[4/3] md:aspect-[9/16] overflow-hidden cursor-zoom-in"
              onClick={() => setLightbox(image)}
            >
              <Image
                src={image.src}
                alt={image.alt[locale] ?? image.alt.pt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative aspect-[9/16] h-[90vh] max-h-[1920px] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.src}
              alt={lightbox.alt[locale] ?? lightbox.alt.pt}
              fill
              sizes="90vw"
              className="object-cover"
              priority
            />
            <button
              className="absolute top-4 right-4 z-10 text-white text-2xl leading-none w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              onClick={() => setLightbox(null)}
              aria-label="Fechar"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  )
}
