import { lazy, Suspense, useEffect, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { AudienceGate } from '@/components/audience-gate'
import { ContactMessage } from '@/components/contact-message'
import { HomePage } from '@/components/home-page'
import { SocialLinks } from '@/components/social-links'
import { ThemeSwitch } from '@/components/ui/theme-switch'
import { faqContent } from '@/data/faq'
import { services } from '@/data/services'
import { copy, projects, contactEmail, githubUrl, type Language, type ProjectItem } from '@/data/portfolio-content'
import { metadata, paths, resolveRoute, siteOrigin, type PageId } from '@/site'
import './App.css'
import './redesign.css'
import './visual-polish.css'
import './neobrutalism.css'
import './mobile.css'

type MainPage = Exclude<PageId, 'notFound'>
const navPages = ['home', 'projects', 'about', 'contact'] as const satisfies ReadonlyArray<MainPage>
const JourneyTimeline = lazy(() => import('@/components/journey-timeline').then((m) => ({ default: m.JourneyTimeline })))
const AboutActivity = lazy(() => import('@/components/about-activity').then((m) => ({ default: m.AboutActivity })))
const LegalPage = lazy(() => import('@/components/legal-pages').then((m) => ({ default: m.LegalPage })))
const OrbitingSkills = lazy(() => import('@/components/ui/orbiting-skills'))
const ui = {
  fr: {
    home: 'Accueil', projects: 'Projets', expertise: 'Expertises', about: 'À propos', contact: 'Contact', faq: 'FAQ',
    nav: 'Navigation principale', open: 'Ouvrir le menu', close: 'Fermer le menu', skip: 'Aller au contenu',
    role: 'Développeur Full-Stack', availability: 'Freelance et ouvert aux opportunités professionnelles',
    discover: 'Découvrir mes projets', contactMe: 'Me contacter', expertiseCta: 'Voir mes expertises',
    intro: 'Je conçois des interfaces et des applications web utiles, lisibles et maintenables.',
    servicesTitle: 'Ce que je peux construire', servicesIntro: 'Du site web à l’application métier, je relie expérience utilisateur et structure technique.',
    defineNeed: 'Définir ce besoin', viewProject: 'Voir le projet', viewOnGithub: 'Voir sur GitHub', githubProfile: 'Profil GitHub',
    featured: 'Projets à découvrir', allProjects: 'Tous les projets',
    projectsIntro: 'Une sélection de réalisations existantes, présentées avec leurs captures réelles.',
    expertiseIntro: 'Des compétences techniques au service de projets concrets.',
    aboutIntro: 'Mon approche : comprendre le besoin, soigner l’interface et construire une base durable.',
    aboutTitle: 'À propos et expertises',
    contactIntro: 'Parlons de votre projet, d’une mission freelance, d’un recrutement ou d’une question.',
    emailMe: 'Écrire un email', contactWays: 'Retrouvez-moi aussi sur', notFound: 'Cette page est introuvable.', backHome: 'Retour à l’accueil', rights: 'Tous droits réservés.',
  },
  en: {
    home: 'Home', projects: 'Projects', expertise: 'Expertise', about: 'About', contact: 'Contact', faq: 'FAQ',
    nav: 'Main navigation', open: 'Open menu', close: 'Close menu', skip: 'Skip to content',
    role: 'Full-Stack Developer', availability: 'Freelance and open to professional opportunities',
    discover: 'Explore my projects', contactMe: 'Contact me', expertiseCta: 'Explore my expertise',
    intro: 'I build useful, readable and maintainable web interfaces and applications.',
    servicesTitle: 'What I can build', servicesIntro: 'From websites to business applications, I connect user experience with sound technical foundations.',
    defineNeed: 'Define this need', viewProject: 'View project', viewOnGithub: 'View on GitHub', githubProfile: 'GitHub profile',
    featured: 'Featured projects', allProjects: 'All projects',
    projectsIntro: 'A selection of existing work, presented with real screenshots.',
    expertiseIntro: 'Technical skills applied to practical projects.',
    aboutIntro: 'My approach: understand the need, refine the interface and build a durable foundation.',
    aboutTitle: 'About and expertise',
    contactIntro: 'Let’s discuss your project, freelance work, a recruitment opportunity or a question.',
    emailMe: 'Send an email', contactWays: 'Find me on', notFound: 'This page could not be found.', backHome: 'Back to home', rights: 'All rights reserved.',
  },
} as const


const footerContent = {
  fr: { role: 'Développeur web', nav: 'Informations utiles', faq: 'FAQ', legal: 'Mentions légales', terms: 'CGU', privacy: 'Politique de confidentialité', cookies: 'Cookies', exerciseRights: 'Exercer mes droits', copyright: '© 2026 William Mahi. Tous droits réservés.' },
  en: { role: 'Web developer', nav: 'Useful information', faq: 'FAQ', legal: 'Legal notice', terms: 'Terms of use', privacy: 'Privacy policy', cookies: 'Cookies', exerciseRights: 'Exercise my rights', copyright: '© 2026 William Mahi. All rights reserved.' },
} as const

function ProjectCard({ project, language }: { project: ProjectItem; language: Language }) {
  const technologies = project.technologies.filter((item) => !['Stack à préciser', 'Stack to confirm'].includes(item))
  return <article className="project-card" id={project.id}><div className="project-image"><img src={project.image} alt={language === 'fr' ? 'Capture du projet ' + project.title : 'Screenshot of ' + project.title} width="1100" height="540" loading="lazy" decoding="async" /></div><div className="project-body"><h3>{project.title}</h3><p>{project.summary}</p>{technologies.length > 0 && <div className="portfolio-badges">{technologies.map((item) => <span className="portfolio-badge" key={item}>{item}</span>)}</div>}<a className="text-link" href={project.href ?? githubUrl} target="_blank" rel="noopener noreferrer">{project.href ? (project.href.includes('github.com') ? ui[language].viewOnGithub : ui[language].viewProject) : ui[language].githubProfile} <ArrowRight aria-hidden="true" /></a></div></article>
}

function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <div className="page-header container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></div>
}

