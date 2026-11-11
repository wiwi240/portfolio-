import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowDown, Check, Flag } from 'lucide-react'
import type { Language } from '@/data/portfolio-content'
import './home-journey.css'

type Phase = { title: string; text: string }

const content: Record<Language, { progress: string; phases: Phase[] }> = {
  fr: {
    progress: 'Avancement du projet',
    phases: [
      { title: 'Identification des besoins', text: 'Nous précisons votre besoin et vos priorités.' },
      { title: 'Conception', text: 'Vous validez les propositions.' },
      { title: 'Développement', text: 'Votre solution prend forme.' },
      { title: 'Livraison', text: 'Mise en ligne et prise en main.' },
    ],
  },
  en: {
    progress: 'Project progress',
    phases: [
      { title: 'Identifying needs', text: 'We clarify your needs and priorities.' },
      { title: 'Design', text: 'You approve the proposals.' },
      { title: 'Development', text: 'Your solution takes shape.' },
      { title: 'Delivery', text: 'Launch and handover.' },
    ],
  },
}

const STEP_MS = 750

// Plays the project once when it scrolls into view: items tick one by one, the bar fills, then a bridge drops to the contact block.
export function HomeJourney({ language }: { language: Language }) {
  const t = content[language]
  const total = t.phases.length
  const rootRef = useRef<HTMLDivElement>(null)
  const timer = useRef(0)
  const [checked, setChecked] = useState(0)

  const play = useCallback(() => {
    window.clearInterval(timer.current)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setChecked(total)
      return
    }
    setChecked(0)
    timer.current = window.setInterval(() => {
      setChecked((value) => {
        if (value + 1 >= total) window.clearInterval(timer.current)
        return Math.min(value + 1, total)
      })
    }, STEP_MS)
  }, [total])

  // Start the first run when the section is mostly on screen.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        io.disconnect()
        play()
      }
    }, { threshold: 0.35 })
    io.observe(root)
    return () => { io.disconnect(); window.clearInterval(timer.current) }
  }, [play])

  const percent = Math.round((checked / total) * 100)
  const done = checked >= total

  return (
    <div className="home-journey" ref={rootRef} style={{ '--p': checked / total } as React.CSSProperties}>
      <div className="home-journey-board">
        <div className="home-journey-head" role="progressbar" aria-label={t.progress} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
          <span className="home-journey-label">{t.progress}</span>
          <strong className="home-journey-percent">{percent}%</strong>
        </div>

        <div className="home-journey-rail">
          <div className="home-journey-bar-track"><span className="home-journey-bar-fill" /></div>
          {t.phases.map((phase, p) => (
            <span key={phase.title} className={`home-journey-marker${checked >= p + 1 ? ' is-reached' : ''}`} style={{ left: `${((p + 1) / total) * 100}%` }} aria-hidden="true">
              {p === total - 1 ? <Flag /> : p + 1}
            </span>
          ))}
        </div>

        <ol className="home-journey-phases">
          {t.phases.map((phase, p) => (
            <li key={phase.title} className={`home-journey-item${p < checked ? ' is-done' : ''}`}>
              <span className="home-journey-check" aria-hidden="true"><Check /></span>
              <div><strong>{phase.title}</strong><span>{phase.text}</span></div>
            </li>
          ))}
        </ol>
      </div>
      <div className={`home-journey-bridge${done ? ' is-on' : ''}`} aria-hidden="true">
        <span className="home-journey-bridge-line" />
        <span className="home-journey-bridge-node"><ArrowDown /></span>
      </div>
    </div>
  )
}
