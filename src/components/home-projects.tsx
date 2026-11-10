import { useState } from 'react'
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
  return (
    <section className="stack-scene-inner home-section home-projects" aria-labelledby="home-projects-title">
      <div className="home-section-heading home-section-heading--centered">
        <span className="eyebrow">{t.label}</span>
        <h2 id="home-projects-title">{t.title}</h2>
        <p>{t.intro}</p>
      </div>
      <div className={`home-projects-marquee${paused ? ' is-paused' : ''}`}>
        {[false, true, true].map((copy, copyIndex) => (
          <ul className="home-projects-track" key={copyIndex} aria-hidden={copy || undefined} {...(copy ? { inert: true } : {})}>
            {list.map((project, index) => (
              <li key={project.id}>
                <a className="home-project-card" href={target}>
                  <span className="home-project-image">
                    <img src={project.image} alt="" loading="lazy" />
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
