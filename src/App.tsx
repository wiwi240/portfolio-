import { useState, type FormEvent } from 'react'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6'
import { LuFolderOpen, LuMail, LuMessageSquare } from 'react-icons/lu'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Gallery6 } from '@/components/ui/gallery6'
import GradientMenu from '@/components/ui/gradient-menu'
import GridScan from '@/components/ui/grid-scan'
import OrbitingSkills from '@/components/ui/orbiting-skills'
import { ThemeSwitch } from '@/components/ui/theme-switch'
import './App.css'

type ContactFormState = {
  name: string
  email: string
  message: string
}

type ContactSubmissionState = {
  status: 'idle' | 'submitting' | 'success' | 'error'
  message: string
  errors: string[]
}

const projectGalleryItems = [
  {
    id: 'rubber-duck',
    title: 'Rubber Duck',
    summary:
      'Dev tool pedagogique pour aider au raisonnement par etapes, avec une interface de guidage, une logique de contexte et une structure produit exploitable.',
    url: 'contact',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'sakura-line',
    title: 'Sakura Line Studio',
    summary:
      'Site pour une tatoueuse avec univers sakura, pense pour l autogestion du contenu, une presentation claire de l activite et une mise a jour simple du site.',
    url: 'contact',
    image:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'questonnaut',
    title: 'Questonnaut',
    summary:
      'Application de creation d habitudes gamifiee, pensee pour rendre le suivi plus engageant, plus lisible et plus motivant au quotidien.',
    url: 'contact',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80',
  },
]

const initialContactFormState: ContactFormState = {
  name: '',
  email: '',
  message: '',
}

function PortfolioPage({
  contactForm,
  onContactChange,
  onContactSubmit,
  contactSubmission,
}: {
  contactForm: ContactFormState
  onContactChange: (field: keyof ContactFormState, value: string) => void
  onContactSubmit: (event: FormEvent<HTMLFormElement>) => void
  contactSubmission: ContactSubmissionState
}) {
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
      title: 'Contacter',
      icon: <LuMessageSquare />,
      gradientFrom: '#ff9966',
      gradientTo: '#ff5e62',
      onClick: () => {
        scrollToSection('contact')
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
                scrollToSection('contact')
              }}
            >
              Contact
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
            <div className="portfolio-hero-copy portfolio-hero-copy-main">
              <h1 className="portfolio-title">Build solide. Maintenance durable.</h1>
              <p className="portfolio-lead">
                Developpement front et back avec une execution propre, une logique claire et des choix techniques
                faciles a lire.
              </p>
              <GradientMenu items={heroMenuItems} className="mt-5" />
            </div>
          </div>
        </section>

        <section id="projects" className="portfolio-section">
          <Gallery6
            items={projectGalleryItems}
            onNavigateToSection={scrollToSection}
          />
        </section>

        <section id="stack" className="portfolio-section portfolio-section-alt">
          <div className="portfolio-heading">
            <p className="portfolio-kicker">Stack / competences</p>
            <h2 className="portfolio-section-title">Stack claire, base solide.</h2>
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
                  Une vue unique pour situer rapidement langages, frameworks et outils de travail.
                </p>
              </div>
              <OrbitingSkills defaultVariant="all" />
            </div>
          </div>
        </section>

        <section id="contact" className="portfolio-section portfolio-contact-section">
          <div className="portfolio-contact-card">
            <div className="portfolio-contact-copy">
              <p className="portfolio-kicker">Contact</p>
              <h2 className="portfolio-contact-title">Disponible pour mission ou recrutement.</h2>
              <p className="portfolio-contact-text">
                Un formulaire simple pour prendre contact rapidement, sans surcharge visuelle.
              </p>

              <div className="portfolio-contact-grid">
                <div className="portfolio-contact-item">
                  <span className="portfolio-project-label">Route front</span>
                  <p>`/#/portfolio` pour le contenu principal et `/#/` pour l accueil.</p>
                </div>
                <div className="portfolio-contact-item">
                  <span className="portfolio-project-label">Proxy dev</span>
                  <p>`/api/*` vers `http://localhost:4000` dans Vite.</p>
                </div>
                <div className="portfolio-contact-item">
                  <span className="portfolio-project-label">Endpoint</span>
                  <p>`POST /api/contact` avec validation serveur et fallback memoire/DB.</p>
                </div>
              </div>
            </div>

            <form className="portfolio-contact-form" onSubmit={onContactSubmit}>
              <h2 className="portfolio-contact-title">Parlons mission ou recrutement.</h2>
              <label className="portfolio-field">
                <span className="portfolio-field-label">Nom</span>
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={(event) => {
                    onContactChange('name', event.target.value)
                  }}
                  className="portfolio-input"
                  autoComplete="name"
                  placeholder="William Mahi"
                  required
                />
              </label>

              <label className="portfolio-field">
                <span className="portfolio-field-label">Email</span>
                <input
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={(event) => {
                    onContactChange('email', event.target.value)
                  }}
                  className="portfolio-input"
                  autoComplete="email"
                  placeholder="contact@exemple.com"
                  required
                />
              </label>

              <label className="portfolio-field">
                <span className="portfolio-field-label">Message</span>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={(event) => {
                    onContactChange('message', event.target.value)
                  }}
                  className="portfolio-input portfolio-textarea"
                  placeholder="Bonjour, je souhaite discuter d une mission ou d un recrutement."
                  required
                  minLength={10}
                />
              </label>

              <button
                type="submit"
                className="portfolio-button portfolio-contact-submit"
                disabled={contactSubmission.status === 'submitting'}
              >
                {contactSubmission.status === 'submitting' ? 'Envoi...' : 'Envoyer'}
              </button>

              {contactSubmission.message ? (
                <p className={`portfolio-form-feedback is-${contactSubmission.status}`}>
                  {contactSubmission.message}
                </p>
              ) : null}

              {contactSubmission.errors.length > 0 ? (
                <ul className="portfolio-form-errors">
                  {contactSubmission.errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              ) : null}
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}