export default function App({ pathname }: { pathname?: string }) {
  const currentPath = pathname ?? (typeof window === 'undefined' ? '/' : window.location.pathname)
  const { language, page } = resolveRoute(currentPath)
  const t = ui[language]
  const c = copy[language]
  const p = paths[language]
  const faq = faqContent[language]
  const footer = footerContent[language]
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<{ label: string; category: string; purpose: string } | null>(null)
  const otherLanguage: Language = language === 'fr' ? 'en' : 'fr'
  const rightsHash = page === 'privacy' && typeof window !== 'undefined' && window.location.hash === '#rights' ? '#rights' : ''
  const otherPath = (page === 'notFound' ? paths[otherLanguage].home : paths[otherLanguage][page]) + (page === 'configurator' && typeof window !== 'undefined' ? window.location.search : '') + rightsHash
  const contactMailto = `mailto:${contactEmail}`

  // The old configurator now lives in the home page guide: keep its URLs working and carry the chosen path over.
  useEffect(() => {
    if (page === 'configurator') window.location.replace(`${p.home}${window.location.search}#votre-projet`)
  }, [page, p.home])

  // Expertise is now a section of the About page: the old URL keeps working and lands on that section.
  useEffect(() => {
    if (page === 'expertise') window.location.replace(`${p.about}#expertises`)
  }, [page, p.about])

  useEffect(() => {
    document.documentElement.lang = language
    document.title = metadata[language][page].title
    document.querySelector('meta[name="description"]')?.setAttribute('content', metadata[language][page].description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', siteOrigin + (page === 'notFound' ? currentPath : page === 'expertise' ? p.about : p[page]))
  }, [language, page, currentPath, p])

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus()
    }
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!(event.target as Element).closest('.site-header')) setMenuOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOnOutsideClick)
    }
  }, [menuOpen])

  return <div className={'site-shell' + (page === 'home' ? ' home-shell' : '')}>
    <a className="skip-link" href="#content">{t.skip}</a>
    <header className="site-header"><div className="header-inner"><a className="brand" href={p.home} aria-label={language === 'fr' ? 'William Mahi, accueil' : 'William Mahi, home'}><img src="/logo-portfolio.svg" alt="WM" width="104" height="48" /></a><nav className="desktop-nav" aria-label={t.nav}>{navPages.map((id) => <a href={p[id]} key={id} aria-current={page === id ? 'page' : undefined}>{t[id]}</a>)}</nav><div className="header-controls"><a className="language-link" href={otherPath} lang={otherLanguage} hrefLang={otherLanguage} aria-label={language === 'fr' ? 'Read this page in English' : 'Lire cette page en français'}>{otherLanguage.toUpperCase()}</a><ThemeSwitch className="theme-switch" lightThemeLabel={c.theme.light} darkThemeLabel={c.theme.dark} /><button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? t.close : t.open} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button></div></div>{menuOpen && <nav id="mobile-navigation" className="mobile-nav" aria-label={t.nav}>{navPages.map((id) => <a href={p[id]} key={id} aria-current={page === id ? 'page' : undefined}>{t[id]}</a>)}</nav>}</header>
    <main id="content"><Suspense fallback={null}>
      {page === 'home' && <><AudienceGate language={language} /><HomePage language={language} /></>}
      
      {page === 'projects' && <><PageHeader eyebrow={t.projects} title={c.projects.title} intro={t.projectsIntro} /><section className="section page-section"><div className="container project-grid">{projects[language].map((project) => <ProjectCard key={project.id} project={project} language={language} />)}</div></section></>}
      {(page === 'about' || page === 'expertise') && <><PageHeader eyebrow={t.role} title={t.aboutTitle} intro={t.aboutIntro} /><section className="section about-section"><div className="container about-layout"><div className="portrait-frame"><img src="/portrait-william-mahi.webp" alt={c.about.portraitAlt} width="900" height="900" decoding="async" /></div><div className="about-copy"><span className="eyebrow">{t.role}</span><h2>{c.about.titlePrefix + ' ' + c.about.titleAccent}</h2><p>{c.about.lead}</p><div className="about-values">{c.about.cards.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div></div></section><section className="section expertise-section" id="expertises"><div className="container expertise-layout"><div className="expertise-copy"><h2>{c.stack.label}</h2><p>{c.stack.lead}</p><div className="skill-detail" aria-live="polite">{selectedSkill ? <><span className="eyebrow">{selectedSkill.category}</span><h3>{selectedSkill.label}</h3><p>{selectedSkill.purpose}</p></> : <p>{language === 'fr' ? 'Survolez une compétence ou parcourez la roue au clavier pour en savoir plus.' : 'Hover over a skill or explore the wheel with your keyboard to learn more.'}</p>}</div></div><div className="orbit-frame"><Suspense fallback={<div className="orbit-loading" aria-hidden="true" />}><OrbitingSkills defaultVariant="all" language={language} onSkillHoverChange={setSelectedSkill} /></Suspense></div></div></section><section className="section section-soft"><div className="container"><div className="section-heading"><span className="eyebrow">{t.expertise}</span><h2>{t.servicesTitle}</h2></div><div className="services-grid">{services[language].map((service) => <article className="service-card" key={service.id}><h3>{service.title}</h3><p>{service.text}</p><a className="text-link" href={`${p.home}?parcours=${service.path}#votre-projet`}>{t.defineNeed} <ArrowRight aria-hidden="true" /></a></article>)}</div></div></section><section className="section timeline-section"><div className="container"><JourneyTimeline language={language} label={c.journey.label} title={c.journey.title} intro={c.journey.intro} /></div></section><section className="section section-soft"><div className="container"><AboutActivity language={language} /></div></section></>}
      {page === 'contact' && <><PageHeader eyebrow={t.contact} title={c.contact.titleLineOne + ' ' + c.contact.titleLineTwo} intro={t.contactIntro} /><section className="section contact-section"><div className="container contact-layout"><div className="contact-primary"><span className="eyebrow">Email</span><h2>{t.contactMe}</h2><p>{c.contact.lead}</p><a className="button button-primary" href={`${p.home}#votre-projet`}>{language === 'fr' ? 'Décrire mon projet' : 'Describe my project'}<ArrowRight aria-hidden="true" /></a><a className="contact-address" href={contactMailto}>{contactEmail}</a></div><div className="contact-secondary"><span className="eyebrow">{t.contactWays}</span><SocialLinks language={language} variant="contact" /></div></div><div className="container"><ContactMessage language={language} /></div></section></>}
      {page === 'faq' && <section className="faq-page"><div className="container"><header className="faq-page-heading"><span className="eyebrow">{faq.label}</span><h1>{faq.title}</h1><p>{faq.intro}</p></header><div className="faq-page-list">{faq.items.map(([question, answer], index) => <article key={question}><span>0{index + 1}</span><div><h2>{question}</h2><p>{answer}</p></div></article>)}</div></div></section>}
      {(page === 'legal' || page === 'terms' || page === 'privacy' || page === 'cookies') && <LegalPage kind={page} language={language} />}
      {page === 'notFound' && <section className="not-found container"><span className="eyebrow">404</span><h1>{t.notFound}</h1><a className="button button-primary" href={p.home}>{t.backHome}<ArrowRight aria-hidden="true" /></a></section>}
    </Suspense></main>
    <footer className="site-footer"><div className="container footer-inner"><a className="footer-brand" href={p.home}><img src="/logo-portfolio.svg" alt="WM" width="104" height="48" /><span><strong>William Mahi</strong><small>{footer.role}</small></span></a><nav aria-label={footer.nav}><a className="footer-link-button" href={p.faq}>{footer.faq}</a><a className="footer-link-button" href={p.legal}>{footer.legal}</a><a className="footer-link-button" href={p.terms}>{footer.terms}</a><a className="footer-link-button" href={p.privacy}>{footer.privacy}</a><a className="footer-link-button" href={p.cookies}>{footer.cookies}</a><a className="footer-link-button" href={p.privacy + '#rights'}>{footer.exerciseRights}</a></nav><span className="footer-copy">{footer.copyright}</span></div></footer>
  </div>
}
