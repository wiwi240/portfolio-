"use client"

import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
interface GalleryItem {
  id: string
  title: string
  summary: string
  url: string
  image: string
}

interface Gallery6Props {
  heading?: string
  demoUrl?: string
  demoLabel?: string
  items?: GalleryItem[]
  onNavigateToSection?: (sectionId: string) => void
}

const Gallery6 = ({
  heading,
  demoUrl = 'contact',
  demoLabel,
  items = [],
  onNavigateToSection,
}: Gallery6Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    if (!carouselApi) {
      return
    }

    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
    }

    updateSelection()
    carouselApi.on('select', updateSelection)

    return () => {
      carouselApi.off('select', updateSelection)
    }
  }, [carouselApi])

  return (
    <section className="py-8 md:py-12">
      {heading || demoLabel ? (
        <div className="mb-8 flex flex-col justify-between gap-6 md:mb-12 md:flex-row md:items-end">
          <div className="max-w-2xl">
            {heading ? (
              <h3 className="mb-3 text-2xl font-semibold tracking-tight text-[var(--fg)] md:text-3xl lg:text-4xl">
                {heading}
              </h3>
            ) : null}
            {demoLabel ? (
              <a
                href={demoUrl}
                className="group inline-flex items-center gap-1 text-sm font-medium text-[var(--fg)]/82 md:text-base"
                onClick={(event) => {
                  if (!onNavigateToSection) {
                    return
                  }

                  event.preventDefault()
                  onNavigateToSection(demoUrl)
                }}
              >
                {demoLabel}
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center justify-start gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                carouselApi?.scrollPrev()
              }}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                carouselApi?.scrollNext()
              }}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      ) : null}

      <div className="w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              '(max-width: 768px)': {
                dragFree: true,
              },
            },
          }}
          className="relative"
        >
          <CarouselContent className="-ml-4">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-4 md:basis-[520px] lg:basis-[580px] xl:basis-[640px]"
              >
                <a
                  href={item.url}
                  className="group flex h-full flex-col justify-between rounded-[1.85rem] border border-[rgba(132,168,255,0.16)] bg-[linear-gradient(180deg,rgba(57,231,255,0.07),rgba(138,99,255,0.05)),rgba(10,18,36,0.92)] p-5 shadow-[0_24px_70px_rgba(3,7,14,0.28)] transition-[box-shadow,border-color] duration-300 hover:border-[rgba(132,168,255,0.24)] hover:shadow-[0_32px_90px_rgba(3,7,14,0.34)] md:p-6"
                  onClick={(event) => {
                    if (!onNavigateToSection) {
                      return
                    }

                    event.preventDefault()
                    onNavigateToSection(item.url)
                  }}
                >
                  <div>
                    <div className="flex aspect-[16/10] overflow-hidden rounded-[1.35rem] border border-[rgba(132,168,255,0.15)]">
                      <div className="flex-1">
                        <div className="relative h-full w-full origin-bottom transition duration-300 group-hover:scale-[1.03]">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="mb-3 line-clamp-2 break-words text-[1.2rem] font-medium leading-[1.08] tracking-[-0.04em] text-[var(--fg)] md:text-[1.45rem] lg:text-[1.6rem]">
                      {item.title}
                    </div>
                    <div className="mb-7 line-clamp-4 max-w-[56ch] text-sm leading-7 text-[var(--muted)] md:text-base">
                      {item.summary}
                    </div>
                    <div className="flex items-center text-sm font-medium text-[var(--fg)]/86">
                      Voir le projet
                      <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}

export { Gallery6 }
