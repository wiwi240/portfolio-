import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Copy,
  Globe,
  Mail,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6'

import { ThemeSwitch } from '@/components/ui/theme-switch'
import {
  contactEmail,
  copy,
  githubUrl,
  languageOptions,
  linkedinUrl,
  projects,
  timelineItems,
  type Language,
} from '@/data/portfolio-content'
import './App.css'

const LazyOrbitingSkills = lazy(() => import('@/components/ui/orbiting-skills'))

const sectionIds = ['projects', 'stack', 'journey', 'about', 'contact'] as const
type SectionId = (typeof sectionIds)[number]

function App() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') {
      return 'fr'
    }

    const savedLanguage = localStorage.getItem('language')
    return savedLanguage === 'en' ? 'en' : 'fr'
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const [isMailModalOpen, setIsMailModalOpen] = useState(false)
  const [isEmailCopied, setIsEmailCopied] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionId>('projects')
  const languageMenuRef = useRef<HTMLDivElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const firstModalButtonRef = useRef<HTMLButtonElement | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const content = copy[language]
  const projectItems = projects[language]
  const timeline = timelineItems[language]

  const activeLanguage = useMemo(
    () => languageOptions.find((option) => option.value === language) ?? languageOptions[0],
    [language],
  )

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.lang = language
    document.title = content.meta.title

    let descriptionTag = document.querySelector('meta[name="description"]')
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta')
      descriptionTag.setAttribute('name', 'description')
      document.head.appendChild(descriptionTag)
    }

    descriptionTag.setAttribute('content', content.meta.description)
  }, [content.meta.description, content.meta.title, language])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [])

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section instanceof HTMLElement)

    if (sections.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!visibleEntry) {
          return
        }

        const id = visibleEntry.target.id as SectionId
        if (sectionIds.includes(id)) {
          setActiveSection(id)
        }
      },
      {
        rootMargin: '-25% 0px -45% 0px',
        threshold: [0.2, 0.35, 0.5, 0.75],
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!isMailModalOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstModalButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMailModalOpen(false)
        return
      }

      if (event.key !== 'Tab' || !modalRef.current) {
        return
      }

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      )

      if (focusableElements.length === 0) {
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMailModalOpen])

  useEffect(() => {
    if (!isEmailCopied) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setIsEmailCopied(false)
    }, 1800)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isEmailCopied])

  const scrollToSection = (sectionId: SectionId | 'top' | 'content') => {
    const target = document.getElementById(sectionId)
    if (!target) {
      return
    }

    target.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      block: 'start',
    })
    setIsMenuOpen(false)
  }

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail)
      setIsEmailCopied(true)
    } catch {
      setIsEmailCopied(false)
    }
  }

  const revealProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.55 },
      }

  return (
    <div className="portfolio-shell">
      {isMailModalOpen ? (
        <div
          className="portfolio-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mail-modal-title"
          onClick={() => {
            setIsMailModalOpen(false)
          }}
        >
          <div
            ref={modalRef}
            className="portfolio-modal"
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            <div className="portfolio-modal-header">
              <h2 id="mail-modal-title" className="portfolio-modal-title">
                {contactEmail}
              </h2>
              <button
                type="button"
                className="portfolio-icon-button"
                aria-label={content.actions.close}
                onClick={() => {
                  setIsMailModalOpen(false)
                }}
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <p className="portfolio-modal-text">{content.contact.lead}</p>
            <div className="portfolio-modal-actions">
              <button
                ref={firstModalButtonRef}
                type="button"
                className="portfolio-button portfolio-button-primary"
                onClick={copyEmailToClipboard}
              >
                <Copy aria-hidden="true" />
                {isEmailCopied ? content.actions.copiedEmail : content.actions.copyEmail}
              </button>
              <a className="portfolio-button portfolio-button-secondary" href={`mailto:${contactEmail}`}>
                <Mail aria-hidden="true" />
                {content.actions.openMail}
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <a href="#content" className="skip-link">
        {content.nav.skipToContent}
      </a>

      <header className="portfolio-nav">
        <div className="portfolio-container portfolio-nav-inner">
          <button
            type="button"
            className="portfolio-brand"
            onClick={() => {
              scrollToSection('top')
            }}
          >
            WM
          </button>

          <nav className="portfolio-nav-links" aria-label={content.nav.sectionsLabel}>
            {sectionIds.map((sectionId) => {
              const label = content.nav[sectionId === 'journey' ? 'journey' : sectionId]
              return (
                <button
                  key={sectionId}
                  type="button"
                  className={`portfolio-nav-link${activeSection === sectionId ? ' is-active' : ''}`}
                  onClick={() => {
                    scrollToSection(sectionId)
                  }}
                >
                  {label}
                </button>
              )
            })}
          </nav>

          <div className="portfolio-nav-controls">
            <div className="portfolio-language-menu" ref={languageMenuRef}>
              <button
                type="button"
                className={`portfolio-language-trigger${isLanguageMenuOpen ? ' is-open' : ''}`}
                aria-label={content.language.label}
                aria-expanded={isLanguageMenuOpen}
                aria-haspopup="menu"
                onClick={() => {
                  setIsLanguageMenuOpen((currentValue) => !currentValue)
                }}
              >
                <span>{activeLanguage.shortLabel}</span>
                <ChevronDown aria-hidden="true" />
              </button>

              {isLanguageMenuOpen ? (
                <div className="portfolio-language-dropdown" role="menu" aria-label={content.language.label}>
                  {languageOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="menuitemradio"
                      aria-checked={language === option.value}
                      className={`portfolio-language-item${language === option.value ? ' is-active' : ''}`}
                      onClick={() => {
                        setLanguage(option.value)
                        setIsLanguageMenuOpen(false)
                      }}
                    >
                      <span>{option.shortLabel}</span>
                      <span>{option.longLabel}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <ThemeSwitch
              className="portfolio-theme-switch"
              lightThemeLabel={content.theme.light}
              darkThemeLabel={content.theme.dark}
            />

            <button
              type="button"
              className="portfolio-mobile-toggle"
              aria-label={isMenuOpen ? content.nav.closeMenu : content.nav.menu}
              aria-expanded={isMenuOpen}
              onClick={() => {
                setIsMenuOpen((currentValue) => !currentValue)
              }}
            >
              {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>

        {isMenuOpen ? (
          <div className="portfolio-mobile-panel">
            <nav className="portfolio-mobile-links" aria-label={content.nav.sectionsLabel}>
              {sectionIds.map((sectionId) => {
                const label = content.nav[sectionId === 'journey' ? 'journey' : sectionId]
                return (
                  <button
                    key={sectionId}
                    type="button"
                    className="portfolio-mobile-link"
                    onClick={() => {
                      scrollToSection(sectionId)
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </nav>
          </div>
        ) : null}
      </header>

      <main id="content">
        <section id="top" className="portfolio-hero">
          <div className="portfolio-container portfolio-hero-grid">
            <motion.div className="portfolio-hero-copy" {...revealProps}>
              <span className="portfolio-section-label">{content.hero.label}</span>
              <h1 className="portfolio-hero-title">
                <span>{content.hero.titleLines[0]}</span>
                <span>{content.hero.titleLines[1]}</span>
                <span className="is-accent">{content.hero.titleLines[2]}</span>
              </h1>
              <p className="portfolio-hero-lead">{content.hero.lead}</p>
              <div className="portfolio-hero-actions">
                <button
                  type="button"
                  className="portfolio-button portfolio-button-primary"
                  onClick={() => {
                    scrollToSection('projects')
                  }}
                >
                  {content.hero.primaryCta}
                  <ArrowRight aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="portfolio-button portfolio-button-secondary"
                  onClick={() => {
                    setIsMailModalOpen(true)
                  }}
                >
                  {content.hero.secondaryCta}
                </button>
              </div>
            </motion.div>

            <motion.div className="portfolio-hero-visual" {...revealProps}>
              <div className="portfolio-hero-arc arc-one" />
              <div className="portfolio-hero-arc arc-two" />
              <div className="portfolio-hero-arc arc-three" />
              <div className="portfolio-hero-line line-diagonal" />
              <div className="portfolio-hero-line line-vertical" />
              <div className="portfolio-hero-line line-horizontal" />
              <div className="portfolio-hero-grid-dots dots-top" />
              <div className="portfolio-hero-grid-dots dots-side" />
              <span className="portfolio-hero-point point-a" />
              <span className="portfolio-hero-point point-b" />
              <span className="portfolio-hero-point point-c" />
            </motion.div>
          </div>

          <button
            type="button"
            className="portfolio-scroll-indicator"
            aria-label={content.hero.scroll}
            onClick={() => {
              scrollToSection('projects')
            }}
          >
            <span>{content.hero.scroll}</span>
            <ChevronDown aria-hidden="true" />
          </button>
        </section>

        <section id="projects" className="portfolio-section">
          <div className="portfolio-container">
            <motion.div className="portfolio-section-head" {...revealProps}>
              <div>
                <span className="portfolio-section-label">{content.projects.label}</span>
                <h2 className="portfolio-section-title">{content.projects.title}</h2>
                <p className="portfolio-section-text">{content.projects.description}</p>
              </div>
              <a className="portfolio-button portfolio-button-secondary" href={githubUrl} target="_blank" rel="noreferrer">
                {content.projects.viewAll}
                <ArrowRight aria-hidden="true" />
              </a>
            </motion.div>

            <div className="portfolio-project-grid">
              {projectItems.map((project, index) => (
                <motion.article
                  key={project.id}
                  className="portfolio-project-card"
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: shouldReduceMotion ? 0 : index * 0.06,
                  }}
                >
                  <div className="portfolio-project-media">
                    <img src={project.image} alt={`Aperçu du projet ${project.title}`} />
                  </div>
                  <div className="portfolio-project-body">
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                    <div className="portfolio-badges">
                      {project.technologies.map((technology) => (
                        <span key={technology} className="portfolio-badge">
                          {technology}
                        </span>
                      ))}
                    </div>
                    <a className="portfolio-inline-link" href={githubUrl} target="_blank" rel="noreferrer">
                      {content.projects.cardCta}
                      <ChevronRight aria-hidden="true" />
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="stack" className="portfolio-section">
          <div className="portfolio-container portfolio-two-column">
            <motion.div className="portfolio-section-copy" {...revealProps}>
              <span className="portfolio-section-label">{content.stack.label}</span>
              <h2 className="portfolio-section-title">{content.stack.title}</h2>
              <p className="portfolio-section-text">{content.stack.lead}</p>
              <div className="portfolio-overview-card">
                <span className="portfolio-overview-title">{content.stack.overviewTitle}</span>
                <div className="portfolio-overview-grid">
                  {content.stack.overview.map((item) => (
                    <div key={item.label} className="portfolio-overview-item">
                      <strong>{item.value}</strong>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div className="portfolio-orbit-shell" {...revealProps}>
              <Suspense fallback={<div className="portfolio-orbit-fallback" aria-hidden="true" />}>
                <LazyOrbitingSkills defaultVariant="all" />
              </Suspense>
            </motion.div>
          </div>
        </section>

        <section id="journey" className="portfolio-section">
          <div className="portfolio-container portfolio-two-column">
            <motion.div className="portfolio-section-copy" {...revealProps}>
              <span className="portfolio-section-label">{content.journey.label}</span>
              <h2 className="portfolio-section-title">{content.journey.title}</h2>
            </motion.div>

            <div className="portfolio-timeline">
              {timeline.map((item, index) => (
                <motion.article
                  key={`${item.period}-${index}`}
                  className="portfolio-timeline-item"
                  initial={shouldReduceMotion ? undefined : { opacity: 0, x: 20 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: shouldReduceMotion ? 0 : index * 0.08,
                  }}
                >
                  <div className="portfolio-timeline-marker" aria-hidden="true" />
                  <div className="portfolio-timeline-content">
                    <span className="portfolio-timeline-period">{item.period}</span>
                    <h3>{item.title}</h3>
                    {item.organization ? <p className="portfolio-timeline-organization">{item.organization}</p> : null}
                    <p className="portfolio-timeline-description">{item.description}</p>
                    <div className="portfolio-badges">
                      {item.temporary ? (
                        <span className="portfolio-badge is-warning">{content.journey.placeholderBadge}</span>
                      ) : null}
                      {item.technologies.map((technology) => (
                        <span key={technology} className="portfolio-badge">
                          {technology}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="portfolio-section">
          <div className="portfolio-container portfolio-about-grid">
            <motion.div className="portfolio-portrait-card" {...revealProps}>
              <div className="portfolio-portrait-accent" aria-hidden="true" />
              <div className="portfolio-portrait-placeholder">
                <span>{content.about.portraitTitle}</span>
                <p>{content.about.portraitText}</p>
              </div>
            </motion.div>

            <motion.div className="portfolio-section-copy" {...revealProps}>
              <span className="portfolio-section-label">{content.about.eyebrow}</span>
              <h2 className="portfolio-section-title">
                {content.about.titlePrefix} <span className="portfolio-title-accent">{content.about.titleAccent}</span>
              </h2>
              <p className="portfolio-section-text">{content.about.lead}</p>
              <div className="portfolio-feature-grid">
                {content.about.cards.map((item, index) => {
                  const icons = [Sparkles, ShieldCheck, Globe]
                  const Icon = icons[index] ?? Sparkles
                  return (
                    <article key={item.title} className="portfolio-feature-card">
                      <span className="portfolio-feature-icon">
                        <Icon aria-hidden="true" />
                      </span>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </div>
                    </article>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="contact" className="portfolio-section">
          <div className="portfolio-container portfolio-contact-grid">
            <motion.div className="portfolio-section-copy" {...revealProps}>
              <span className="portfolio-section-label">{content.contact.label}</span>
              <h2 className="portfolio-section-title">
                {content.contact.titleLineOne}
                <br />
                <span className="portfolio-title-accent">{content.contact.titleLineTwo}</span>
              </h2>
              <p className="portfolio-section-text">{content.contact.lead}</p>
            </motion.div>

            <motion.div className="portfolio-contact-actions" {...revealProps}>
              <button type="button" className="portfolio-contact-card" onClick={() => setIsMailModalOpen(true)}>
                <Mail aria-hidden="true" />
                <div>
                  <strong>{content.contact.email}</strong>
                  <span>{content.contact.emailHint}</span>
                </div>
              </button>
              <a className="portfolio-contact-card" href={githubUrl} target="_blank" rel="noreferrer">
                <FaGithub aria-hidden="true" />
                <div>
                  <strong>{content.contact.github}</strong>
                  <span>{content.contact.githubHint}</span>
                </div>
              </a>
              <a className="portfolio-contact-card" href={linkedinUrl} target="_blank" rel="noreferrer">
                <FaLinkedinIn aria-hidden="true" />
                <div>
                  <strong>{content.contact.linkedin}</strong>
                  <span>{content.contact.linkedinHint}</span>
                </div>
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="portfolio-footer">
        <div className="portfolio-container portfolio-footer-inner">
          <div className="portfolio-footer-branding">
            <span className="portfolio-brand footer-brand">WM</span>
            <div>
              <strong>William Mahi</strong>
              <span>{content.footer.role}</span>
            </div>
          </div>
          <div className="portfolio-footer-links" aria-label={content.footer.legalLabel}>
            <span>{content.footer.legal}</span>
            <span>{content.footer.privacy}</span>
            <span>{content.footer.terms}</span>
          </div>
          <p className="portfolio-footer-note">
            © {new Date().getFullYear()} William Mahi. {content.footer.rights}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
