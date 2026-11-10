import { ArrowRight } from 'lucide-react'
import { projects, type Language } from '@/data/portfolio-content'
import { paths } from '@/site'
import './home-projects.css'

const text = {
  fr: { label: 'Réalisations', title: 'Quelques projets réalisés', intro: 'Un aperçu de ce que je construis. Le détail de chaque projet est sur la page dédiée.', all: 'Voir tous les projets' },
  en: { label: 'Work', title: 'A few projects I built', intro: 'A preview of what I build. Each project has its own page with the details.', all: 'See all projects' },
}

// Home preview of the finished projects: the first three, each linking to the full projects page.
export function HomeProjects({ language }: { language: Language }) {
  const t = text[language]
  const list = projects[language].slice(0, 3)
  const target = paths[language].projects
  return (
    <section className="stack-scene-inner home-section home-projects" aria-labelledby="home-projects-title">
      <div className="home-section-heading home-section-heading--centered">
        <span className="eyebrow">{t.label}</span>
        <h2 id="home-projects-title">{t.title}</h2>
        <p>{t.intro}</p>
      </div>
      <ul className="home-projects-grid">
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
      <a className="button button-primary home-projects-all" href={target}>
        {t.all}
        <ArrowRight aria-hidden="true" />
      </a>
    </section>
  )
}
