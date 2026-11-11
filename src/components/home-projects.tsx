import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { ArrowRight, Pause, Play } from 'lucide-react'
import { projects, type Language } from '@/data/portfolio-content'
import { paths } from '@/site'
import './home-projects.css'

const text = {
  fr: { label: 'Réalisations', title: 'Quelques projets réalisés', intro: 'Un aperçu de ce que je construis. Le détail de chaque projet est sur la page dédiée.', all: 'Voir tous les projets', pause: 'Mettre en pause le défilement', play: 'Reprendre le défilement' },
  en: { label: 'Work', title: 'A few projects I built', intro: 'A preview of what I build. Each project has its own page with the details.', all: 'See all projects', pause: 'Pause scrolling', play: 'Resume scrolling' },
}

// Home preview of the finished projects: the first three, each linking to the full projects page.
export function HomeProjects({ language }: { language: Language }) {
  const t = text[language]
  const list = projects[language]
  const [paused, setPaused] = useState(false)
  const target = paths[language].projects
  const marqueeRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, moved: false, startX: 0, startLeft: 0 })

  // With a mouse (narrow desktop window) the row cannot be swiped, so dragging it scrolls it. Touch keeps native scrolling.
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = marqueeRef.current
    if (!el || event.pointerType !== 'mouse' || event.button !== 0 || !window.matchMedia('(max-width: 900px)').matches) return
    drag.current = { active: true, moved: false, startX: event.clientX, startLeft: el.scrollLeft }
  }
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = marqueeRef.current
    if (!el || !drag.current.active) return
    const dx = event.clientX - drag.current.startX
    if (!drag.current.moved && Math.abs(dx) > 5) {
      drag.current.moved = true
      el.classList.add('is-dragging')
    }
    if (drag.current.moved) el.scrollLeft = drag.current.startLeft - dx
  }
  const endDrag = () => {
    drag.current.active = false
    marqueeRef.current?.classList.remove('is-dragging')
  }
  return (
    <section className="stack-scene-inner home-section home-projects" aria-labelledby="home-projects-title">
      <div className="home-section-heading home-section-heading--centered">
        <span className="eyebrow">{t.label}</span>
        <h2 id="home-projects-title">{t.title}</h2>
        <p>{t.intro}</p>
      </div>
      <div
        ref={marqueeRef}
        className={`home-projects-marquee${paused ? ' is-paused' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={(event) => { if (drag.current.moved) { event.preventDefault(); event.stopPropagation(); drag.current.moved = false } }}
        onDragStart={(event) => event.preventDefault()}
      >
        {[false, true, true].map((copy, copyIndex) => (
          <ul className="home-projects-track" key={copyIndex} aria-hidden={copy || undefined} {...(copy ? { inert: true } : {})}>
            {list.map((project, index) => (
              <li key={project.id}>
                <a className="home-project-card" href={target}>
                  <span className="home-project-image">
                    <img src={project.image} alt="" width="1100" height="540" loading="lazy" decoding="async" />
                    <span className="home-project-number">0{index + 1}</span>
                  </span>
                  <span className="home-project-copy">
                    <strong>{project.title}</strong>
                    <span>{project.summary}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ))}
      </div>
      <button type="button" className="home-projects-toggle" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
        {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        <span className="visually-hidden">{paused ? t.play : t.pause}</span>
      </button>
      <a className="button button-primary home-projects-all" href={target}>
        {t.all}
        <ArrowRight aria-hidden="true" />
      </a>
    </section>
  )
}
