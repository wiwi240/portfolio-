import { FaGithub, FaLinkedinIn } from 'react-icons/fa6'
import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'
import { LuFolderOpen, LuMail } from 'react-icons/lu'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Gallery6 } from '@/components/ui/gallery6'
import GradientMenu from '@/components/ui/gradient-menu'
import GridScan from '@/components/ui/grid-scan'
import OrbitingSkills from '@/components/ui/orbiting-skills'
import { ThemeSwitch } from '@/components/ui/theme-switch'
import './App.css'

const projectGalleryItems = [
  {
    id: 'rubber-duck',
    title: 'Rubber Duck',
    summary:
      'Dev tool pedagogique pour aider au raisonnement par etapes, avec une interface de guidage, une logique de contexte et une structure produit exploitable.',
    url: 'stack',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'sakura-line',
    title: 'Sakura Line Studio',
    summary:
      'Site pour une tatoueuse avec univers sakura, pense pour l autogestion du contenu, une presentation claire de l activite et une mise a jour simple du site.',
    url: 'stack',
    image:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'questonnaut',
    title: 'Questonnaut',
    summary:
      'Application de creation d habitudes gamifiee, pensee pour rendre le suivi plus engageant, plus lisible et plus motivant au quotidien.',
    url: 'stack',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80',
  },
]

const aboutItems = [
  {
    title: 'Une base claire avant tout.',
    text:
      'Je cherche a construire des projets que l on peut comprendre rapidement, reprendre facilement et faire evoluer sans repartir de zero.',
  },
  {
    title: 'Un produit qui tient quand il evolue.',
    text:
      'Pour moi, un projet solide n est pas seulement un projet qui fonctionne. C est un projet qui continue a rester propre quand on ajoute des besoins, des pages ou de la logique.',
  },
  {
    title: 'Une execution lisible du front au back.',
    text:
      'J essaie de garder la meme exigence partout: une interface nette, une logique explicite et une structure assez simple pour rester maintenable dans le temps.',
  },
]

