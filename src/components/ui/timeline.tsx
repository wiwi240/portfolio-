import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import './timeline.css'

// Pinned horizontal timeline. While the section is pinned, vertical scrolling slides the track sideways;
// each milestone draws its stem and reveals its copy as it reaches the centre of the viewport.
// Below 900px or with reduced motion it becomes a plain horizontally scrollable strip with everything shown.
export type TimelineItem = {
  date: string
  dateTime?: string
  title: string
  description: string
  tags?: string[]
  icon?: ReactNode
}

export type TimelineProps = {
  items: TimelineItem[]
  title: string
  periodLabel?: string
  eyebrow?: string
  intro?: string
  imageUrl?: string
  imageAlt?: string
  backgroundColor?: string
  textColor?: string
  mutedTextColor?: string
  activeColor?: string
  /** Seconds taken by a stem to draw and its copy to appear. */
  duration?: number
  hint?: string
}

const PINNED_QUERY = '(min-width: 900px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)'

export default function Timeline({
  items,
  title,
  periodLabel,
  eyebrow,
  intro,
  imageUrl,
  imageAlt = '',
  backgroundColor = 'transparent',
  textColor = 'var(--fg)',
  mutedTextColor = 'var(--muted)',
  activeColor = 'var(--accent)',
  duration = 1.2,
  hint,
}: TimelineProps) {
  const sceneRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLOListElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const [pinned, setPinned] = useState(false)
  const [reached, setReached] = useState(0)

  useEffect(() => {
    const query = window.matchMedia(PINNED_QUERY)
    const sync = () => setPinned(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const scene = sceneRef.current
    const track = trackRef.current
    const fill = fillRef.current
    if (!scene || !track || !fill) return
    if (!pinned) {
      scene.style.removeProperty('height')
      track.style.removeProperty('transform')
      fill.style.removeProperty('width')
      return
    }

    let travel = 0
    let frame = 0
    const measure = () => {
      travel = Math.max(0, track.scrollWidth - window.innerWidth)
      scene.style.height = `${window.innerHeight + travel}px`
    }
    const update = () => {
      frame = 0
      const rect = scene.getBoundingClientRect()
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0
      const x = -travel * p
      track.style.transform = `translate3d(${x}px, 0, 0)`
      const centre = window.innerWidth * 0.5
      fill.style.width = `${Math.max(0, centre - x - track.offsetLeft)}px`
      const kids = Array.from(track.children) as HTMLElement[]
      const count = kids.reduce((n, kid, i) => (kid.dataset.step && kid.offsetLeft + kid.offsetWidth * 0.5 + x <= centre + window.innerWidth * 0.08 ? i + 1 : n), 0)
      setReached((current) => (current === count ? current : count))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    measure()
    update()
    const observer = new ResizeObserver(() => {
      measure()
      schedule()
    })
    observer.observe(track)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [pinned, items])

  const style = {
    '--tl-bg': backgroundColor,
    '--tl-fg': textColor,
    '--tl-muted': mutedTextColor,
    '--tl-active': activeColor,
    '--tl-dur': `${duration}s`,
  } as CSSProperties

  // The first column holds the optional image, so step data attributes start after it.
  const offset = imageUrl ? 1 : 0

  return (
    <section ref={sceneRef} className={`tl ${pinned ? 'is-pinned' : 'is-flat'}`} style={style} aria-label={title}>
      <div className="tl-pin">
        <header className="tl-head">
          <div>
            {eyebrow && <span className="tl-eyebrow">{eyebrow}</span>}
            <h2>{title}</h2>
            {intro && <p>{intro}</p>}
          </div>
          {periodLabel && <span className="tl-period">{periodLabel}</span>}
        </header>

        <div className="tl-stage">
          <span className="tl-axis" aria-hidden="true">
            <span ref={fillRef} className="tl-fill" />
          </span>
          <ol ref={trackRef} className="tl-track" tabIndex={pinned ? undefined : 0} aria-label={title}>
            {imageUrl && (
              <li className="tl-lead" aria-hidden={imageAlt ? undefined : true}>
                <img src={imageUrl} alt={imageAlt} loading="lazy" />
              </li>
            )}
            {items.map((item, index) => {
              const active = !pinned || index + offset < reached
              const above = index % 2 === 0
              return (
                <li
                  key={`${item.dateTime ?? item.date}-${item.title}`}
                  data-step={index}
                  className={`tl-item ${above ? 'is-above' : 'is-below'} ${active ? 'is-active' : ''}`}
                >
                  <div className="tl-half tl-half--top">
                    {above ? <Copy item={item} /> : <time dateTime={item.dateTime}>{item.date}</time>}
                    {above && <span className="tl-stem" aria-hidden="true" />}
                  </div>
                  <span className="tl-dot" aria-hidden="true" />
                  <div className="tl-half tl-half--bottom">
                    {!above && <span className="tl-stem" aria-hidden="true" />}
                    {!above ? <Copy item={item} /> : <time dateTime={item.dateTime}>{item.date}</time>}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        {hint && pinned && <p className="tl-hint">{hint}</p>}
      </div>
    </section>
  )
}

function Copy({ item }: { item: TimelineItem }) {
  return (
    <article className="tl-copy">
      {item.icon && <span className="tl-icon" aria-hidden="true">{item.icon}</span>}
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      {item.tags && item.tags.length > 0 && (
        <div className="tl-tags">
          {item.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      )}
    </article>
  )
}
