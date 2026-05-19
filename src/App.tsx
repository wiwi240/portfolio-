import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { CoreSpinLoader } from '@/components/ui/core-spin-loader'
import DotField from '@/components/ui/dot-field'
import { Gallery6 } from '@/components/ui/gallery6'
import OrbitingSkills from '@/components/ui/orbiting-skills'
import RotatingText from '@/components/ui/rotating-text'
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
    id: 'memory-graph',
    title: 'Memory Graph',
    summary:
      'Application desktop local-first orientee developpeur, pensee pour structurer les notes techniques, relier les contenus et garder une base de travail durable.',
    url: 'contact',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'sakura-line',
    title: 'Sakura Line',
    summary:
      'Site metier et base admin plus serieuse pour un studio tattoo, avec direction visuelle plus nette, back-office plus clair et structure plus maintenable.',
    url: 'contact',
    image:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80',
  },
]

const ROUTE_SWAP_DELAY_MS = 180
const LOADER_DURATION_MS = 850
const initialContactFormState: ContactFormState = {
  name: '',
  email: '',
  message: '',
}

function IntroPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="intro-shell">
      <div className="intro-visual" aria-hidden="true">
        <DotField
          dotRadius={2.2}
          dotSpacing={12}
          cursorRadius={560}
          bulgeStrength={92}
          glowRadius={220}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom="rgba(57, 231, 255, 0.64)"
          gradientTo="rgba(138, 99, 255, 0.34)"
          glowColor="#112544"
        />
      </div>

      <div className="intro-overlay">
        <div className="intro-copy">
          <p className="intro-kicker">William Mahi</p>
          <h1 className="intro-title">
            <span className="intro-title-line intro-title-line-role">
              <span className="intro-role-prefix">Developpeur</span>
              <RotatingText
                texts={['fullstack', 'backend', 'database']}
                mainClassName="intro-role-rotator"
                splitLevelClassName="intro-role-split"
                elementLevelClassName="intro-role-element"
                staggerFrom="last"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-120%', opacity: 0 }}
                staggerDuration={0.02}
                transition={{ type: 'spring', damping: 28, stiffness: 360 }}
                rotationInterval={2400}
              />
            </span>
            <span className="intro-title-line">Frontend net.</span>
            <span className="intro-title-line intro-title-line-accent">
              Produit lisible.
              <span className="intro-inline-chip" aria-hidden="true">
                React / TS
              </span>
            </span>
            <span className="intro-title-line">Rendu plus futuriste.</span>
          </h1>
          <p className="intro-lead">
            Portfolio fullstack centre sur des interfaces techniques plus propres, une execution stable et une
            lecture immediate des projets, de la stack et du contact.
          </p>

          <div className="intro-signal-row" aria-label="Signaux d orientation">
            <span className="intro-signal">React</span>
            <span className="intro-signal">TypeScript</span>
            <span className="intro-signal">Node</span>
            <span className="intro-signal">UI systems</span>
          </div>

          <button type="button" className="intro-start" onClick={onEnter}>
            <span className="intro-start-glow" aria-hidden="true" />
            <span className="intro-start-label">Entrer</span>
            <span className="intro-start-icon" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

function PortfolioPage({
  onBackToIntro,
  contactForm,
  onContactChange,
  onContactSubmit,
  contactSubmission,
}: {
  onBackToIntro: () => void
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

          <button type="button" className="portfolio-back" onClick={onBackToIntro}>
            Intro
          </button>
        </div>
      </header>

      <main id="content">
        <section id="top" className="portfolio-hero">
          <div className="portfolio-hero-grid">
            <div className="portfolio-hero-copy portfolio-hero-copy-rotating">
              <div className="portfolio-hero-rotating-line">
                <span className="portfolio-hero-rotating-prefix">Developpeur</span>
                <RotatingText
                  texts={['fullstack', 'backend', 'front', 'database']}
                  mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                  staggerFrom="last"
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '-120%' }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                  transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                  rotationInterval={2000}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="portfolio-section">
          <div className="portfolio-heading">
            <p className="portfolio-kicker">Projets</p>
            <h2 className="portfolio-section-title">Projets lisibles, execution visible.</h2>
            <p className="portfolio-section-lead">
              Une selection courte suffit si les choix techniques, la logique produit et le niveau d execution
              restent visibles en quelques minutes.
            </p>
          </div>

          <Gallery6
            heading="Mes projets"
            demoUrl="contact"
            demoLabel="Prendre contact"
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
  const navigate = useNavigate()
  const location = useLocation()
  const timeoutIdsRef = useRef<number[]>([])
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [contactForm, setContactForm] = useState<ContactFormState>(initialContactFormState)
  const [contactSubmission, setContactSubmission] = useState<ContactSubmissionState>({
    status: 'idle',
    message: '',
    errors: [],
  })

  const clearPendingTimeouts = () => {
    timeoutIdsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId)
    })
    timeoutIdsRef.current = []
  }

  const scheduleTimeout = (callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(() => {
      timeoutIdsRef.current = timeoutIdsRef.current.filter((currentId) => currentId !== timeoutId)
      callback()
    }, delay)

    timeoutIdsRef.current.push(timeoutId)
  }

  const navigateWithLoader = (nextPath: '/' | '/portfolio') => {
    if (nextPath === location.pathname) {
      return
    }

    clearPendingTimeouts()
    setIsPageLoading(true)

    scheduleTimeout(() => {
      navigate(nextPath)
      window.scrollTo({ top: 0, behavior: 'auto' })

      scheduleTimeout(() => {
        setIsPageLoading(false)
      }, LOADER_DURATION_MS)
    }, ROUTE_SWAP_DELAY_MS)
  }

  useEffect(() => {
    return () => {
      clearPendingTimeouts()
    }
  }, [])

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

  if (isPageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07090d] px-6">
        <CoreSpinLoader />
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <IntroPage
            onEnter={() => {
              navigateWithLoader('/portfolio')
            }}
          />
        }
      />
      <Route
        path="/portfolio"
        element={
          <PortfolioPage
            onBackToIntro={() => {
              navigateWithLoader('/')
            }}
            contactForm={contactForm}
            onContactChange={handleContactChange}
            onContactSubmit={(event) => {
              void handleContactSubmit(event)
            }}
            contactSubmission={contactSubmission}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return <AppShell />
}
