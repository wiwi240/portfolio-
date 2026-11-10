import { useEffect, useState } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { contactEmail, type Language } from '@/data/portfolio-content'
import type { PathId } from '@/data/project-configurator'
import { guidePanels, type GuideAnswer } from '@/data/home-guide'
import { markProgrammaticScroll, useScrollToScene } from '@/lib/scroll-stack'
import { paths } from '@/site'
import { MethodScene } from './home-illustrations'
import { HomeProjects } from './home-projects'
import { ProjectEntry } from './project-entry'
import { GuidePanel } from './project-guide'
import { GuideQuestion } from './project-guide-question'
import { GuideMockup } from './project-guide-mockup'
import { GuideSummary } from './project-guide-summary'
import { HorizontalScene, ScrollStack, StackScene } from './scroll-stack'
import './home-page.css'
import './home-stack.css'

const content = {
  fr: {
    heroRole: 'Développeur web freelance', lead: 'Des sites web et des outils sur mesure pour votre activité.', projects: 'Voir mes réalisations', contact: 'Décrire mon projet',
    projectLabel: 'Votre projet',
    methodLabel: 'Un projet construit avec vous', methodTitle: 'Une méthode claire et collaborative', methodIntro: 'Du premier échange à la mise en ligne, nous avançons ensemble.',
    steps: [
      ['Définir ensemble', 'Nous précisons vos besoins, vos priorités et le périmètre du projet.'],
      ['Concevoir et développer', 'Vous validez les propositions aux étapes clés, puis votre solution prend forme.'],
      ['Vérifier et livrer', 'Nous vérifions les parcours et préparons votre prise en main.'],
    ],
    contactLabel: 'Parlons de votre projet', contactTitle: 'Donnons forme à votre idée.', contactLead: 'Présentez-moi votre besoin pour définir ensemble la suite.', projectContact: 'Décrire mon projet',
  },
  en: {
    heroRole: 'Freelance web developer', lead: 'Tailored websites and tools for your business.', projects: 'View my work', contact: 'Describe my project',
    projectLabel: 'Your project',
    methodLabel: 'A project built with you', methodTitle: 'A clear, collaborative process', methodIntro: 'From our first conversation to launch, we move forward together.',
    steps: [
      ['Define together', 'We clarify your needs, priorities and the scope of the project.'],
      ['Design and develop', 'You approve proposals at key stages, then your solution takes shape.'],
      ['Review and deliver', 'We check the user journeys and prepare your handover.'],
    ],
    contactLabel: 'Let’s talk about your project', contactTitle: 'Let’s bring your idea to life.', contactLead: 'Tell me what you need so we can define the next steps together.', projectContact: 'Describe my project',
  },
}

const pathIds: PathId[] = ['create', 'tool', 'improve', 'support', 'unsure']
// Links such as /?parcours=tool#votre-projet open the guide with that path already chosen.
function requestedPath(): PathId | null {
  if (typeof window === 'undefined') return null
  const requested = new URLSearchParams(window.location.search).get('parcours')
  return pathIds.find((id) => id === requested) ?? null
}

function Eyebrow({ children }: { children: string }) { return <span className="eyebrow">{children}</span> }

