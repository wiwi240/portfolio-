import { useEffect, useRef, useState } from 'react'
import {
  BookOpen,
  BriefcaseBusiness,
  Braces,
  LayoutTemplate,
  MonitorSmartphone,
  RefreshCcw,
  Server,
  Terminal,
  Users,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { journeyTimelineContent } from '@/data/journey-timeline-content'
import type { Language } from '@/data/portfolio-content'

type JourneyTimelineProps = {
  language: Language
  label: string
  title: string
  intro: string
}

const iconMap = {
  refresh: RefreshCcw,
  terminal: Terminal,
  book: BookOpen,
  briefcase: BriefcaseBusiness,
  users: Users,
  layout: LayoutTemplate,
  braces: Braces,
  monitor: MonitorSmartphone,
  server: Server,
} as const

export function JourneyTimeline({ language, label, title, intro }: JourneyTimelineProps) {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])
  const [progress, setProgress] = useState(shouldReduceMotion ? 1 : 0)
  const [isCompactLayout, setIsCompactLayout] = useState(false)
  const [activeIndexes, setActiveIndexes] = useState<number[]>(shouldReduceMotion ? journeyTimelineContent[language].map((_, index) => index) : [])
  const items = journeyTimelineContent[language]

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 920px)')
    const syncLayout = () => {
      setIsCompactLayout(mediaQuery.matches)
    }

    syncLayout()
    mediaQuery.addEventListener('change', syncLayout)

    return () => {
      mediaQuery.removeEventListener('change', syncLayout)
    }
  }, [])

  useEffect(() => {
    if (shouldReduceMotion) {
      setProgress(1)
      setActiveIndexes(items.map((_, index) => index))
      return
    }

    const updateTimelineState = () => {
      const section = sectionRef.current
      if (!section) {
        return
      }

      const sectionRect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const start = viewportHeight * 0.82
      const end = sectionRect.height - viewportHeight * 0.22
      const distance = start - sectionRect.top
      const rawProgress = end <= 0 ? 1 : distance / end
      const nextProgress = Math.max(0, Math.min(1, rawProgress))

      const nextActiveIndexes = itemRefs.current.reduce<number[]>((indexes, item, index) => {
        if (!item) {
          return indexes
        }

        const itemRect = item.getBoundingClientRect()
        const activationLine = viewportHeight * 0.6
        if (itemRect.top <= activationLine) {
          indexes.push(index)
        }

        return indexes
      }, [])

      setProgress(nextProgress)
      setActiveIndexes((current) => {
        if (
          current.length === nextActiveIndexes.length &&
          current.every((value, index) => value === nextActiveIndexes[index])
        ) {
          return current
        }

        return nextActiveIndexes
      })
    }

    let frameId = 0
    const requestUpdate = () => {
      if (frameId !== 0) {
        return
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0
        updateTimelineState()
      })
    }

    updateTimelineState()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)

      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [items, shouldReduceMotion])

  return (
    <div ref={sectionRef} className="portfolio-journey">
      <motion.div
        className="portfolio-section-copy portfolio-journey-head"
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
      >
        <span className="portfolio-section-label">{label}</span>
        <h2 className="portfolio-section-title">{title}</h2>
        <p className="portfolio-section-text portfolio-journey-intro">{intro}</p>
      </motion.div>

      <div className="portfolio-journey-timeline" style={{ ['--journey-progress' as string]: `${progress}` }}>
        <div className="portfolio-journey-line" aria-hidden="true" />

        <ol className="portfolio-journey-list">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon]
            const isActive = activeIndexes.includes(index)
            const direction = isCompactLayout ? 'right' : index % 2 === 0 ? 'left' : 'right'
            const shouldShowDate = index === 0 || items[index - 1]?.date !== item.date

            return (
              <li
                key={`${item.dateTime}-${item.title}`}
                ref={(node) => {
                  itemRefs.current[index] = node
                }}
                className={`portfolio-journey-item ${direction} ${isActive ? 'is-active' : ''}`}
              >
                <div className="portfolio-journey-rail">
                  {shouldShowDate ? (
                    <time className="portfolio-journey-date" dateTime={item.dateTime}>
                      {item.date}
                    </time>
                  ) : (
                    <span className="portfolio-journey-date portfolio-journey-date--empty" aria-hidden="true" />
                  )}
                  <span className="portfolio-journey-marker" aria-hidden="true" />
                </div>

                <motion.article
                  className="portfolio-journey-card"
                  initial={shouldReduceMotion ? false : { opacity: 0.32, x: direction === 'left' ? -26 : 26, y: 20 }}
                  animate={
                    shouldReduceMotion
                      ? { opacity: 1, x: 0, y: 0 }
                      : isActive
                        ? { opacity: 1, x: 0, y: 0 }
                        : { opacity: 0.32, x: direction === 'left' ? -26 : 26, y: 20 }
                  }
                  transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="portfolio-journey-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <div className="portfolio-journey-card-copy">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="portfolio-badges portfolio-journey-badges">
                      {item.tags.map((tag, tagIndex) => (
                        <motion.span
                          key={tag}
                          className="portfolio-badge"
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                          animate={shouldReduceMotion || isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                          transition={{
                            duration: 0.4,
                            delay: shouldReduceMotion ? 0 : 0.08 + tagIndex * 0.04,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
