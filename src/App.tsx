import { useEffect, useRef, useState } from 'react'
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

type Language = 'fr' | 'en'

const languageOptions = [
  { value: 'fr', shortLabel: 'FR', longLabel: 'Francais' },
  { value: 'en', shortLabel: 'EN', longLabel: 'English' },
] as const

const copy = {
  fr: {
    meta: {
      title: 'William Mahi | Developpeur full-stack',
      description:
        'Portfolio de William Mahi, developpeur full-stack. Interfaces React soignees, back-end Node fiable et experiences web rapides.',
    },
    nav: {
      skipToContent: 'Aller au contenu',
      sectionsLabel: 'Sections du portfolio',
      projects: 'Projets',
      stack: 'Stack',
      about: 'A propos',
    },
    hero: {
      title: 'Base solide. Maintenance durable.',
      lead:
        'Developpement front-end et back-end avec une execution propre, une logique claire et des choix techniques faciles a lire.',
      jumpToProjects: 'Defiler vers les projets',
    },
    stack: {
      kicker: 'Stack / competences',
      title: 'Une stack claire, une base solide.',
      lead:
        'Cette vue regroupe les langages et frameworks principaux : Python, HTML, TypeScript, JavaScript, Bootstrap, CSS, GraphQL, Ruby, Ruby on Rails, React, Tailwind CSS et Next.js.',
      visualLabel: "Vue d'ensemble",
      visualText:
        'Une vue unique pour situer rapidement les langages, frameworks et outils de travail.',
      jumpToAbout: 'Defiler vers la section A propos',
    },
    about: {
      kicker: 'A propos',
      title: 'Construire quelque chose qui dure.',
      lead:
        `"Base solide. Maintenance durable." n'est pas qu'une formule visuelle. C'est une maniere de penser un projet : poser une base propre, faire des choix comprehensibles et garder assez de clarte pour que le produit puisse evoluer sans se fragiliser.`,
      photoPlaceholder: 'Photo',
      photoText: 'Emplacement reserve pour ton portrait.',
      items: [
        {
          title: 'Une base claire avant tout.',
          text:
            "Je cherche a construire des projets que l'on peut comprendre rapidement, reprendre facilement et faire evoluer sans repartir de zero.",
        },
        {
          title: 'Un produit qui tient quand il evolue.',
          text:
            "Pour moi, un projet solide n'est pas seulement un projet qui fonctionne. C'est un projet qui reste propre quand on ajoute des besoins, des pages ou de la logique.",
        },
        {
          title: 'Une execution lisible du front au back.',
          text:
            "J'essaie de garder la meme exigence partout : une interface nette, une logique explicite et une structure assez simple pour rester maintenable dans le temps.",
        },
      ],
    },
    projects: {
      ctaLabel: 'Voir le projet',
      jumpToStack: 'Defiler vers la stack',
      items: [
        {
          id: 'rubber-duck',
          title: 'Rubber Duck',
          summary:
            'Outil pedagogique pour aider au raisonnement par etapes, avec une interface de guidage, une logique de contexte et une structure produit exploitable.',
          url: 'stack',
          image:
            'https://images.unsplash.com/photo-1763568258844-b31a923568b8?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1400',
        },
        {
          id: 'sakura-line',
          title: 'Sakura Line Studio',
          summary:
            "Site pour une tatoueuse a l'univers sakura, pense pour l'autogestion du contenu, avec une presentation claire de l'activite et des mises a jour simples.",
          url: 'stack',
          image:
            'https://images.unsplash.com/photo-1775135786145-7073d65228a1?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1400',
        },
        {
          id: 'questonnaut',
          title: 'Questonnaut',
          summary:
            'Application de creation d habitudes gamifiee, concue pour rendre le suivi plus engageant, plus lisible et plus motivant au quotidien.',
          url: 'stack',
          image:
            'https://images.unsplash.com/photo-1764664281860-c5725fafa634?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1400',
        },
        {
          id: 'portfolio',
          title: 'Portfolio',
          summary:
            'Portfolio personnel concu pour presenter mon approche, mes projets et ma maniere de construire des interfaces lisibles avec une base technique maintenable.',
          url: 'stack',
          image:
            'https://images.unsplash.com/photo-1520583457224-aee11bad5112?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGRldmVsb3BlciUyMGRlc2t8ZW58MHx8MHx8fDA%3D&ixlib=rb-4.1.0&q=80&w=1400',
        },
      ],
    },
    contact: {
      kicker: 'Contact',
      title: 'Un projet en tete ?',
      text:
        "Si mon approche te parle, on peut echanger simplement autour d'une idee, d'un besoin produit ou d'une collaboration.",
    },
    footer: {
      copy: 'Portfolio personnel. Conception, integration front-end et structuration produit.',
      legalLabel: 'Informations legales',
      legal: 'Mentions legales',
      privacy: 'Politique de confidentialite',
      terms: "Conditions d'utilisation",
      rights: 'Tous droits reserves.',
    },
    language: {
      label: 'Selection de la langue',
      fr: 'FR',
      en: 'EN',
    },
    actions: {
      viewProjects: 'Voir les projets',
      email: 'Mail',
      github: 'GitHub',
      linkedin: 'LinkedIn',
    },
    mailModal: {
      title: 'Me contacter',
      text: "Tu peux m'ecrire directement par email. Si ton client mail ne s'ouvre pas bien, l'adresse reste visible ici.",
      copy: 'Copier le mail',
      copied: 'Mail copie',
      close: 'Fermer',
    },
    theme: {
      light: 'Activer le theme clair',
      dark: 'Activer le theme sombre',
    },
  },
  en: {
    meta: {
      title: 'William Mahi | Full-stack developer',
      description:
        'Portfolio of William Mahi, full-stack developer. Thoughtful React interfaces, reliable Node back-end, and fast web experiences.',
    },
    nav: {
      skipToContent: 'Skip to content',
      sectionsLabel: 'Portfolio sections',
      projects: 'Projects',
      stack: 'Stack',
      about: 'About',
    },
    hero: {
      title: 'Solid foundation. Durable maintenance.',
      lead:
        'Front-end and back-end development with clean execution, clear logic, and technical choices that are easy to understand.',
      jumpToProjects: 'Scroll to projects',
    },
    stack: {
      kicker: 'Stack / skills',
      title: 'Clear stack, solid foundation.',
      lead:
        'This view brings together the main languages and frameworks: Python, HTML, TypeScript, JavaScript, Bootstrap, CSS, GraphQL, Ruby, Ruby on Rails, React, Tailwind CSS, and Next.js.',
      visualLabel: 'Overview',
      visualText:
        'A single view to quickly map the main languages, frameworks, and working tools.',
      jumpToAbout: 'Scroll to the About section',
    },
    about: {
      kicker: 'About',
      title: 'Build something that lasts.',
      lead:
        '"Solid foundation. Durable maintenance." is not just a visual tagline. It is a way to think about a product: start from a clean base, make understandable decisions, and keep enough clarity for the product to evolve without becoming fragile.',
      photoPlaceholder: 'Photo',
      photoText: 'Reserved space for your portrait.',
      items: [
        {
          title: 'Clarity first.',
          text:
            'I aim to build projects that can be understood quickly, picked up easily, and evolved without starting from scratch.',
        },
        {
          title: 'A product that holds up as it grows.',
          text:
            'To me, a solid product is not only one that works. It is one that stays clean when new needs, pages, or logic are added.',
        },
        {
          title: 'Readable execution from front to back.',
          text:
            'I try to keep the same standard everywhere: a sharp interface, explicit logic, and a structure simple enough to stay maintainable over time.',
        },
      ],
    },
    projects: {
      ctaLabel: 'View project',
      jumpToStack: 'Scroll to the stack',
      items: [
        {
          id: 'rubber-duck',
          title: 'Rubber Duck',
          summary:
            'A pedagogical tool designed to support step-by-step reasoning, with guided interactions, contextual logic, and a usable product structure.',
          url: 'stack',
          image:
            'https://images.unsplash.com/photo-1763568258844-b31a923568b8?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1400',
        },
        {
          id: 'sakura-line',
          title: 'Sakura Line Studio',
          summary:
            'A website for a tattoo artist with a sakura-inspired visual world, built for easy content management, clear presentation, and simple updates.',
          url: 'stack',
          image:
            'https://images.unsplash.com/photo-1775135786145-7073d65228a1?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1400',
        },
        {
          id: 'questonnaut',
          title: 'Questonnaut',
          summary:
            'A gamified habit-building app designed to make progress tracking more engaging, more readable, and more motivating every day.',
          url: 'stack',
          image:
            'https://images.unsplash.com/photo-1764664281860-c5725fafa634?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1400',
        },
        {
          id: 'portfolio',
          title: 'Portfolio',
          summary:
            'A personal portfolio built to present my approach, my projects, and the way I design readable interfaces on top of a maintainable technical foundation.',
          url: 'stack',
          image:
            'https://images.unsplash.com/photo-1520583457224-aee11bad5112?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGRldmVsb3BlciUyMGRlc2t8ZW58MHx8MHx8fDA%3D&ixlib=rb-4.1.0&q=80&w=1400',
        },
      ],
    },
    contact: {
      kicker: 'Contact',
      title: 'Have a project in mind?',
      text:
        'If my approach speaks to you, we can talk simply about an idea, a product need, or a collaboration.',
    },
    footer: {
      copy: 'Personal portfolio. Front-end design, implementation, and product structuring.',
      legalLabel: 'Legal information',
      legal: 'Legal notice',
      privacy: 'Privacy policy',
      terms: 'Terms of use',
      rights: 'All rights reserved.',
    },
    language: {
      label: 'Language selection',
      fr: 'FR',
      en: 'EN',
    },
    actions: {
      viewProjects: 'View projects',
      email: 'Email',
      github: 'GitHub',
      linkedin: 'LinkedIn',
    },
    mailModal: {
      title: 'Get in touch',
      text: 'You can email me directly. If your mail client does not open properly, the address stays visible here.',
      copy: 'Copy email',
      copied: 'Email copied',
      close: 'Close',
    },
    theme: {
      light: 'Enable light theme',
      dark: 'Enable dark theme',
    },
  },
} as const