export function HomePage({ language }: { language: Language }) {
  const t = content[language]
  const p = paths[language]
  const [path, setPath] = useState<PathId | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [answers, setAnswers] = useState<Record<string, GuideAnswer>>({})
  const [activity, setActivity] = useState('')
  const [selections, setSelections] = useState(0)
  // Index of the last slide the visitor may scroll to. Slides open up as they choose a path, tick options or press Next.
  const [unlocked, setUnlocked] = useState(0)
  const [target, setTarget] = useState<{ panel: number; seq: number } | null>(null)
  const scrollToScene = useScrollToScene()
  const guide = guidePanels(path)

  const choosePath = (next: PathId) => {
    markProgrammaticScroll()
    if (next !== path) {
      setSelected([])
      setAnswers({})
      setUnlocked(1)
    } else setUnlocked((current) => Math.max(current, 1))
    setPath(next)
    setSelections((count) => count + 1)
  }
  const toggle = (id: string) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
    // Ticking an option opens the slide that follows the one it belongs to.
    const owner = guide.findIndex((panel) => panel.items.some((item) => item.id === id))
    if (owner >= 0) setUnlocked((current) => Math.max(current, owner + 2))
  }
  // Answering no or unsure drops anything ticked in that category, opens the next slide and moves on by itself.
  const answer = (panelIndex: number, value: GuideAnswer) => {
    const panel = guide[panelIndex]
    setAnswers((current) => ({ ...current, [panel.id]: value }))
    setUnlocked((current) => Math.max(current, panelIndex + 2))
    if (value === 'yes') return
    const ids = new Set(panel.items.map((item) => item.id))
    setSelected((current) => current.filter((item) => !ids.has(item)))
    window.setTimeout(() => goToPanel(panelIndex + 2), 450)
  }
  // Panel 0 is the path choice. The guide slides, the mockup and the summary only exist once a path is chosen.
  const headingIds = ['project-entry-title', ...guide.map((panel) => `guide-title-${panel.id}`), 'guide-mockup-title', 'guide-summary-title']
  // The slide may only just have been unlocked, so the scroll waits for the scene to be rebuilt.
  const goToPanel = (panel: number) => {
    setUnlocked((current) => Math.max(current, panel))
    setTarget((current) => ({ panel, seq: (current?.seq ?? 0) + 1 }))
  }
  useEffect(() => {
    if (target) scrollToScene('votre-projet', { panel: target.panel, focusId: headingIds[target.panel] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  // The slides are rebuilt for the chosen path, so the scroll target is only known once they are rendered.
  useEffect(() => {
    if (selections > 0) scrollToScene('votre-projet', { panel: 1 })
  }, [selections, scrollToScene])

  // On a direct link the scene is still being laid out at mount, so the path is chosen once the page has settled,
  // exactly as if the visitor had clicked it.
  useEffect(() => {
    const requested = requestedPath()
    if (!requested) return
    const timer = window.setTimeout(() => choosePath(requested), 900)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div className="home-page">
    <ScrollStack>
      <StackScene id="accueil" tone="clear" labelledBy="home-title">
        <div className="stack-scene-inner home-hero">
          <div className="home-hero-copy"><Eyebrow>{t.heroRole}</Eyebrow><h1 id="home-title"><span>Code. Design.</span><em>Build.</em></h1><p className="home-hero-lead">{t.lead}</p><div className="home-actions"><a className="button button-primary" href="#votre-projet" onClick={(event) => { event.preventDefault(); scrollToScene('votre-projet', { panel: 0, focusId: 'project-entry-title' }) }}>{t.contact}<ArrowRight /></a><a className="button button-outline" href={p.projects}>{t.projects}</a></div></div>
        </div>
      </StackScene>
      <HorizontalScene id="votre-projet" label={t.projectLabel} unlocked={unlocked} panels={[
        { tone: 'tint', content: <ProjectEntry language={language} active={path} onSelect={choosePath} /> },
        ...guide.map((panel, index) => ({
          tone: index % 2 === 0 ? 'bg' : 'tint',
          content: panel.question ? (
            <GuideQuestion language={language} panel={panel} index={index} total={guide.length} answer={answers[panel.id]} selected={selected} onAnswer={(value) => answer(index, value)} onToggle={toggle} onBack={() => goToPanel(index)} onNext={() => goToPanel(index + 2)} onSkip={() => goToPanel(guide.length + 2)} focusSignal={selections} />
          ) : (
            <GuidePanel language={language} panel={panel} index={index} total={guide.length} selected={selected} onToggle={toggle} onBack={() => goToPanel(index)} onNext={() => goToPanel(index + 2)} focusSignal={selections} />
          ),
        } as const)),
        ...(path
          ? [
              { tone: 'tint', content: <GuideMockup newIds={(guide[guide.length - 1]?.items ?? []).map((item) => item.id).filter((id) => selected.includes(id))} language={language} path={path} selected={selected} activity={activity} onActivityChange={setActivity} onBack={() => goToPanel(guide.length)} onNext={() => goToPanel(guide.length + 2)} /> } as const,
              { tone: 'surface', content: <GuideSummary language={language} path={path} panels={guide} selected={selected} activity={activity} onActivityChange={setActivity} onBack={() => goToPanel(guide.length + 1)} /> } as const,
            ]
          : []),
      ]} />
      <StackScene id="realisations" tone="bg">
        <HomeProjects language={language} />
      </StackScene>
      <StackScene id="methode" tone="surface" className="home-converge">
        <section className="stack-scene-inner home-section home-method" aria-labelledby="method-title"><div className="home-section-heading home-section-heading--centered"><Eyebrow>{t.methodLabel}</Eyebrow><h2 id="method-title">{t.methodTitle}</h2><p>{t.methodIntro}</p></div><div className="home-method-grid">{t.steps.map(([title, description], i) => <article className="home-method-card" key={title}><span className="home-step-number">0{i + 1}</span><MethodScene step={i} language={language} /><div className="home-method-copy"><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>
        <section className="stack-scene-inner home-section home-contact-panel" aria-labelledby="contact-title"><Eyebrow>{t.contactLabel}</Eyebrow><h2 id="contact-title">{t.contactTitle}</h2><p>{t.contactLead}</p><a className="button button-primary" href="#votre-projet">{t.projectContact}<ArrowUpRight aria-hidden="true" /></a><a className="home-contact-email" href={'mailto:' + contactEmail}>{contactEmail}</a></section>
      </StackScene>
    </ScrollStack>
  </div>
}
