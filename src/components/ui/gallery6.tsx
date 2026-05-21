"use client"

import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'

import ElectricBorder from '@/components/ui/ElectricBorder'
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
  itemCtaLabel?: string
  items?: readonly GalleryItem[]
  onNavigateToSection?: (sectionId: string) => void
}

const Gallery6 = ({
  heading,
  demoUrl = 'contact',
  demoLabel,
  itemCtaLabel = 'Voir le projet',
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
          <CarouselContent className="-ml-6 items-stretch">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="flex basis-[86vw] pl-6 py-5 max-sm:max-w-[22rem] md:basis-[440px] md:py-6 lg:basis-[500px] xl:basis-[560px]"
              >
                <ElectricBorder
                  color="#7df9ff"
                  speed={3}
                  chaos={0.015}
                  borderRadius={16}
                  className="h-full w-full rounded-2xl"
                  style={{ borderRadius: 16 }}
                >
                  <a
                    href={item.url}
                    className="group flex h-[27rem] w-full flex-col justify-between rounded-2xl border border-[rgba(16,33,44,0.07)] bg-[rgba(248,249,250,0.9)] p-4 shadow-[0_22px_60px_rgba(76,103,119,0.10)] transition-[transform,box-shadow,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-[rgba(28,141,179,0.16)] hover:shadow-[0_28px_72px_rgba(76,103,119,0.14)] dark:border-white/7 dark:bg-[rgba(28,33,38,0.82)] dark:shadow-[0_28px_72px_rgba(0,0,0,0.26)] sm:h-[28rem] sm:p-5 md:h-[31rem] md:p-6"
                    onClick={(event) => {
                      if (!onNavigateToSection) {
                        return
                      }

                      event.preventDefault()
                      onNavigateToSection(item.url)
                    }}
                  >
                    <div>
                      <div className="flex aspect-[16/10] overflow-hidden rounded-[1.35rem] border border-[rgba(16,33,44,0.08)] dark:border-white/8">
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
                      <div className="mb-3 line-clamp-2 break-words text-[1.05rem] font-medium leading-[1.08] tracking-[-0.04em] text-[var(--fg)] sm:text-[1.15rem] md:text-[1.45rem] lg:text-[1.55rem]">
                        {item.title}
                      </div>
                      <div className="mb-6 line-clamp-4 max-w-[56ch] text-[0.92rem] leading-6 text-[var(--muted)] md:mb-7 md:text-base md:leading-7">
                        {item.summary}
                      </div>
                      <div className="flex items-center text-sm font-medium text-[var(--fg)]/86">
                        {itemCtaLabel}
                        <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </a>
                </ElectricBorder>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}

export { Gallery6 }
