import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { contactEmail, projects, type Language } from '@/data/portfolio-content'
import { paths } from '@/site'
import { MethodScene } from './home-illustrations'
import { ServicesCatalog } from './services-catalog'
import './home-page.css'

const content = {
  fr: {
    heroRole: 'Développeur web freelance', lead: 'Des sites web et des outils sur mesure pour votre activité.', projects: 'Voir mes réalisations', contact: 'Discuter de mon projet',
    workLabel: 'Quelques réalisations', workTitle: 'Des projets qui prennent vie', workIntro: 'Un aperçu de mes réalisations et des solutions développées.', workCta: 'Voir tous les projets', projectCta: 'Voir les détails',
    projectSummaries: ['Présenter l’univers et les réalisations d’une tatoueuse.', 'Accompagner le raisonnement grâce à une interface de guidage.', 'Présenter mon approche, mes compétences et mes projets.'],
    methodLabel: 'Un projet construit avec vous', methodTitle: 'Une méthode claire et collaborative', methodIntro: 'Du premier échange à la mise en ligne, nous avançons ensemble.',
    steps: [
      ['Définir ensemble', 'Nous précisons vos besoins, vos priorités et le périmètre du projet.'],
      ['Concevoir et développer', 'Vous validez les propositions aux étapes clés, puis votre solution prend forme.'],
      ['Vérifier et livrer', 'Nous vérifions les parcours et préparons votre prise en main.'],
    ],
    contactLabel: 'Parlons de votre projet', contactTitle: 'Donnons forme à votre idée.', contactLead: 'Présentez-moi votre besoin pour définir ensemble la suite.', projectContact: 'Discuter de mon projet',
  },
  en: {
    heroRole: 'Freelance web developer', lead: 'Tailored websites and tools for your business.', projects: 'View my work', contact: 'Discuss my project',
    workLabel: 'Selected projects', workTitle: 'Projects brought to life', workIntro: 'A glimpse of my work and the solutions I have developed.', workCta: 'View all projects', projectCta: 'View details',
    projectSummaries: ['Presenting a tattoo artist’s world and work.', 'Supporting step-by-step reasoning through a guided interface.', 'Presenting my approach, skills and projects.'],
    methodLabel: 'A project built with you', methodTitle: 'A clear, collaborative process', methodIntro: 'From our first conversation to launch, we move forward together.',
    steps: [
      ['Define together', 'We clarify your needs, priorities and the scope of the project.'],
      ['Design and develop', 'You approve proposals at key stages, then your solution takes shape.'],
      ['Review and deliver', 'We check the user journeys and prepare your handover.'],
    ],
    contactLabel: 'Let’s talk about your project', contactTitle: 'Let’s bring your idea to life.', contactLead: 'Tell me what you need so we can define the next steps together.', projectContact: 'Discuss my project',
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
    <section className="home-container home-section home-projects" aria-labelledby="projects-title"><div className="home-section-heading home-section-heading--centered"><Eyebrow>{t.workLabel}</Eyebrow><h2 id="projects-title">{t.workTitle}</h2><p>{t.workIntro}</p></div><div className="home-projects-grid">{selected.map((project, i) => <article className="home-project-card" key={project.id}><a className="home-project-image" href={`${p.projects}#${project.id}`} aria-label={t.projectCta + ' : ' + project.title}><img src={project.image.replace(/\.png$/, '.webp')} alt={(language === 'fr' ? 'Capture de ' : 'Screenshot of ') + project.title} width={project.id === 'rubber-duck' ? 1923 : project.id === 'portfolio' ? 2532 : 2559} height={project.id === 'rubber-duck' ? 1114 : project.id === 'portfolio' ? 1245 : 1248} loading="lazy" decoding="async" /></a><div className="home-project-copy"><h3>{project.id === 'portfolio' ? 'Portfolio WM' : project.title}</h3><p>{t.projectSummaries[i]}</p><a className="home-text-link" href={`${p.projects}#${project.id}`}>{t.projectCta}<ArrowUpRight aria-hidden="true" /></a></div></article>)}</div><a className="home-button home-button-primary home-projects-cta" href={p.projects}>{t.workCta}<ArrowRight aria-hidden="true" /></a></section>
    <section className="home-container home-section home-method" aria-labelledby="method-title"><div className="home-section-heading home-section-heading--centered"><Eyebrow>{t.methodLabel}</Eyebrow><h2 id="method-title">{t.methodTitle}</h2><p>{t.methodIntro}</p></div><div className="home-method-grid">{t.steps.map(([title, description], i) => <article className="home-method-card" key={title}><span className="home-step-number">0{i + 1}</span><MethodScene step={i} language={language} /><div className="home-method-copy"><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>
    <section className="home-container home-section home-contact-panel" aria-labelledby="contact-title"><Eyebrow>{t.contactLabel}</Eyebrow><h2 id="contact-title">{t.contactTitle}</h2><p>{t.contactLead}</p><a className="home-button home-button-primary" href={p.contact}>{t.projectContact}<ArrowUpRight aria-hidden="true" /></a><a className="home-contact-email" href={'mailto:' + contactEmail}>{contactEmail}</a></section>
  </div>
}
