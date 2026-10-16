import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react'
import { contactEmail, projects, type Language } from '@/data/portfolio-content'
import { paths } from '@/site'
import { MethodScene } from './home-illustrations'
import { ServicesCatalog } from './services-catalog'
import './home-page.css'

const content = {
  fr: {
    role: 'Développeur Full-Stack freelance', heroRole: 'Développeur web freelance', lead: 'Des sites web et des outils sur mesure pour votre activité.', projects: 'Voir mes réalisations', contact: 'Discuter de mon projet', availability: 'Ouvert aux opportunités professionnelles',
    workLabel: 'Réalisations', workTitle: 'Quelques réalisations', workIntro: 'Un aperçu de mon travail. Retrouvez les détails sur la page Projets.', workCta: 'Explorer mes projets', projectCta: 'Voir le projet',
    projectSummaries: ['Présenter l’univers et les réalisations d’une tatoueuse.', 'Accompagner le raisonnement grâce à une interface de guidage.', 'Présenter mon approche, mes compétences et mes projets.'],
    methodLabel: 'Un projet construit avec vous', methodTitle: 'Une méthode claire et collaborative', methodIntro: 'Trois temps pour avancer ensemble, du besoin à la livraison.',
    steps: [
      ['Définir ensemble', 'Nous précisons vos objectifs, les fonctionnalités et le périmètre du projet.'],
      ['Concevoir et développer', 'Les propositions sont validées, puis la solution prend forme.'],
      ['Vérifier et livrer', 'Nous vérifions les parcours, ajustons les détails et préparons la prise en main.'],
    ],
    aboutLabel: 'Derrière WM', aboutTitle: 'Un interlocuteur pour votre projet', aboutText: 'Je conçois des sites et applications web utiles, avec une attention portée à l’interface et à leur fonctionnement. Je suis ouvert aux collaborations et aux opportunités professionnelles.', aboutCta: 'Découvrir mon parcours', faqTitle: 'Questions avant de commencer',
    faq: [
      ['Comment démarrer un projet ?', 'Prenons contact pour préciser votre besoin, vos objectifs et le contexte.'],
      ['Pouvez-vous améliorer un site existant ?', 'Oui. Une analyse de l’existant permet de définir les améliorations utiles.'],
      ['Comment sont définis le prix et le délai ?', 'Ils sont estimés selon le périmètre et les contraintes du projet.'],
      ['Que prévoir après la livraison ?', 'Les modalités après livraison sont définies dans la prestation convenue.'],
    ],
    contactLabel: 'Et si nous en parlions ?', contactTitle: 'Quel projet souhaitez-vous concrétiser ?', contactLead: 'Discutons de votre besoin et voyons ensemble comment le réaliser.', projectContact: 'Discuter de mon projet', opportunityContact: 'Proposer une opportunité',
  },
  en: {
    role: 'Freelance Full-Stack Developer', heroRole: 'Freelance web developer', lead: 'Tailored websites and tools for your business.', projects: 'View my work', contact: 'Discuss my project', availability: 'Open to professional opportunities',
    workLabel: 'Selected work', workTitle: 'A few projects', workIntro: 'A glimpse of my work. Find the details on the Projects page.', workCta: 'Explore my projects', projectCta: 'View project',
    projectSummaries: ['Presenting a tattoo artist’s world and work.', 'Supporting step-by-step reasoning through a guided interface.', 'Presenting my approach, skills and projects.'],
    methodLabel: 'A project built with you', methodTitle: 'A clear, collaborative process', methodIntro: 'Three stages to move forward together, from your needs to delivery.',
    steps: [
      ['Define together', 'We clarify your goals, the features and the scope of the project.'],
      ['Design and develop', 'Proposals are approved, then the solution takes shape.'],
      ['Review and deliver', 'We check user journeys, refine the details and prepare the handover.'],
    ],
    aboutLabel: 'Behind WM', aboutTitle: 'One contact for your project', aboutText: 'I build useful websites and web applications, paying attention to their interfaces and how they work. I am open to collaborations and professional opportunities.', aboutCta: 'Explore my background', faqTitle: 'Questions before getting started',
    faq: [
      ['How do we start a project?', 'Get in touch so we can clarify your needs, goals and context.'],
      ['Can you improve an existing website?', 'Yes. Reviewing the existing website helps identify useful improvements.'],
      ['How are price and timing defined?', 'They are estimated according to the scope and constraints of the project.'],
      ['What happens after delivery?', 'Post-delivery arrangements are defined in the agreed service.'],
    ],
    contactLabel: 'Let’s talk about it', contactTitle: 'What project would you like to bring to life?', contactLead: 'Let’s discuss your needs and work out how to make them happen.', projectContact: 'Discuss my project', opportunityContact: 'Offer an opportunity',
  },
}

