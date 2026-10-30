import { ArrowRight } from 'lucide-react'
import { paths } from '@/site'
import { pathOptions } from '@/data/project-configurator'
import type { Language } from '@/data/portfolio-content'
import './project-entry.css'

export function ProjectEntry({ language }: { language: Language }) {
  const p = paths[language]
  return <section id="votre-projet" className="home-container home-section project-entry" aria-labelledby="project-entry-title"><div className="project-entry-heading"><span className="eyebrow">{language === 'fr' ? 'VOTRE PROJET' : 'YOUR PROJECT'}</span><h2 id="project-entry-title">{language === 'fr' ? 'De quoi avez-vous besoin ?' : 'What do you need?'}</h2><p>{language === 'fr' ? 'Explorez les possibilités et précisez votre besoin. Nous définirons ensemble la solution et le budget.' : 'Explore the possibilities and describe your needs. We will define the solution and budget together.'}</p></div><div className="project-entry-grid">{pathOptions.filter(item => item.id !== 'unsure').map((option,index) => <a key={option.id} href={`${p.configurator}?parcours=${option.id}`} className={`project-entry-card project-entry-${option.id}`}><div className="project-entry-image"><img src={option.image} alt="" loading="lazy"/><span>0{index + 1}</span></div><div className="project-entry-copy"><h3>{option.title[language]}</h3><p>{option.description[language]}</p><span>{language === 'fr' ? 'Explorer ce parcours' : 'Explore this path'} <ArrowRight size={18} aria-hidden="true" /></span></div></a>)}</div><a className="project-entry-unsure" href={`${p.configurator}?parcours=unsure`}>{language === 'fr' ? 'Je ne sais pas encore' : 'I am not sure yet'}<ArrowRight size={16} aria-hidden="true" /></a></section>
}
