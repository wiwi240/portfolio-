import { Check } from 'lucide-react'
import type { Language } from '@/data/portfolio-content'
import './home-included.css'

// TO VALIDATE BY THE OWNER: these are example commitments, not confirmed facts. Edit the lists below before publishing.
const text = {
  fr: {
    label: 'Concrètement',
    title: 'Ce que vous obtenez, et comment bien démarrer',
    includedTitle: 'Inclus dans chaque projet',
    included: [
      'Un site qui s’affiche bien sur mobile, tablette et ordinateur',
      'Le code et les contenus vous appartiennent',
      'Mise en ligne et hébergement configurés',
      'Une prise en main expliquée, pas de jargon',
      'Un premier mois de corrections inclus',
    ],
    prepareTitle: 'Avant de me contacter',
    prepare: [
      'Votre objectif : ce que le site doit vous apporter',
      'Deux ou trois sites que vous aimez, ou pas',
      'Vos contenus : textes, photos, logo, même partiels',
      'Un budget approximatif et une date souhaitée',
    ],
    prepareNote: 'Pas besoin d’un brief parfait : le guide plus haut vous aide à le formuler.',
  },
  en: {
    label: 'In practice',
    title: 'What you get, and how to start well',
    includedTitle: 'Included in every project',
    included: [
      'A site that looks right on phone, tablet and desktop',
      'You own the code and the content',
      'Launch and hosting set up',
      'A walkthrough in plain words, no jargon',
      'A first month of fixes included',
    ],
    prepareTitle: 'Before you get in touch',
    prepare: [
      'Your goal: what the site should do for you',
      'Two or three sites you like, or dislike',
      'Your content: texts, photos, logo, even partial',
      'A rough budget and a desired date',
    ],
    prepareNote: 'No need for a perfect brief: the guide above helps you put it into words.',
  },
}

export function HomeIncluded({ language }: { language: Language }) {
  const t = text[language]
  return (
    <section className="stack-scene-inner home-section home-included" aria-labelledby="home-included-title">
      <div className="home-section-heading home-section-heading--centered">
        <span className="eyebrow">{t.label}</span>
        <h2 id="home-included-title">{t.title}</h2>
      </div>
      <div className="home-included-grid">
        <div className="home-included-card">
          <h3>{t.includedTitle}</h3>
          <ul className="home-included-list">
            {t.included.map((item) => (
              <li key={item}>
                <span className="home-included-mark" aria-hidden="true">
                  <Check size={16} strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="home-included-card">
          <h3>{t.prepareTitle}</h3>
          <ol className="home-included-list home-included-steps">
            {t.prepare.map((item, index) => (
              <li key={item}>
                <span className="home-included-mark" aria-hidden="true">
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
          <p className="home-included-note">{t.prepareNote}</p>
        </div>
      </div>
    </section>
  )
}
