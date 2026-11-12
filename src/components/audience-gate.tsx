import { useCallback, useEffect, useState, type MouseEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import type { Language } from '@/data/portfolio-content'
import { paths } from '@/site'
import './audience-gate.css'

const STORAGE_KEY = 'audience-gate-seen'

type GateSide = { id: 'recruiter' | 'client'; tag: string; title: string; text: string; cta: string; href: string }

function buildContent(language: Language): { welcome: string; intro: string; question: string; skip: string; sides: GateSide[] } {
  const p = paths[language]
  if (language === 'fr') {
    return {
      welcome: 'Bienvenue sur mon portfolio',
      intro: 'Afin de faciliter votre expérience, veuillez sélectionner le profil qui vous correspond.',
      question: 'Vous êtes…',
      skip: 'Passer et voir tout le site',
      sides: [
        { id: 'client', tag: 'Projet', title: 'Client', text: 'Un site ou un outil sur mesure ? Voyons ce qu’il vous faut.', cta: 'Décrire mon projet', href: `${p.home}#votre-projet` },
        { id: 'recruiter', tag: 'Recrutement', title: 'Recruteur', text: 'Parcours, compétences et projets réalisés.', cta: 'Voir mon parcours', href: `${p.about}#expertises` },
      ],
    }
  }
  return {
    welcome: 'Welcome to my portfolio',
    intro: 'To make your visit easier, please select the profile that best describes you.',
    question: 'You are…',
    skip: 'Skip and see the whole site',
    sides: [
      { id: 'client', tag: 'Project', title: 'Client', text: 'A custom website or tool? Let’s see what you need.', cta: 'Describe my project', href: `${p.home}#votre-projet` },
      { id: 'recruiter', tag: 'Hiring', title: 'Recruiter', text: 'Background, skills and shipped projects.', cta: 'See my background', href: `${p.about}#expertises` },
    ],
  }
}


const stroke = { stroke: '#000', strokeLinejoin: 'miter' as const }

/** Hand-drawn neobrutalist pictograms (flat fills, thick black outline, hard offset shadow). */
function ClientIcon() {
  return <svg viewBox="0 0 68 68" focusable="false">
    <rect x="10" y="14" width="50" height="40" fill="#000" />
    <rect x="4" y="8" width="50" height="40" fill="#fff" strokeWidth="3.5" {...stroke} />
    <rect x="4" y="8" width="50" height="11" fill="#1f5bff" strokeWidth="3.5" {...stroke} />
    <rect x="10" y="12" width="3.5" height="3.5" fill="#fff" />
    <rect x="16" y="12" width="3.5" height="3.5" fill="#fff" />
    <rect x="10" y="25" width="19" height="16" fill="#0fd4f5" strokeWidth="3" {...stroke} />
    <path d="M35 27h13M35 34h13M35 41h8" strokeWidth="3" stroke="#000" fill="none" />
    <polygon points="38,38 38,62 45,55 51,66 57,63 51,53 60,53" fill="#ffd84d" strokeWidth="3" {...stroke} />
  </svg>
}

function RecruiterIcon() {
  return <svg viewBox="0 0 68 68" focusable="false">
    <rect x="16" y="10" width="44" height="54" fill="#000" />
    <rect x="9" y="4" width="44" height="54" fill="#fff" strokeWidth="3.5" {...stroke} />
    <rect x="15" y="11" width="15" height="15" fill="#0fd4f5" strokeWidth="3" {...stroke} />
    <path d="M36 14h12M36 22h12M15 34h28M15 42h18" strokeWidth="3" stroke="#000" fill="none" />
    <rect x="38" y="38" width="24" height="24" fill="#1f5bff" strokeWidth="3.5" {...stroke} />
    <polyline points="43,50 49,56 58,43" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinejoin="miter" />
  </svg>
}

function alreadySeen() {
  try { return window.sessionStorage.getItem(STORAGE_KEY) === '1' } catch { return false }
}

export function AudienceGate({ language }: { language: Language }) {
  const [open, setOpen] = useState(() => typeof window !== 'undefined' && !alreadySeen())
  const [hovered, setHovered] = useState<'recruiter' | 'client' | null>(null)
  const content = buildContent(language)
  const homePath = paths[language].home

  const close = useCallback(() => {
    try { window.sessionStorage.setItem(STORAGE_KEY, '1') } catch { /* storage unavailable: the gate simply shows again next visit */ }
    document.body.style.overflow = ''
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, close])

  if (!open) return null

  // Links that stay on the home page: close the gate, then scroll to the section. Other links navigate normally.
  const follow = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    close()
    if (!href.startsWith(homePath + '#')) return
    event.preventDefault()
    const hash = href.slice(href.indexOf('#'))
    window.history.replaceState(null, '', href)
    requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return <div className="audience-gate" role="dialog" aria-modal="true" aria-label={content.question} data-lenis-prevent data-hover={hovered ?? undefined}>
    <header className="audience-head">
      <img className="audience-logo" src="/logo-portfolio.svg" alt="William Mahi" width="104" height="48" />
      <div className="audience-head-text"><strong>{content.welcome}</strong><span>{content.intro}</span></div>
    </header>
    <div className="audience-gate-main">
    <div className="audience-gate-split">
      {content.sides.map((side) => <a
        key={side.id}
        href={side.href}
        className={`audience-side audience-${side.id}`}
        onClick={(event) => follow(event, side.href)}
        onMouseEnter={() => setHovered(side.id)}
        onMouseLeave={() => setHovered(null)}
        onFocus={() => setHovered(side.id)}
        onBlur={() => setHovered(null)}
      >
        <span className="audience-tag">{side.tag}</span>
        <span className="audience-icon" aria-hidden="true">{side.id === 'recruiter' ? <RecruiterIcon /> : <ClientIcon />}</span>
        <span className="audience-title">{side.title}</span>
        <span className="audience-text">{side.text}</span>
        <span className="audience-cta">{side.cta}<ArrowRight aria-hidden="true" /></span>
      </a>)}
    </div>
    </div>
    <button type="button" className="audience-skip" onClick={close}>{content.skip}</button>
  </div>
}
