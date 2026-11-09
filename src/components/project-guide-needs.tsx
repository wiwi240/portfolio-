import { useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, Check, HelpCircle } from 'lucide-react'
import { guideIcon } from '@/data/guide-icons'
import { needsTitle, type GuideTheme } from '@/data/home-guide'
import type { Language } from '@/data/portfolio-content'
import './project-guide.css'

const text = {
  fr: { hint: 'Cochez tout ce qui vous parle. Vous pourrez préciser à l’étape suivante.', next: 'Suivant', back: 'Précédent', advice: 'Je ne sais pas, conseillez-moi', step: 'Étape', of: 'sur' },
  en: { hint: 'Tick everything that speaks to you. You can be more specific on the next step.', next: 'Next', back: 'Back', advice: 'I am not sure, advise me', step: 'Step', of: 'of' },
}

type GuideNeedsProps = {
  language: Language
  themes: GuideTheme[]
  chosen: string[]
  total: number
  onToggle: (id: string) => void
  onBack: () => void
  onNext: () => void
  onAdvice: () => void
  focusSignal: number
}

// Page 1: what the visitor wants to be able to do, in everyday words. Each answer opens its features on page 2.
export function GuideNeeds({ language, themes, chosen, total, onToggle, onBack, onNext, onAdvice, focusSignal }: GuideNeedsProps) {
  const t = text[language]
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (focusSignal > 0) headingRef.current?.focus({ preventScroll: true })
  }, [focusSignal])

  return (
    <section className="stack-scene-inner guide-panel" aria-labelledby="guide-title-needs">
      <span className="eyebrow">
        {t.step} 1 {t.of} {total}
      </span>
      <span className="guide-progress" aria-hidden="true">
        <span style={{ width: `${(1 / total) * 100}%` }} />
      </span>
      <h2 id="guide-title-needs" ref={headingRef} tabIndex={-1}>
        {needsTitle[language]}
      </h2>
      <p className="guide-hint">{t.hint}</p>
      <div className="guide-items" role="group" aria-labelledby="guide-title-needs">
        {themes.map((item) => {
          const checked = chosen.includes(item.id)
          const Icon = guideIcon(item.id)
          return (
            <label key={item.id} className={checked ? 'is-selected' : undefined}>
              <input type="checkbox" checked={checked} onChange={() => onToggle(item.id)} />
              <span className="guide-item-icon" aria-hidden="true">
                <Icon size={22} strokeWidth={1.8} />
              </span>
              <span className="guide-item-copy">
                <strong>{item.title[language]}</strong>
                <small>{item.description[language]}</small>
              </span>
              <span className="guide-item-check" aria-hidden="true">
                <Check size={14} strokeWidth={3} />
              </span>
            </label>
          )
        })}
      </div>
      <div className="guide-nav">
        <button type="button" className="button button-outline" onClick={onBack}>
          <ArrowLeft aria-hidden="true" />
          {t.back}
        </button>
        <button type="button" className="button button-outline" onClick={onAdvice}>
          <HelpCircle aria-hidden="true" />
          {t.advice}
        </button>
        <button type="button" className="button button-primary" onClick={onNext}>
          {t.next}
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