function PortfolioPage() {
  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId)
    if (!target) {
      return
    }

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const heroMenuItems = [
    {
      title: 'Voir projets',
      icon: <LuFolderOpen />,
      gradientFrom: '#56ccf2',
      gradientTo: '#2f80ed',
      onClick: () => {
        scrollToSection('projects')
      },
    },
    {
      title: 'GitHub',
      icon: <FaGithub />,
      gradientFrom: '#8b5cf6',
      gradientTo: '#d946ef',
      href: 'https://github.com/your-github-handle',
      external: true,
    },
    {
      title: 'Mail',
      icon: <LuMail />,
      gradientFrom: '#80ff72',
      gradientTo: '#7ee8fa',
      href: 'mailto:contact@example.com',
    },
    {
      title: 'LinkedIn',
      icon: <FaLinkedinIn />,
      gradientFrom: '#60a5fa',
      gradientTo: '#2563eb',
      href: 'https://www.linkedin.com/in/your-linkedin-handle',
      external: true,
    },
  ]

  const contactMenuItems = [
    {
      title: 'Mail',
      icon: <LuMail />,
      gradientFrom: '#80ff72',
      gradientTo: '#7ee8fa',
      href: 'mailto:contact@example.com',
    },
    {
      title: 'GitHub',
      icon: <FaGithub />,
      gradientFrom: '#8b5cf6',
      gradientTo: '#d946ef',
      href: 'https://github.com/your-github-handle',
      external: true,
    },
    {
      title: 'LinkedIn',
      icon: <FaLinkedinIn />,
      gradientFrom: '#60a5fa',
      gradientTo: '#2563eb',
      href: 'https://www.linkedin.com/in/your-linkedin-handle',
      external: true,
    },
  ]

  return (
    <div className="portfolio-shell">
      <button
        type="button"
        className="skip-link"
        onClick={() => {
          scrollToSection('content')
        }}
      >
        Aller au contenu
      </button>

      <header className="portfolio-nav">
        <div className="portfolio-nav-inner">
          <button
            type="button"
            className="portfolio-logo portfolio-link-button"
            onClick={() => {
              scrollToSection('top')
            }}
          >
            William Mahi
          </button>

          <nav className="portfolio-nav-links" aria-label="Sections du portfolio">
            <button
              type="button"
              className="portfolio-nav-link portfolio-link-button"
              onClick={() => {
                scrollToSection('projects')
              }}
            >
              Projets
            </button>
            <button
              type="button"
              className="portfolio-nav-link portfolio-link-button"
              onClick={() => {
                scrollToSection('stack')
              }}
            >
              Stack
            </button>
            <button
              type="button"
              className="portfolio-nav-link portfolio-link-button"
              onClick={() => {
                scrollToSection('about')
              }}
            >
              About
            </button>
          </nav>
          <ThemeSwitch className="portfolio-theme-switch" />
        </div>
      </header>

      <main id="content">
        <section id="top" className="portfolio-hero">
          <div className="portfolio-hero-background" aria-hidden="true">
            <GridScan
              sensitivity={0}
              lineThickness={1.15}
              linesColor="#41566f"
              gridScale={0.11}
              lineStyle="solid"
              lineJitter={0.015}
              scanColor="#39e7ff"
              scanOpacity={0.28}
              scanDirection="pingpong"
              scanSoftness={2.2}
              scanGlow={0.7}
              scanPhaseTaper={0.88}
              scanDuration={2.6}
              scanDelay={1.4}
              enablePost
              bloomIntensity={0.42}
              bloomThreshold={0.08}
              bloomSmoothing={0.16}
              chromaticAberration={0.0018}
              noiseIntensity={0.008}
              scanOnClick
            />
          </div>
          <div className="portfolio-hero-grid">
            <div className="portfolio-hero-copy-main">
              <h1 className="portfolio-title">Build solide. Maintenance durable.</h1>
              <p className="portfolio-lead">
                Developpement front et back avec une execution propre, une logique claire et des choix techniques
                faciles a lire.
              </p>
              <GradientMenu items={heroMenuItems} className="mt-5" />
            </div>
          </div>
        </section>
        <button
          type="button"
          className="portfolio-section-jump portfolio-hero-jump"
          aria-label="Defiler vers les projets"
          onClick={() => {
            scrollToSection('projects')
          }}
        >
          <ChevronDown aria-hidden="true" />
        </button>

        <section id="projects" className="portfolio-section">
          <Gallery6
            items={projectGalleryItems}
            onNavigateToSection={scrollToSection}
          />
          <button
            type="button"
            className="portfolio-section-jump"
            aria-label="Defiler vers la stack"
            onClick={() => {
              scrollToSection('stack')
            }}
          >
            <ChevronDown aria-hidden="true" />
          </button>
        </section>

        <section id="stack" className="portfolio-section portfolio-section-alt">
          <div className="portfolio-stack-layout">
            <div className="portfolio-heading portfolio-stack-copy">
              <p className="portfolio-kicker">Stack / competences</p>
              <h2 className="portfolio-section-title">Stack claire, base solide.</h2>
              <p className="portfolio-section-lead">
                Cette vue regroupe les langages et frameworks principaux: Python, HTML, TypeScript,
                JavaScript, Bootstrap, CSS, GraphQL, Ruby, Ruby on Rails, React, Tailwind CSS et Next.js.
              </p>
              <div className="portfolio-stack-visual-head">
                <span className="portfolio-project-label">Orbit global</span>
                <p className="portfolio-stack-visual-text">
                  Une vue unique pour situer rapidement langages, frameworks et outils de travail.
                </p>
              </div>
            </div>

            <div className="portfolio-stack-visual">
              <OrbitingSkills defaultVariant="all" />
            </div>
          </div>
          <button
            type="button"
            className="portfolio-section-jump"
            aria-label="Defiler vers la section about me"
            onClick={() => {
              scrollToSection('about')
            }}
          >
            <ChevronDown aria-hidden="true" />
          </button>
        </section>

        <section id="about" className="portfolio-section portfolio-section-alt">
          <div className="portfolio-about-layout">
            <div className="portfolio-about-photo-card" aria-hidden="true">
              <div className="portfolio-about-photo-frame">
                <div className="portfolio-about-photo-placeholder">
                  <span className="portfolio-project-label">Photo</span>
                  <p className="portfolio-about-photo-text">Emplacement reserve pour ton portrait.</p>
                </div>
              </div>
            </div>

            <div className="portfolio-heading portfolio-about-copy">
              <p className="portfolio-kicker">About me</p>
              <h2 className="portfolio-section-title">Construire quelque chose qui dure.</h2>
              <p className="portfolio-section-lead">
                "Build solide. Maintenance durable." n est pas juste une formule visuelle. C est une
                facon de penser un projet: poser une base propre, faire des choix comprenables et
                garder assez de clarte pour que le produit puisse continuer a vivre sans se fragiliser.
              </p>

              <div className="portfolio-about-card">
                {aboutItems.map((item, index) => (
                  <motion.article
                    key={item.title}
                    className="portfolio-about-block"
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.55, delay: index * 0.08, ease: 'easeOut' }}
                  >
                    <h3 className="portfolio-about-title">{item.title}</h3>
                    <p className="portfolio-about-text">{item.text}</p>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="portfolio-section portfolio-section-alt portfolio-contact-section">
          <div className="portfolio-heading">
            <p className="portfolio-kicker">Contact</p>
            <h2 className="portfolio-contact-title">Un projet en tete ?</h2>
            <p className="portfolio-contact-text">
              Si mon approche te parle, on peut echanger simplement autour d une idee, d un besoin
              produit ou d une collaboration.
            </p>
            <GradientMenu items={contactMenuItems} className="mt-8" />
          </div>
        </section>
      </main>

      <footer className="portfolio-footer">
        <div className="portfolio-footer-inner">
          <div className="portfolio-footer-meta">
            <p className="portfolio-footer-brand">William Mahi</p>
            <p className="portfolio-footer-copy">
              Portfolio personnel. Conception, integration front-end et structuration produit.
            </p>
          </div>
          <div className="portfolio-footer-links" aria-label="Informations legales">
            <span className="portfolio-footer-link">Mentions legales</span>
            <span className="portfolio-footer-link">Politique de confidentialite</span>
            <span className="portfolio-footer-link">Conditions d utilisation</span>
          </div>
          <p className="portfolio-footer-note">© {new Date().getFullYear()} William Mahi. Tous droits reserves.</p>
        </div>
      </footer>
    </div>
  )
}

function AppShell() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/portfolio" replace />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="*" element={<Navigate to="/portfolio" replace />} />
    </Routes>
  )
}

export default function App() {
  return <AppShell />
}