function PortfolioPage() {
  const [language, setLanguage] = useState<Language>('fr')
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const [isMailModalOpen, setIsMailModalOpen] = useState(false)
  const [isEmailCopied, setIsEmailCopied] = useState(false)
  const languageMenuRef = useRef<HTMLDivElement | null>(null)
  const content = copy[language]
  const contactEmail = 'william.mahipro@gmail.com'

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')

    if (savedLanguage === 'fr' || savedLanguage === 'en') {
      setLanguage(savedLanguage)
    }
  }, [])

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

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLanguageMenuOpen(false)
        setIsMailModalOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    if (!isMailModalOpen) {
      return
    }

    const { body } = document
    const previousOverflow = body.style.overflow
    body.style.overflow = 'hidden'

    return () => {
      body.style.overflow = previousOverflow
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

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail)
      setIsEmailCopied(true)
    } catch {
      setIsEmailCopied(false)
    }
  }

  const heroMenuItems = [
    {
      title: content.actions.viewProjects,
      icon: <LuFolderOpen />,
      gradientFrom: '#56ccf2',
      gradientTo: '#2f80ed',
      onClick: () => {
        scrollToSection('projects')
      },
    },
    {
      title: content.actions.github,
      icon: <FaGithub />,
      gradientFrom: '#8b5cf6',
      gradientTo: '#d946ef',
      href: 'https://github.com/dashboard',
      external: true,
    },
    {
      title: content.actions.email,
      icon: <LuMail />,
      gradientFrom: '#80ff72',
      gradientTo: '#7ee8fa',
      onClick: () => {
        setIsMailModalOpen(true)
      },
    },
    {
      title: content.actions.linkedin,
      icon: <FaLinkedinIn />,
      gradientFrom: '#60a5fa',
      gradientTo: '#2563eb',
      href: 'https://www.linkedin.com/in/william-mahi-9727243a3/',
      external: true,
    },
  ]

  const contactMenuItems = [
    {
      title: content.actions.email,
      icon: <LuMail />,
      gradientFrom: '#80ff72',
      gradientTo: '#7ee8fa',
      onClick: () => {
        setIsMailModalOpen(true)
      },
    },
    {
      title: content.actions.github,
      icon: <FaGithub />,
      gradientFrom: '#8b5cf6',
      gradientTo: '#d946ef',
      href: 'https://github.com/dashboard',
      external: true,
    },
    {
      title: content.actions.linkedin,
      icon: <FaLinkedinIn />,
      gradientFrom: '#60a5fa',
      gradientTo: '#2563eb',
      href: 'https://www.linkedin.com/in/william-mahi-9727243a3/',
      external: true,
    },
  ]

  const activeLanguage = languageOptions.find((option) => option.value === language) ?? languageOptions[0]

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
            className="portfolio-modal"
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            <div className="portfolio-modal-header">
              <h2 id="mail-modal-title" className="portfolio-modal-title">
                {content.mailModal.title}
              </h2>
              <button
                type="button"
                className="portfolio-modal-close"
                aria-label={content.mailModal.close}
                onClick={() => {
                  setIsMailModalOpen(false)
                }}
              >
                ×
              </button>
            </div>
            <p className="portfolio-modal-text">{content.mailModal.text}</p>
            <div className="portfolio-modal-email">{contactEmail}</div>
            <div className="portfolio-modal-actions">
              <button type="button" className="portfolio-button" onClick={copyEmailToClipboard}>
                {isEmailCopied ? content.mailModal.copied : content.mailModal.copy}
              </button>
              <button
                type="button"
                className="portfolio-button portfolio-button-secondary"
                onClick={() => {
                  setIsMailModalOpen(false)
                }}
              >
                {content.mailModal.close}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="skip-link"
        onClick={() => {
          scrollToSection('content')
        }}
      >
        {content.nav.skipToContent}
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

          <nav className="portfolio-nav-links" aria-label={content.nav.sectionsLabel}>
            <button
              type="button"
              className="portfolio-nav-link portfolio-link-button"
              onClick={() => {
                scrollToSection('projects')
              }}
            >
              {content.nav.projects}
            </button>
            <button
              type="button"
              className="portfolio-nav-link portfolio-link-button"
              onClick={() => {
                scrollToSection('stack')
              }}
            >
              {content.nav.stack}
            </button>
            <button
              type="button"
              className="portfolio-nav-link portfolio-link-button"
              onClick={() => {
                scrollToSection('about')
              }}
            >
              {content.nav.about}
            </button>
          </nav>

          <div className="portfolio-nav-controls">
            <div className="portfolio-language-menu" ref={languageMenuRef}>
              <button
                type="button"
                className={`portfolio-language-trigger${isLanguageMenuOpen ? ' is-open' : ''}`}
                onClick={() => {
                  setIsLanguageMenuOpen((currentValue) => !currentValue)
                }}
                aria-label={content.language.label}
                aria-haspopup="menu"
                aria-expanded={isLanguageMenuOpen}
              >
                <span>{activeLanguage.shortLabel}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={`portfolio-language-trigger-icon${isLanguageMenuOpen ? ' is-open' : ''}`}
                />
              </button>

              {isLanguageMenuOpen ? (
                <div className="portfolio-language-dropdown" role="menu" aria-label={content.language.label}>
                  {languageOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`portfolio-language-dropdown-item${language === option.value ? ' is-active' : ''}`}
                      onClick={() => {
                        setLanguage(option.value)
                        setIsLanguageMenuOpen(false)
                      }}
                      role="menuitemradio"
                      aria-checked={language === option.value}
                    >
                      <span className="portfolio-language-dropdown-short">{option.shortLabel}</span>
                      <span className="portfolio-language-dropdown-long">{option.longLabel}</span>
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
          </div>
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
              <h1 className="portfolio-title">{content.hero.title}</h1>
              <p className="portfolio-lead">{content.hero.lead}</p>
              <GradientMenu items={heroMenuItems} className="mt-5" />
            </div>
          </div>
        </section>
        <button
          type="button"
          className="portfolio-section-jump portfolio-hero-jump"
          aria-label={content.hero.jumpToProjects}
          onClick={() => {
            scrollToSection('projects')
          }}
        >
          <ChevronDown aria-hidden="true" />
        </button>

        <section id="projects" className="portfolio-section portfolio-projects-section">
          <Gallery6
            items={content.projects.items}
            itemCtaLabel={content.projects.ctaLabel}
            onNavigateToSection={scrollToSection}
          />
          <button
            type="button"
            className="portfolio-section-jump"
            aria-label={content.projects.jumpToStack}
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
              <p className="portfolio-kicker">{content.stack.kicker}</p>
              <h2 className="portfolio-section-title">{content.stack.title}</h2>
              <p className="portfolio-section-lead">{content.stack.lead}</p>
              <div className="portfolio-stack-visual-head">
                <span className="portfolio-project-label">{content.stack.visualLabel}</span>
                <p className="portfolio-stack-visual-text">{content.stack.visualText}</p>
              </div>
            </div>

            <div className="portfolio-stack-visual">
              <OrbitingSkills defaultVariant="all" />
            </div>
          </div>
          <button
            type="button"
            className="portfolio-section-jump"
            aria-label={content.stack.jumpToAbout}
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
                  <span className="portfolio-project-label">{content.about.photoPlaceholder}</span>
                  <p className="portfolio-about-photo-text">{content.about.photoText}</p>
                </div>
              </div>
            </div>

            <div className="portfolio-heading portfolio-about-copy">
              <p className="portfolio-kicker">{content.about.kicker}</p>
              <h2 className="portfolio-section-title">{content.about.title}</h2>
              <p className="portfolio-section-lead">{content.about.lead}</p>

              <div className="portfolio-about-card">
                {content.about.items.map((item, index) => (
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
            <p className="portfolio-kicker">{content.contact.kicker}</p>
            <h2 className="portfolio-contact-title">{content.contact.title}</h2>
            <p className="portfolio-contact-text">{content.contact.text}</p>
            <GradientMenu items={contactMenuItems} className="mt-8" />
          </div>
        </section>
      </main>

      <footer className="portfolio-footer">
        <div className="portfolio-footer-inner">
          <div className="portfolio-footer-meta">
            <p className="portfolio-footer-brand">William Mahi</p>
            <p className="portfolio-footer-copy">{content.footer.copy}</p>
          </div>
          <div className="portfolio-footer-links" aria-label={content.footer.legalLabel}>
            <span className="portfolio-footer-link">{content.footer.legal}</span>
            <span className="portfolio-footer-link">{content.footer.privacy}</span>
            <span className="portfolio-footer-link">{content.footer.terms}</span>
          </div>
          <p className="portfolio-footer-note">
            © {new Date().getFullYear()} William Mahi. {content.footer.rights}
          </p>
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
