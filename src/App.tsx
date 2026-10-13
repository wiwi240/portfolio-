import { lazy, Suspense, useEffect, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { JourneyTimeline } from '@/components/journey-timeline'
import { SocialLinks } from '@/components/social-links'
import { ThemeSwitch } from '@/components/ui/theme-switch'
import { copy, projects, contactEmail, githubUrl, type Language, type ProjectItem } from '@/data/portfolio-content'
import { metadata, paths, resolveRoute, siteOrigin, type PageId } from '@/site'
import './App.css'
import './redesign.css'

type MainPage = Exclude<PageId, 'notFound'>
const navPages: MainPage[] = ['home', 'projects', 'expertise', 'about', 'contact']
const OrbitingSkills = lazy(() => import('@/components/ui/orbiting-skills'))
const ui = {
  fr: {
    home: 'Accueil', projects: 'Projets', expertise: 'Expertises', about: 'À propos', contact: 'Contact',
    nav: 'Navigation principale', open: 'Ouvrir le menu', close: 'Fermer le menu', skip: 'Aller au contenu',
    role: 'Développeur Full-Stack', availability: 'Freelance et ouvert aux opportunités professionnelles',
    discover: 'Découvrir mes projets', contactMe: 'Me contacter', expertiseCta: 'Voir mes expertises',
    intro: 'Je conçois des interfaces et des applications web utiles, lisibles et maintenables.',
    servicesTitle: 'Ce que je peux construire', servicesIntro: 'Du site web à l’application métier, je relie expérience utilisateur et structure technique.',
    services: ['Sites web', 'Applications web', 'Logiciels métier', 'Refonte et maintenance'],
    featured: 'Projets à découvrir', allProjects: 'Tous les projets',
    projectsIntro: 'Une sélection de réalisations existantes, présentées avec leurs captures réelles.',
    expertiseIntro: 'Des compétences techniques au service de projets concrets.',
    aboutIntro: 'Mon approche : comprendre le besoin, soigner l’interface et construire une base durable.',
    contactIntro: 'Parlons de votre projet, d’une mission freelance, d’un recrutement ou d’une question.',
    emailMe: 'Écrire un email', contactWays: 'Retrouvez-moi aussi sur', notFound: 'Cette page est introuvable.', backHome: 'Retour à l’accueil', rights: 'Tous droits réservés.',
  },
  en: {
    home: 'Home', projects: 'Projects', expertise: 'Expertise', about: 'About', contact: 'Contact',
    nav: 'Main navigation', open: 'Open menu', close: 'Close menu', skip: 'Skip to content',
    role: 'Full-Stack Developer', availability: 'Freelance and open to professional opportunities',
    discover: 'Explore my projects', contactMe: 'Contact me', expertiseCta: 'Explore my expertise',
    intro: 'I build useful, readable and maintainable web interfaces and applications.',
    servicesTitle: 'What I can build', servicesIntro: 'From websites to business applications, I connect user experience with sound technical foundations.',
    services: ['Websites', 'Web applications', 'Business software', 'Redesign and maintenance'],
    featured: 'Featured projects', allProjects: 'All projects',
    projectsIntro: 'A selection of existing work, presented with real screenshots.',
    expertiseIntro: 'Technical skills applied to practical projects.',
    aboutIntro: 'My approach: understand the need, refine the interface and build a durable foundation.',
    contactIntro: 'Let’s discuss your project, freelance work, a recruitment opportunity or a question.',
    emailMe: 'Send an email', contactWays: 'Find me on', notFound: 'This page could not be found.', backHome: 'Back to home', rights: 'All rights reserved.',
  },
} as const

function Wave({ strong = false }: { strong?: boolean }) {
  return <svg className={'wave' + (strong ? ' wave-strong' : '')} viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path className="wave-back" d="M0 65C230 136 344 111 541 58C762 0 920 21 1090 67C1239 108 1343 89 1440 56V160H0Z" /><path className="wave-front" d="M0 100C210 58 345 101 516 123C713 148 838 65 1036 63C1219 61 1331 119 1440 100V160H0Z" /></svg>
}

function ProjectCard({ project, language }: { project: ProjectItem; language: Language }) {
  const technologies = project.technologies.filter((item) => !['Stack à préciser', 'Stack to confirm'].includes(item))
  return <article className="project-card"><div className="project-image"><img src={project.image} alt={language === 'fr' ? 'Capture du projet ' + project.title : 'Screenshot of ' + project.title} loading="lazy" decoding="async" /></div><div className="project-body"><h3>{project.title}</h3><p>{project.summary}</p>{technologies.length > 0 && <div className="portfolio-badges">{technologies.map((item) => <span className="portfolio-badge" key={item}>{item}</span>)}</div>}<a className="text-link" href={project.href ?? githubUrl} target="_blank" rel="noopener noreferrer">{project.href ? (language === 'fr' ? 'Voir le projet' : 'View project') : (language === 'fr' ? 'Profil GitHub' : 'GitHub profile')} <ArrowRight aria-hidden="true" /></a></div></article>
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<{ label: string; category: string; purpose: string } | null>(null)
  const otherLanguage: Language = language === 'fr' ? 'en' : 'fr'
  const otherPath = page === 'notFound' ? paths[otherLanguage].home : paths[otherLanguage][page]

  useEffect(() => {
    document.documentElement.lang = language
    document.title = metadata[language][page].title
    document.querySelector('meta[name="description"]')?.setAttribute('content', metadata[language][page].description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', siteOrigin + (page === 'notFound' ? currentPath : p[page]))
  }, [language, page, currentPath, p])

  return <div className="site-shell">
    <a className="skip-link" href="#content">{t.skip}</a>
    <header className="site-header"><div className="container header-inner"><a className="brand" href={p.home} aria-label={language === 'fr' ? 'William Mahi, accueil' : 'William Mahi, home'}><img src="/logo-portfolio.png" alt="WM" width="65" height="65" /></a><nav className="desktop-nav" aria-label={t.nav}>{navPages.map((id) => <a href={p[id]} key={id} aria-current={page === id ? 'page' : undefined}>{t[id]}</a>)}</nav><div className="header-controls"><a className="language-link" href={otherPath} lang={otherLanguage} hrefLang={otherLanguage} aria-label={language === 'fr' ? 'Read this page in English' : 'Lire cette page en français'}>{otherLanguage.toUpperCase()}</a><ThemeSwitch className="theme-switch" lightThemeLabel={c.theme.light} darkThemeLabel={c.theme.dark} /><button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? t.close : t.open} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button></div></div>{menuOpen && <nav id="mobile-navigation" className="mobile-nav" aria-label={t.nav}>{navPages.map((id) => <a href={p[id]} key={id} aria-current={page === id ? 'page' : undefined}>{t[id]}</a>)}</nav>}</header>
    <main id="content">
      {page === 'home' && <><section className="hero"><div className="container hero-inner"><div className="hero-copy"><span className="eyebrow">{t.role}</span><h1>Code. <span>Design.</span> <em>Build.</em></h1><p className="hero-intro">{t.intro}</p><p className="hero-availability">{t.availability}</p><div className="hero-actions"><a className="button button-primary" href={p.projects}>{t.discover}<ArrowRight aria-hidden="true" /></a><a className="button button-outline" href={p.contact}>{t.contactMe}</a></div><a className="hero-expertise-link" href={p.expertise}>{t.expertiseCta}<ArrowRight aria-hidden="true" /></a></div><div className="hero-art" aria-hidden="true"><span className="hero-art-ring ring-one" /><span className="hero-art-ring ring-two" /><span className="hero-art-ring ring-three" /><span className="hero-art-core">WM</span></div></div><Wave strong /></section><section className="section section-soft"><div className="container"><div className="section-heading"><span className="eyebrow">{t.expertise}</span><h2>{t.servicesTitle}</h2><p>{t.servicesIntro}</p></div><div className="services-grid">{t.services.map((service, index) => <article className="service-card" key={service}><span className="service-index">0{index + 1}</span><h3>{service}</h3><ArrowRight aria-hidden="true" /></article>)}</div></div></section><section className="section"><div className="container"><div className="section-heading heading-row"><div><span className="eyebrow">{t.projects}</span><h2>{t.featured}</h2></div><a className="text-link" href={p.projects}>{t.allProjects}<ArrowRight aria-hidden="true" /></a></div><div className="project-grid featured-grid">{projects[language].slice(0, 2).map((project) => <ProjectCard key={project.id} project={project} language={language} />)}</div></div></section><div className="home-contact"><div className="container home-contact-inner"><div><span className="eyebrow">{t.contact}</span><h2>{c.contact.titleLineOne} <span>{c.contact.titleLineTwo}</span></h2></div><a className="button button-light" href={p.contact}>{t.contactMe}<ArrowRight aria-hidden="true" /></a></div><Wave /></div></>}
      {page === 'projects' && <><PageHeader eyebrow={t.projects} title={c.projects.title} intro={t.projectsIntro} /><section className="section page-section"><div className="container project-grid">{projects[language].map((project) => <ProjectCard key={project.id} project={project} language={language} />)}</div></section><Wave /></>}
      {page === 'expertise' && <><PageHeader eyebrow={t.role} title={t.expertise} intro={c.stack.title} /><section className="section expertise-section"><div className="container expertise-layout"><div className="expertise-copy"><h2>{c.stack.label}</h2><p>{c.stack.lead}</p><div className="skill-detail" aria-live="polite">{selectedSkill ? <><span className="eyebrow">{selectedSkill.category}</span><h3>{selectedSkill.label}</h3>{language === 'fr' && <p>{selectedSkill.purpose}</p>}</> : <p>{language === 'fr' ? 'Survolez une compétence ou parcourez la roue au clavier pour en savoir plus.' : 'Hover over a skill or explore the wheel with your keyboard to learn more.'}</p>}</div></div><div className="orbit-frame"><Suspense fallback={<div className="orbit-loading" aria-hidden="true" />}><OrbitingSkills defaultVariant="all" onSkillHoverChange={setSelectedSkill} /></Suspense></div></div></section><section className="section section-soft"><div className="container"><div className="section-heading"><span className="eyebrow">{t.expertise}</span><h2>{t.servicesTitle}</h2></div><div className="services-grid">{t.services.map((service, index) => <article className="service-card" key={service}><span className="service-index">0{index + 1}</span><h3>{service}</h3></article>)}</div></div></section></>}
      {page === 'about' && <><PageHeader eyebrow={t.role} title={t.about} intro={t.aboutIntro} /><section className="section about-section"><div className="container about-layout"><div className="portrait-frame"><img src="/format%20github.png" alt={c.about.portraitAlt} width="1254" height="1254" decoding="async" /></div><div className="about-copy"><span className="eyebrow">{t.role}</span><h2>{c.about.titlePrefix + ' ' + c.about.titleAccent}</h2><p>{c.about.lead}</p><div className="about-values">{c.about.cards.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div></div></section><section className="section timeline-section"><div className="container"><JourneyTimeline language={language} label={c.journey.label} title={c.journey.title} intro={c.journey.intro} /></div></section></>}
      {page === 'contact' && <><PageHeader eyebrow={t.contact} title={c.contact.titleLineOne + ' ' + c.contact.titleLineTwo} intro={t.contactIntro} /><section className="section contact-section"><div className="container contact-layout"><div className="contact-primary"><span className="eyebrow">Email</span><h2>{t.contactMe}</h2><p>{c.contact.lead}</p><a className="button button-primary" href={'mailto:' + contactEmail}>{t.emailMe}<ArrowRight aria-hidden="true" /></a><a className="contact-address" href={'mailto:' + contactEmail}>{contactEmail}</a></div><div className="contact-secondary"><span className="eyebrow">{t.contactWays}</span><SocialLinks language={language} variant="contact" /></div></div></section><Wave strong /></>}
      {page === 'notFound' && <section className="not-found container"><span className="eyebrow">404</span><h1>{t.notFound}</h1><a className="button button-primary" href={p.home}>{t.backHome}<ArrowRight aria-hidden="true" /></a></section>}
    </main>
    <footer className="site-footer"><div className="container footer-inner"><a className="footer-brand" href={p.home}><img src="/logo-portfolio.png" alt="WM" width="54" height="54" /><span><strong>William Mahi</strong><small>{t.role}</small></span></a><nav aria-label={t.nav}>{navPages.filter((id) => id !== 'home').map((id) => <a key={id} href={p[id]}>{t[id]}</a>)}</nav><span className="footer-copy">© {new Date().getFullYear()} William Mahi. {t.rights}</span></div></footer>
  </div>
}
