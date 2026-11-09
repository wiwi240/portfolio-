import type { Language } from './portfolio-content'
import type { PathId } from './project-configurator'

export type ServiceId = 'websites' | 'webapps' | 'business' | 'redesign'
export type Service = { id: ServiceId; title: string; text: string; path: PathId }

export const services: Record<Language, ReadonlyArray<Service>> = {
  fr: [
    { id: 'websites', title: 'Sites web', text: 'Vitrines, portfolios et sites de présentation, rapides à charger et simples à mettre à jour.', path: 'create' },
    { id: 'webapps', title: 'Applications web', text: 'Interfaces interactives avec comptes, données et parcours utilisateur.', path: 'tool' },
    { id: 'business', title: 'Logiciels métier', text: 'Outils sur mesure pour suivre clients, dossiers, rendez-vous et documents.', path: 'tool' },
    { id: 'redesign', title: 'Refonte et maintenance', text: 'Modernisation d’un site existant, corrections et mises à jour régulières.', path: 'improve' },
  ],
  en: [
    { id: 'websites', title: 'Websites', text: 'Showcase sites, portfolios and presentation pages that load fast and are easy to update.', path: 'create' },
    { id: 'webapps', title: 'Web applications', text: 'Interactive interfaces with accounts, data and user journeys.', path: 'tool' },
    { id: 'business', title: 'Business software', text: 'Custom tools to follow clients, files, appointments and documents.', path: 'tool' },
    { id: 'redesign', title: 'Redesign and maintenance', text: 'Modernising an existing site, fixes and regular updates.', path: 'improve' },
  ],
}
