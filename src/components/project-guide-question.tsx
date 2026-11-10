import { useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { guideIcon } from '@/data/guide-icons'
import type { GuideAnswer, GuidePanelData } from '@/data/home-guide'
import type { Language } from '@/data/portfolio-content'
import './project-guide.css'

const text = {
  fr: { yes: 'Oui', no: 'Non', unsure: 'Je ne sais pas', detail: 'Cochez ce qui vous intéresse :', unsureNote: 'Pas de souci : nous en discuterons ensemble.', next: 'Suivant', back: 'Précédent', skip: 'Passer et envoyer ma demande', step: 'Question', of: 'sur' },
  en: { yes: 'Yes', no: 'No', unsure: 'I am not sure', detail: 'Tick what interests you:', unsureNote: 'No problem: we will talk it through together.', next: 'Next', back: 'Back', skip: 'Skip and send my request', step: 'Question', of: 'of' },
}

type GuideQuestionProps = {
  language: Language
  panel: GuidePanelData
  index: number
  total: number
  answer?: GuideAnswer
  selected: string[]
  onAnswer: (answer: GuideAnswer) => void
  onToggle: (id: string) => void
  onBack: () => void
  onNext: () => void
  onSkip: () => void
  focusSignal: number
}

export function GuideQuestion({ language, panel, index, total, answer, selected, onAnswer, onToggle, onBack, onNext, onSkip, focusSignal }: GuideQuestionProps) {
  const t = text[language]
  const headingRef = useRef<HTMLHeadingElement>(null)
  const titleId = `guide-title-${panel.id}`
  useEffect(() => {
    if (index === 0 && focusSignal > 0) headingRef.current?.focus({ preventScroll: true })
  }, [index, focusSignal])
  const answers: [GuideAnswer, string][] = [['yes', t.yes], ['no', t.no], ['unsure', t.unsure]]

  return (
    <section className="stack-scene-inner guide-panel guide-question" aria-labelledby={titleId}>
      <span className="eyebrow">
        {t.step} {index + 1} {t.of} {total}
      </span>
      <span className="guide-progress" aria-hidden="true">
        <span style={{ width: `${((index + 1) / total) * 100}%` }} />
      </span>
      <h2 id={titleId} ref={headingRef} tabIndex={-1}>
        {panel.question?.[language]}
      </h2>
      {panel.hint && answer !== 'yes' && <p className="guide-hint">{panel.hint[language]}</p>}
      <div className="guide-answers" role="radiogroup" aria-labelledby={titleId}>
        {answers.map(([value, label]) => (
          <button key={value} type="button" role="radio" aria-checked={answer === value} className={answer === value ? 'is-selected' : undefined} onClick={() => onAnswer(value)}>
            {answer === value && <Check size={16} strokeWidth={3} aria-hidden="true" />}
            {label}
          </button>
        ))}
      </div>
      <div className="guide-question-detail" aria-live="polite">
        {answer === 'yes' && (
          <>
            <p className="guide-hint">{t.detail}</p>
            <div className="guide-items" role="group" aria-label={panel.title[language]}>
              {panel.items.map((item) => {
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
              })}
            </div>
          </>
        )}
        {answer === 'unsure' && <p className="guide-hint">{t.unsureNote}</p>}
      </div>
      <div className="guide-nav">
        <button type="button" className="button button-outline" onClick={onBack}>
          <ArrowLeft aria-hidden="true" />
          {t.back}
        </button>
        <button type="button" className="button button-primary" onClick={onNext}>
          {t.next}
          <ArrowRight aria-hidden="true" />
        </button>
        <button type="button" className="guide-skip" onClick={onSkip}>
          {t.skip}
        </button>
      </div>
    </section>
  )
}
