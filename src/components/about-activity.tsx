import type { Language } from '@/data/portfolio-content'
import { activitySample, activitySampleEnd, activitySampleSeed } from '@/data/activity-sample'
import ContributionSkyline from './ui/contribution-skyline'
import './about-activity.css'

const text = {
  fr: { label: 'Activité', title: 'Du code, toute l’année', intro: 'Une année de contributions, à explorer en 2D ou en 3D.', unit: 'contribution', heading: 'contributions sur la dernière année' },
  en: { label: 'Activity', title: 'Code, all year round', intro: 'A year of contributions, to explore in 2D or 3D.', unit: 'contribution', heading: 'contributions in the last year' },
}

export function AboutActivity({ language }: { language: Language }) {
  const t = text[language]
  return <section className="home-section about-activity" aria-labelledby="activity-title">
    <div className="home-section-heading home-section-heading--centered">
      <span className="eyebrow">{t.label}</span>
      <h2 id="activity-title">{t.title}</h2>
      <p>{t.intro}</p>
    </div>
    <div className="about-activity-chart">
      <ContributionSkyline
        data={activitySample}
        endDate={activitySampleEnd}
        seed={activitySampleSeed}
        locale={language === 'fr' ? 'fr-FR' : 'en-US'}
        unit={t.unit}
        title={language === 'fr' ? 'Contributions sur la dernière année' : 'Contributions in the last year'}
        footer={language === 'fr' ? 'Survolez un jour · glissez pour orbiter en 3D' : 'Hover a day · drag to orbit in 3D'}
        palette="ocean"
      />
    </div>
  </section>
}