function Eyebrow({ children }: { children: string }) { return <span className="home-eyebrow">{children}</span> }

export function HomePage({ language }: { language: Language }) {
  const t = content[language]
  const p = paths[language]
  const selected = ['sakura-line', 'rubber-duck', 'portfolio'].map(id => projects[language].find(project => project.id === id)).filter(project => project !== undefined)
  return <div className="home-page">
    <section className="home-container home-hero" aria-labelledby="home-title">
      <div className="home-hero-copy"><Eyebrow>{t.heroRole}</Eyebrow><h1 id="home-title"><span>Code. Design.</span><em>Build.</em></h1><p className="home-hero-lead">{t.lead}</p><div className="home-actions"><a className="home-button home-button-primary" href={p.contact}>{t.contact}<ArrowRight /></a><a className="home-button home-button-secondary" href={p.projects}>{t.projects}</a></div></div>
    </section>
    <ServicesCatalog language={language} />
    <section className="home-container home-section home-projects" aria-labelledby="projects-title"><div className="home-projects-heading"><div className="home-section-heading"><Eyebrow>{t.workLabel}</Eyebrow><h2 id="projects-title">{t.workTitle}</h2><p>{t.workIntro}</p></div><a className="home-button home-button-primary" href={p.projects}>{t.workCta}<ArrowRight aria-hidden="true" /></a></div><div className="home-projects-grid">{selected.map((project, i) => <article className="home-project-card" key={project.id}><a className="home-project-image" href={p.projects} aria-label={t.projectCta + ' : ' + project.title}><img src={project.image.replace(/\.png$/, '.webp')} alt={(language === 'fr' ? 'Capture de ' : 'Screenshot of ') + project.title} width={project.id === 'rubber-duck' ? 1923 : project.id === 'portfolio' ? 2532 : 2559} height={project.id === 'rubber-duck' ? 1114 : project.id === 'portfolio' ? 1245 : 1248} loading="lazy" decoding="async" /></a><div className="home-project-copy"><h3>{project.id === 'portfolio' ? 'Portfolio WM' : project.title}</h3><p>{t.projectSummaries[i]}</p><a className="home-text-link" href={p.projects}>{t.projectCta}<ArrowUpRight aria-hidden="true" /></a></div></article>)}</div></section>
    <section className="home-container home-section home-method" aria-labelledby="method-title"><div className="home-section-heading"><Eyebrow>{t.methodLabel}</Eyebrow><h2 id="method-title">{t.methodTitle}</h2><p>{t.methodIntro}</p></div><div className="home-method-grid"><svg className="home-method-connector" viewBox="0 0 1200 260" preserveAspectRatio="none" aria-hidden="true"><path d="M20 150 C230 20 300 260 520 140 S900 20 1180 150" /></svg>{t.steps.map(([title, description], i) => <article className="home-method-card" key={title}><span className="home-step-number">0{i + 1}</span><MethodScene step={i} language={language} /><div className="home-method-copy"><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>
    <section className="home-container home-section home-about-faq"><article className="home-about-panel" aria-labelledby="about-title"><div className="home-about-heading"><img src="/logo-portfolio.png" alt="WM" width="1536" height="1024" /><div><Eyebrow>{t.aboutLabel}</Eyebrow><h2 id="about-title">{t.aboutTitle}</h2></div></div><p className="home-about-name">William Mahi <span>{t.role}</span></p><p>{t.aboutText}</p><a className="home-button home-button-secondary" href={p.about}>{t.aboutCta}<ArrowRight aria-hidden="true" /></a></article><div className="home-faq-panel"><h2>{t.faqTitle}</h2>{t.faq.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>
    <section className="home-container home-section home-contact-panel" aria-labelledby="contact-title"><div><Eyebrow>{t.contactLabel}</Eyebrow><h2 id="contact-title">{t.contactTitle}</h2><p>{t.contactLead}</p></div><div className="home-contact-lower"><div className="home-actions"><a className="home-button home-button-primary" href={p.contact}>{t.projectContact}<ArrowUpRight aria-hidden="true" /></a><a className="home-button home-button-secondary" href={p.contact}>{t.opportunityContact}</a></div><a className="home-contact-email" href={'mailto:' + contactEmail}>{contactEmail}</a><p className="home-availability"><span />{t.availability}</p></div></section>
  </div>
}
