import { useMemo, useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Language } from '@/data/portfolio-content'
import { initialDraft, setChoice, type PathId } from '@/data/project-configurator'
import { entryTitles } from '@/data/home-guide'
import { ProjectStylePreview } from './project-style-preview'
import './project-guide.css'
import './guide-mockup-theme.css'

const text = {
  fr: { title: 'Votre projet prend forme', intro: 'Chaque fonctionnalité ajoutée devient une page de la maquette. Parcourez-la comme un vrai site : les contenus sont fictifs.', activityLabel: 'Quelle est votre activité ?', activityHint: 'La maquette s’adapte à ce que vous écrivez.', placeholder: 'Ex. restaurant, artisan, cabinet…', undecided: 'À définir ensemble', pagesTitle: 'Pages de votre maquette', pagesHint: 'Cliquez pour les ouvrir', newBadge: 'Nouveau', discTitle: 'Maquette basique.', discText: 'Elle montre uniquement les fonctionnalités de votre projet, pas son rendu final : le design, les couleurs et les contenus seront créés sur mesure pour vous.', back: 'Précédent', next: 'Suivant' },
  en: { title: 'Your project takes shape', intro: 'Every feature you added becomes a page of the mockup. Explore it like a real site: the content is sample content.', activityLabel: 'What is your business activity?', activityHint: 'The mockup adapts to what you write.', placeholder: 'E.g. restaurant, craft business, practice…', undecided: 'To discuss together', pagesTitle: 'Pages of your mockup', pagesHint: 'Click to open them', newBadge: 'New', discTitle: 'Basic mockup.', discText: 'It only shows the features of your project, not its final look: the design, colours and content will be created for you.', back: 'Back', next: 'Next' },
}

type GuideMockupProps = { newIds?: string[]; language: Language; path: PathId; selected: string[]; activity: string; onActivityChange: (value: string) => void; onBack: () => void; onNext: () => void }

export function GuideMockup({ newIds = [], language, path, selected, activity, onActivityChange, onBack, onNext }: GuideMockupProps) {
  const t = text[language]
  // The configurator's own preview is driven by a draft: build one the same way the configurator does.
  const draft = useMemo(() => {
    const undecided = activity === t.undecided
    let next = { ...initialDraft(path), activity: undecided ? '' : activity, namePending: undecided }
    for (const id of selected) next = setChoice(next, id, 'wanted')
    return next
  }, [path, selected, activity, t.undecided])

  const frameRef = useRef<HTMLDivElement>(null)

  return (
    <section className="stack-scene-inner guide-mockup" aria-labelledby="guide-mockup-title">
      <div className="guide-mockup-copy">
        <span className="eyebrow">{entryTitles[path]?.[language]}</span>
        <h2 id="guide-mockup-title" tabIndex={-1}>
          {t.title}
        </h2>
        <p className="guide-hint">{t.intro}</p>
        <div className="guide-field guide-mockup-activity">
          <label htmlFor="guide-mockup-activity">{t.activityLabel}</label>
          <input id="guide-mockup-activity" type="text" maxLength={160} placeholder={t.placeholder} value={activity} onChange={(event) => onActivityChange(event.target.value)} />
          <small>{t.activityHint}</small>
          <button type="button" className="guide-undecided" onClick={() => onActivityChange(t.undecided)}>
            {t.undecided}
          </button>
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
        </div>
      </div>
      <div className="guide-mockup-frame" ref={frameRef} data-lenis-prevent>
        <ProjectStylePreview draft={draft} language={language} lastChanged="" changeSequence={0} newIds={newIds} simple />
      </div>
    </section>
  )
}
