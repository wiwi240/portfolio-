import { useEffect, useState } from 'react'
import OrbitingSkills from '@/components/ui/orbiting-skills'
import { ParticleTextEffect } from '@/components/ui/particle-text-effect'
import './App.css'

type Project = {
  title: string
  category: string
  summary: string
  problem: string
  solution: string
  challenges: string[]
  stack: string[]
  signals: string[]
  featured?: boolean
}

type ProcessStep = {
  step: string
  title: string
  detail: string
}

const projects: Project[] = [
  {
    title: 'Rubber Duck',
    category: 'Dev tool pedagogique',
    summary:
      'Un outil qui aide les developpeurs a raisonner par etapes au lieu de dependre immediatement d une reponse toute faite.',
    problem:
      'Beaucoup d outils IA court-circuitent la reflexion. Le projet part de l idee inverse: assister sans remplacer le raisonnement.',
    solution:
      'Conception d une interface de guidage, d une progression par etapes et d une structure capable de garder le contexte du probleme.',
    challenges: [
      'Architecture claire entre moteur de prompts, etat de session et interface.',
      'Equilibre entre aide concrete et autonomie de l utilisateur.',
      'Base monorepo pour faire evoluer le produit proprement.',
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Node.js', 'pnpm'],
    signals: ['Prototype produit', 'UX pedagogique', 'Base extensible'],
    featured: true,
  },
  {
    title: 'Memory Graph',
    category: 'Desktop app local-first',
    summary:
      'Une application de memoire technique type Obsidian, orientee developpeur, avec relations, structuration locale et logique evolutive.',
    problem:
      'Les notes techniques se fragmentent vite. Il faut une structure locale, durable, rapide et plus exploitable qu un simple dossier Markdown.',
    solution:
      'Approche local-first avec notes reliees, base embarquee et modelisation pensee pour lier contenus, tags et pistes de recherche.',
    challenges: [
      'Modele de donnees pour les relations semantiques.',
      'Gestion locale fiable avec perspective de synchronisation differee.',
      'Interface desktop lisible malgre un contenu dense.',
    ],
    stack: ['React', 'TypeScript', 'Tauri', 'SQLite', 'Prisma'],
    signals: ['Local-first', 'Architecture data', 'Produit personnel fort'],
  },
  {
    title: 'Sakura Line',
    category: 'Site metier et back-office',
    summary:
      'Un site vitrine et une base admin plus serieuse pour un studio tattoo, avec une attention particuliere a la clarte du design et a la tenue du back-office.',
    problem:
      'Le besoin n est pas seulement de montrer une facade. Il faut aussi une structure lisible, un parcours propre et une logique metier exploitable.',
    solution:
      'Refonte du front, mise en place d une API plus praticable et traitement du site comme un produit de service plutot qu une simple maquette.',
    challenges: [
      'Concilier direction visuelle forte et lisibilite immediate.',
      'Structurer les flux admin et les payloads proprement.',
      'Garder une base simple a maintenir.',
    ],
    stack: ['React', 'TypeScript', 'Express', 'PostgreSQL', 'CSS'],
    signals: ['UI production-ready', 'Flux admin', 'Base metier saine'],
  },
]

const processSteps: ProcessStep[] = [
  {
    step: '01',
    title: 'Comprendre le probleme',
    detail:
      'Je commence par clarifier le besoin, les points de friction et la vraie valeur attendue avant de parler interface ou stack.',
  },
  {
    step: '02',
    title: 'Poser une architecture simple',
    detail:
      'Je cherche une structure front et serveur lisible, capable de tenir dans le temps sans sur-ingenierie prematuree.',
  },
  {
    step: '03',
    title: 'Construire un MVP net',
    detail:
      'Je privilegie une premiere version exploitable rapidement, avec des conventions propres et des flux deja solides.',
  },
  {
    step: '04',
    title: 'Iterer sur l UX et le produit',
    detail:
      'Je corrige ce qui ralentit la lecture, les usages et la comprehension generale du produit.',
  },
  {
    step: '05',
    title: 'Stabiliser et rendre maintenable',
    detail:
      'Je termine par la fiabilite, la clarte du code, les ajustements de structure et les points critiques de production.',
  },
]

function App() {
  const [route, setRoute] = useState<'intro' | 'portfolio'>(() => {
    if (typeof window === 'undefined') {
      return 'intro'
    }

    return window.sessionStorage.getItem('portfolio-view') === 'portfolio' ? 'portfolio' : 'intro'
  })

  useEffect(() => {
    window.sessionStorage.setItem('portfolio-view', route)
  }, [route])

  const handleStart = () => {
    setRoute('portfolio')
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  const handleBackToIntro = () => {
    setRoute('intro')
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  if (route === 'intro') {
    return (
      <div className="intro-shell">
        <ParticleTextEffect
          words={['WILLIAM', 'MAHI', 'FULLSTACK', 'PORTFOLIO', 'REACT', 'NODE']}
          className="intro-particle"
          title=""
          caption=""
        />

        <div className="intro-overlay">
          <button type="button" className="intro-start" onClick={handleStart}>
            <span className="intro-start-glow" aria-hidden="true" />
            <span className="intro-start-label">Start</span>
            <span className="intro-start-icon" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="portfolio-shell">
      <a href="#content" className="skip-link">
        Aller au contenu
      </a>

      <header className="portfolio-nav">
        <div className="portfolio-nav-inner">
          <a href="#top" className="portfolio-logo">
            William Mahi
          </a>

          <nav className="portfolio-nav-links" aria-label="Sections du portfolio">
            <a href="#projects" className="portfolio-nav-link">
              Projets
            </a>
            <a href="#stack" className="portfolio-nav-link">
              Stack
            </a>
            <a href="#process" className="portfolio-nav-link">
              Process
            </a>
            <a href="#contact" className="portfolio-nav-link">
              Contact
            </a>
          </nav>

          <button type="button" className="portfolio-back" onClick={handleBackToIntro}>
            Intro
          </button>
        </div>
      </header>

      <main id="content">
        <section id="top" className="portfolio-hero">
          <div className="portfolio-hero-grid">
            <div className="portfolio-hero-copy">
              <p className="portfolio-kicker">Developpeur fullstack JavaScript / TypeScript</p>
              <h1 className="portfolio-title">
                Applications utiles, architecture lisible, projets plus serieux qu une vitrine vide.
              </h1>
              <p className="portfolio-lead">
                Je construis des applications web et desktop avec React, TypeScript et une attention
                forte portee a la maintenabilite, a l experience developpeur et a la clarte produit.
              </p>

              <div className="portfolio-cta-row">
                <a href="#projects" className="portfolio-button">
                  Voir mes projets
                </a>
                <a href="#contact" className="portfolio-button portfolio-button-secondary">
                  Contact
                </a>
              </div>
            </div>

            <aside className="portfolio-hero-panel" aria-label="Positionnement">
              <div className="portfolio-panel-block">
                <span className="portfolio-panel-label">Positionnement</span>
                <p className="portfolio-panel-value">Fullstack React / TypeScript oriente produit et dev tools.</p>
              </div>

              <div className="portfolio-panel-block">
                <span className="portfolio-panel-label">Focus actuel</span>
                <ul className="portfolio-bullet-list">
                  <li>interfaces React lisibles</li>
                  <li>APIs Node propres</li>
                  <li>outils local-first et IA utile</li>
                </ul>
              </div>

              <div className="portfolio-micro-grid" aria-label="Signaux de profil">
                <div className="portfolio-micro-card">
                  <span className="portfolio-micro-number">3</span>
                  <span className="portfolio-micro-copy">projets phares a pousser</span>
                </div>
                <div className="portfolio-micro-card">
                  <span className="portfolio-micro-number">60-70%</span>
                  <span className="portfolio-micro-copy">du portfolio reserve aux preuves</span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="projects" className="portfolio-section">
          <div className="portfolio-heading">
            <p className="portfolio-kicker">Projets</p>
            <h2 className="portfolio-section-title">Le coeur du portfolio doit montrer ce que je sais construire.</h2>
            <p className="portfolio-section-lead">
              Trois projets suffisent si le niveau de detail, les choix techniques et les contraintes sont
              clairement visibles.
            </p>
          </div>

          <div className="portfolio-project-list">
            {projects.map((project) => (
              <article
                key={project.title}
                className={`portfolio-project${project.featured ? ' is-featured' : ''}`}
              >
                <div className={`project-preview project-preview-${project.title.toLowerCase().replaceAll(' ', '-')}`}>
                  <div className="project-preview-window">
                    <div className="project-preview-topbar">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="project-preview-canvas">
                      <div className="project-preview-sidebar" />
                      <div className="project-preview-main">
                        <div className="project-preview-meter" />
                        <div className="project-preview-meter project-preview-meter-wide" />
                        <div className="project-preview-grid">
                          <span />
                          <span />
                          <span />
                        </div>
                        <div className="project-preview-log">
                          {project.signals.map((signal) => (
                            <div key={signal} className="project-preview-log-line">
                              {signal}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="portfolio-project-content">
                  <p className="portfolio-card-kicker">{project.category}</p>
                  <h3 className="portfolio-project-title">{project.title}</h3>
                  <p className="portfolio-project-summary">{project.summary}</p>

                  <div className="portfolio-project-block">
                    <span className="portfolio-project-label">Probleme</span>
                    <p>{project.problem}</p>
                  </div>

                  <div className="portfolio-project-block">
                    <span className="portfolio-project-label">Solution</span>
                    <p>{project.solution}</p>
                  </div>

                  <div className="portfolio-project-block">
                    <span className="portfolio-project-label">Challenges techniques</span>
                    <ul className="portfolio-bullet-list">
                      {project.challenges.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="portfolio-tags">
                    {project.stack.map((item) => (
                      <span key={item} className="portfolio-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="stack" className="portfolio-section portfolio-section-alt">
          <div className="portfolio-heading">
            <p className="portfolio-kicker">Stack / competences</p>
            <h2 className="portfolio-section-title">Des categories credibles valent mieux qu une pluie de logos.</h2>
            <p className="portfolio-section-lead">
              Cette vue regroupe les langages et frameworks principaux: Python, HTML, TypeScript,
              JavaScript, Bootstrap, CSS, GraphQL, Ruby, Ruby on Rails, React, Tailwind CSS et Next.js.
            </p>
          </div>

          <div className="portfolio-stack-layout">
            <div className="portfolio-stack-visual">
              <div className="portfolio-stack-visual-head">
                <span className="portfolio-project-label">Orbit global</span>
                <p className="portfolio-stack-visual-text">
                  Une roue unique qui regroupe langages, frameworks et outils de travail dans le meme
                  systeme visuel.
                </p>
              </div>
              <OrbitingSkills defaultVariant="all" />
            </div>
          </div>
        </section>

        <section id="process" className="portfolio-section">
          <div className="portfolio-heading">
            <p className="portfolio-kicker">Process de travail</p>
            <h2 className="portfolio-section-title">Je cherche d abord une structure saine, puis j affine.</h2>
          </div>

          <div className="portfolio-process-grid">
            {processSteps.map((item) => (
              <article key={item.step} className="portfolio-process-card">
                <span className="portfolio-process-step">{item.step}</span>
                <h3 className="portfolio-process-title">{item.title}</h3>
                <p className="portfolio-process-text">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="portfolio-section portfolio-section-alt">
          <div className="portfolio-about-grid">
            <article className="portfolio-about-card">
              <p className="portfolio-kicker">About Me</p>
              <h2 className="portfolio-section-title">Profil fullstack avec un biais clair pour les outils utiles.</h2>
              <p className="portfolio-about-text">
                Developpeur fullstack oriente JavaScript / TypeScript. J aime construire des applications
                utiles avec une attention particuliere portee a l architecture, a l experience
                developpeur et a la lisibilite des produits.
              </p>
            </article>

            <article className="portfolio-about-card">
              <p className="portfolio-kicker">Axes de travail</p>
              <ul className="portfolio-bullet-list">
                <li>architecture propre</li>
                <li>outils dev et IA utile</li>
                <li>logique local-first</li>
                <li>UX technique et maintainable</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="portfolio-section">
          <div className="portfolio-heading">
            <p className="portfolio-kicker">GitHub / experience</p>
            <h2 className="portfolio-section-title">Les projets compensent si l experience pro est encore courte.</h2>
          </div>

          <div className="portfolio-experience-grid">
            <article className="portfolio-experience-card">
              <span className="portfolio-project-label">Trajectoire</span>
              <h3 className="portfolio-experience-title">Developpeur Fullstack — projets personnels</h3>
              <p className="portfolio-experience-text">
                Applications React/TypeScript, architecture monorepo, outils orientes developpeurs et
                experimentation produit avec exigence de clarte.
              </p>
            </article>

            <article className="portfolio-experience-card">
              <span className="portfolio-project-label">GitHub</span>
              <p className="portfolio-experience-text">
                La version finale du portfolio doit pousser seulement les projets propres, documentes et
                techniquement defensables. Le compte GitHub doit servir de preuve, pas de bruit.
              </p>
            </article>
          </div>
        </section>

        <section id="contact" className="portfolio-section portfolio-contact-section">
          <div className="portfolio-contact-card">
            <p className="portfolio-kicker">Contact</p>
            <h2 className="portfolio-contact-title">Disponible pour missions, collaboration ou opportunites developpeur.</h2>
            <p className="portfolio-contact-text">
              La structure est en place. Il reste a brancher les vrais liens de contact, GitHub, LinkedIn
              et le CV avant publication.
            </p>

            <div className="portfolio-contact-grid">
              <div className="portfolio-contact-item">
                <span className="portfolio-project-label">Email</span>
                <p>Ajouter l adresse finale</p>
              </div>
              <div className="portfolio-contact-item">
                <span className="portfolio-project-label">GitHub</span>
                <p>Epingler 3 projets forts</p>
              </div>
              <div className="portfolio-contact-item">
                <span className="portfolio-project-label">LinkedIn / CV</span>
                <p>Brancher les liens reels</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
