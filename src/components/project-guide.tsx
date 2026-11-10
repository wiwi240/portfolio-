import { useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { guideIcon } from '@/data/guide-icons'
import type { GuidePanelData } from '@/data/home-guide'
import type { Language } from '@/data/portfolio-content'
import './project-guide.css'

const text = {
  fr: { hint: 'Cochez ce qui vous est utile : tout pourra être ajusté ensuite.', next: 'Suivant', back: 'Précédent', step: 'Étape', of: 'sur', none: 'Vous n’avez rien choisi à l’étape précédente : nous définirons tout ensemble. Vous pouvez passer à la suite.' },
  en: { hint: 'Tick what is useful: everything can be adjusted afterwards.', next: 'Next', back: 'Back', step: 'Step', of: 'of', none: 'You did not pick anything on the previous step: we will define everything together. You can move on.' },
}

type GuidePanelProps = {
  language: Language
  panel: GuidePanelData
  index: number
  total: number
  selected: string[]
  onToggle: (id: string) => void
  onBack: () => void
  onNext: () => void
  focusSignal: number
}

export function GuidePanel({ language, panel, index, total, selected, onToggle, onBack, onNext, focusSignal }: GuidePanelProps) {
  const t = text[language]
  const headingRef = useRef<HTMLHeadingElement>(null)
  const titleId = `guide-title-${panel.id}`

  useEffect(() => {
    if (index === 0 && focusSignal > 0) headingRef.current?.focus({ preventScroll: true })
  }, [index, focusSignal])

  const renderItems = (items: GuidePanelData['items']) =>
    items.map((item) => {
      const checked = selected.includes(item.id)
      const Icon = guideIcon(item.id)
      return (
        <label key={item.id} className={checked ? 'is-selected' : undefined}>
          <span className="guide-item-icon" aria-hidden="true">
            <Icon size={22} strokeWidth={1.8} />
          </span>
          <span className="guide-item-copy">
            <strong>{item.title[language]}</strong>
            <small>{item.description[language]}</small>
          </span>
          <Checkbox checked={checked} onCheckedChange={() => onToggle(item.id)} aria-label={item.title[language]} />
        </label>
      )
    })

  return (
    <section className="stack-scene-inner guide-panel" aria-labelledby={titleId}>
      <span className="eyebrow">
        {t.step} {index + 1} {t.of} {total}
      </span>
      <span className="guide-progress" aria-hidden="true">
        <span style={{ width: `${((index + 1) / total) * 100}%` }} />
      </span>
      <h2 id={titleId} ref={headingRef} tabIndex={-1}>
        {panel.title[language]}
      </h2>
      <p className="guide-hint">{t.hint}</p>
      {panel.columns && panel.columns.length === 0 ? (
        <p className="guide-hint">{t.none}</p>
      ) : panel.columns ? (
        <div className="guide-columns">
          {panel.columns.map((column) => (
            <div key={column.id} className="guide-column" role="group" aria-labelledby={`guide-col-${column.id}`}>
              <h3 id={`guide-col-${column.id}`}>{column.title[language]}</h3>
              <div className="guide-items guide-items-compact">{renderItems(column.items)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="guide-items" role="group" aria-labelledby={titleId}>
          {renderItems(panel.items)}
        </div>
      )}
      <div className="guide-nav">
        <button type="button" className="button button-outline" onClick={onBack}>
          <ArrowLeft aria-hidden="true" />
          {t.back}
        </button>
        <button type="button" className="button button-primary" onClick={onNext}>
          {t.next}
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
