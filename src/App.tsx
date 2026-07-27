import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ChevronDown, ChevronRight, Globe, Menu, ShieldCheck, Sparkles, X } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { JourneyTimeline } from '@/components/journey-timeline'
import { SocialLinks } from '@/components/social-links'
import { ThemeSwitch } from '@/components/ui/theme-switch'
import {
  copy,
  githubUrl,
  languageOptions,
  projects,
  type Language,
} from '@/data/portfolio-content'
import './App.css'

const LazyOrbitingSkills = lazy(() => import('@/components/ui/orbiting-skills'))

const sectionIds = ['projects', 'stack', 'journey', 'about', 'contact'] as const
type SectionId = (typeof sectionIds)[number]

function App() {
  const [hoveredStackSkill, setHoveredStackSkill] = useState<{
    label: string
    category: string
    purpose: string
  } | null>(null)
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') {
      return 'fr'
    }

    const savedLanguage = localStorage.getItem('language')
    return savedLanguage === 'en' ? 'en' : 'fr'
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionId>('projects')
  const languageMenuRef = useRef<HTMLDivElement | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const content = copy[language]
  const projectItems = projects[language]
  const nextSectionAriaLabel = language === 'fr' ? 'Aller à la section suivante' : 'Go to the next section'
  const contactEyebrow = language === 'fr' ? '• CONTACT' : '• CONTACT'
  const contactTitle = language === 'fr' ? 'Vous avez un projet en tête ?' : 'Do you have a project in mind?'
  const contactAvailability = language === 'fr' ? 'DISPONIBLE' : 'AVAILABLE'
  const contactPrimaryCta = language === 'fr' ? 'DISCUTONS-EN !' : `LET'S TALK!`

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

  const scrollToSection = (
    sectionId: SectionId | 'top' | 'content',
    block: ScrollLogicalPosition = 'start',
  ) => {
    const target = document.getElementById(sectionId)
    if (!target) {
      return
    }

    target.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      block,
    })
    setIsMenuOpen(false)
  }

  const renderSectionJumpButton = (sourceSection: SectionId, targetSection: SectionId) => (
    <button
      type="button"
      className={`portfolio-scroll-indicator portfolio-scroll-indicator--section${
        activeSection === sourceSection ? ' is-visible' : ''
      }`}
      aria-label={nextSectionAriaLabel}
      onClick={() => {
        scrollToSection(targetSection, 'center')
      }}
    >
      <ChevronDown aria-hidden="true" />
    </button>
  )

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
                <SocialLinks language={language} variant="hero" />
              </div>
            </motion.div>

          </div>

          <button
            type="button"
            className="portfolio-scroll-indicator"
            aria-label={content.hero.scroll}
            onClick={() => {
              scrollToSection('projects', 'center')
            }}
          >
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
          {renderSectionJumpButton('projects', 'stack')}
        </section>

        <section id="stack" className="portfolio-section">
          <div className="portfolio-container portfolio-two-column">
            <motion.div className="portfolio-section-copy" {...revealProps}>
              <span className="portfolio-section-label">{content.stack.label}</span>
              <h2 className="portfolio-section-title">{content.stack.title}</h2>
              <p className="portfolio-section-text">{content.stack.lead}</p>
              <div className="portfolio-terminal-card" aria-label="Linux terminal preview">
                <div className="portfolio-terminal-toolbar" aria-hidden="true">
                  <span className="portfolio-terminal-dot is-red" />
                  <span className="portfolio-terminal-dot is-amber" />
                  <span className="portfolio-terminal-dot is-green" />
                  <span className="portfolio-terminal-title">william@portfolio:~</span>
                </div>
                <div className="portfolio-terminal-body">
                  {hoveredStackSkill ? (
                    <>
                      <p>
                        <span className="portfolio-terminal-prompt">$</span> cat name.txt
                      </p>
                      <p className="portfolio-terminal-output">{hoveredStackSkill.label}</p>
                      <p>
                        <span className="portfolio-terminal-prompt">$</span> cat purpose.txt
                      </p>
                      <p className="portfolio-terminal-output">{hoveredStackSkill.purpose}</p>
                      <p>
                        <span className="portfolio-terminal-prompt">$</span> cat category.txt
                      </p>
                      <p className="portfolio-terminal-output is-success">
                        {hoveredStackSkill.category}
                      </p>
                    </>
                  ) : null}
                </div>
              </div>
            </motion.div>

            <motion.div className="portfolio-orbit-shell" {...revealProps}>
              <Suspense fallback={<div className="portfolio-orbit-fallback" aria-hidden="true" />}>
                <LazyOrbitingSkills
                  defaultVariant="all"
                  onSkillHoverChange={setHoveredStackSkill}
                />
              </Suspense>
            </motion.div>
          </div>
          {renderSectionJumpButton('stack', 'journey')}
        </section>

        <section id="journey" className="portfolio-section">
          <div className="portfolio-container">
            <JourneyTimeline
              language={language}
              label={content.journey.label}
              title={content.journey.title}
              intro={content.journey.intro}
            />
          </div>
          {renderSectionJumpButton('journey', 'about')}
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
          {renderSectionJumpButton('about', 'contact')}
        </section>

        <section id="contact" className="portfolio-section portfolio-contact-section">
          <div className="portfolio-container">
            <motion.div className="portfolio-contact-card-shell" {...revealProps}>
              <div className="portfolio-contact-card-panel">
                <div className="portfolio-contact-header">
                  <span className="portfolio-contact-eyebrow">{contactEyebrow}</span>
                  <h2 className="portfolio-contact-title">{contactTitle}</h2>
                </div>

                <div className="portfolio-contact-cta-row">
                  <div className="portfolio-contact-status" aria-label={contactAvailability}>
                    <span className="portfolio-contact-status-dot" aria-hidden="true">
                      <span className="portfolio-contact-status-dot-ping" />
                      <span className="portfolio-contact-status-dot-core" />
                    </span>
                    <span>{contactAvailability}</span>
                  </div>

                  <a className="portfolio-contact-primary-cta" href="mailto:william.mahipro@gmail.com">
                    {contactPrimaryCta}
                    <ArrowDown aria-hidden="true" />
                  </a>
                </div>

                <p className="portfolio-contact-description">{content.contact.lead}</p>

                <div className="portfolio-contact-footer">
                  <SocialLinks language={language} variant="contact" />
                </div>
              </div>
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