function AppShell() {
  const [contactForm, setContactForm] = useState<ContactFormState>(initialContactFormState)
  const [contactSubmission, setContactSubmission] = useState<ContactSubmissionState>({
    status: 'idle',
    message: '',
    errors: [],
  })

  const handleContactChange = (field: keyof ContactFormState, value: string) => {
    setContactForm((currentState) => ({
      ...currentState,
      [field]: value,
    }))

    if (contactSubmission.status !== 'idle') {
      setContactSubmission({
        status: 'idle',
        message: '',
        errors: [],
      })
    }
  }

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setContactSubmission({
      status: 'submitting',
      message: '',
      errors: [],
    })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      })

      const payload = await response.json()

      if (!response.ok) {
        setContactSubmission({
          status: 'error',
          message: payload?.message ?? 'Envoi impossible.',
          errors: Array.isArray(payload?.errors) ? payload.errors : [],
        })
        return
      }

      setContactSubmission({
        status: 'success',
        message: `${payload?.message ?? 'Message envoye.'} Stockage: ${payload?.storage ?? 'inconnu'}.`,
        errors: [],
      })
      setContactForm(initialContactFormState)
    } catch (error) {
      setContactSubmission({
        status: 'error',
        message: error instanceof Error ? error.message : 'Erreur reseau pendant la soumission.',
        errors: [],
      })
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/portfolio" replace />} />
      <Route
        path="/portfolio"
        element={
          <PortfolioPage
            contactForm={contactForm}
            onContactChange={handleContactChange}
            onContactSubmit={(event) => {
              void handleContactSubmit(event)
            }}
            contactSubmission={contactSubmission}
          />
        }
      />
      <Route path="*" element={<Navigate to="/portfolio" replace />} />
    </Routes>
  )
}

export default function App() {
  return <AppShell />
}
