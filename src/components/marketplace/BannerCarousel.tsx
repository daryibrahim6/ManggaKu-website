'use client'

import { useState, useCallback, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

const banners = [
  {
    id: 1,
    title: 'Mangga Segar dari Kebun',
    subtitle: 'Diskon 20% untuk pembelian pertama',
    bgColor: 'bg-primary-600',
    textColor: 'text-white',
    image: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=600&h=300&fit=crop',
  },
  {
    id: 2,
    title: 'Produk Olahan UMKM',
    subtitle: 'Jus, manisan, keripik mangga berkualitas',
    bgColor: 'bg-secondary-500',
    textColor: 'text-white',
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&h=300&fit=crop',
  },
  {
    id: 3,
    title: 'Bulk untuk Reseller',
    subtitle: 'Harga spesial untuk pembelian grosir',
    bgColor: 'bg-neutral-800',
    textColor: 'text-white',
    image: 'https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?w=600&h=300&fit=crop',
  },
]

export function BannerCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={cn(
                'min-w-full relative overflow-hidden',
                banner.bgColor,
                banner.textColor
              )}
            >
              <div className="absolute inset-0">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover opacity-40"
                  width={600}
                  height={300}
                />
              </div>
              <div className="relative z-10 p-8 md:p-12">
                <h2 className="font-display text-2xl md:text-3xl font-bold">{banner.title}</h2>
                <p className="mt-2 text-sm md:text-base opacity-90">{banner.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-neutral-200"
        onClick={scrollPrev}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-neutral-200"
        onClick={scrollNext}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            className={cn(
              'w-2 h-2 rounded-full transition-colors',
              i === selectedIndex ? 'bg-white' : 'bg-white/50'
            )}
            onClick={() => emblaApi?.scrollTo(i)}
          />
        ))}
      </div>
    </div>
  )
}
