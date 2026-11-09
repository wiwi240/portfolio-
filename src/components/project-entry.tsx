import { ArrowRight, Check } from 'lucide-react'
import { paths } from '@/site'
import { entryTitles } from '@/data/home-guide'
import { entryVideos } from '@/data/entry-videos'
import { pathOptions, type PathId } from '@/data/project-configurator'
import type { Language } from '@/data/portfolio-content'
import './project-entry.css'

// Clips play on hover or keyboard focus; on touch screens they loop on their own. Never with reduced motion.
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const touchOnly = () => window.matchMedia('(hover: none)').matches
const playClip = (card: HTMLElement) => { if (!reduceMotion()) void card.querySelector('video')?.play().catch(() => {}) }
const stopClip = (card: HTMLElement) => { const video = card.querySelector('video'); if (video && !touchOnly()) video.pause() }

type ProjectEntryProps = { language: Language; active: PathId | null; onSelect: (path: PathId) => void }

export function ProjectEntry({ language, active, onSelect }: ProjectEntryProps) {
  const p = paths[language]
  const fr = language === 'fr'
  const cards = pathOptions.filter((option) => entryTitles[option.id])
  return (
    <section className="stack-scene-inner project-entry" aria-labelledby="project-entry-title">
      <div className="project-entry-heading">
        <span className="eyebrow">{fr ? 'VOTRE PROJET' : 'YOUR PROJECT'}</span>
        <h2 id="project-entry-title" tabIndex={-1}>
          {fr ? 'De quoi avez-vous besoin ?' : 'What do you need?'}
        </h2>
        <p>
          {fr
            ? 'Explorez les possibilités et précisez votre besoin. Nous définirons ensemble la solution et le budget.'
            : 'Explore the possibilities and describe your needs. We will define the solution and budget together.'}
        </p>
      </div>
      <div className="project-entry-grid" role="group" aria-labelledby="project-entry-title">
        {cards.map((option, index) => {
          const selected = active === option.id
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              className={`project-entry-card project-entry-${option.id}`}
              onClick={() => onSelect(option.id)}
              onPointerEnter={(event) => playClip(event.currentTarget)}
              onPointerLeave={(event) => stopClip(event.currentTarget)}
              onFocus={(event) => playClip(event.currentTarget)}
              onBlur={(event) => stopClip(event.currentTarget)}
            >
              <span className="project-entry-image">
                <img src={option.image} alt="" loading="lazy" />
                {entryVideos[option.id] && (
                  <video muted loop playsInline preload="metadata" poster={option.image} aria-hidden="true" autoPlay={touchOnly() && !reduceMotion()}>
                    {entryVideos[option.id]!.map((source) => <source key={source.src} src={source.src} type={source.type} />)}
                  </video>
                )}
                <span>0{index + 1}</span>
              </span>
              <span className="project-entry-copy">
                <strong>{entryTitles[option.id]?.[language]}</strong>
                <span className="project-entry-more">
                <span className="project-entry-text">{option.description[language]}</span>
                <span className="project-entry-cta">
                  {selected ? (
                    <>
                      <Check size={18} aria-hidden="true" /> {fr ? 'Parcours choisi' : 'Selected path'}
                    </>
                  ) : (
                    <>
                      {fr ? 'Choisir ce parcours' : 'Choose this path'} <ArrowRight size={18} aria-hidden="true" />
                    </>
                  )}
                </span>
                </span>
              </span>
            </button>
          )
        })}
      </div>
      <a className="project-entry-unsure" href={`${p.configurator}?parcours=unsure`}>
        {fr ? 'Je ne sais pas encore' : 'I am not sure yet'}
        <ArrowRight size={16} aria-hidden="true" />
      </a>
    </section>
  )
}
