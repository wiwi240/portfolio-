import {
  improvementOptions,
  needs,
  pathChoiceDetails,
  supportOptions,
  type Localized,
  type PathId,
} from './project-configurator'

// The home page guides the visitor through the configurator's own categories, one slide each.
// Titles, descriptions and ids all come from project-configurator.ts; only the order per path is chosen here.
export type GuideItem = { id: string; title: Localized; description: Localized }
export type GuideColumn = { id: string; title: Localized; items: GuideItem[] }
// A slide with `columns` shows one column per category; `items` always lists every item of the slide.
export type GuidePanelData = GuideColumn & { columns?: GuideColumn[]; question?: Localized }

const ask = (fr: string, en: string): Localized => ({ fr, en })

// Short card titles for the home page. Ids, descriptions and images stay in pathOptions.
export const entryTitles: Partial<Record<PathId, Localized>> = {
  create: ask('Sites web', 'Websites'),
  tool: ask('Logiciels métier', 'Business software'),
  improve: ask('Refonte & amélioration', 'Redesign & improvement'),
  support: ask('Maintenance & suivi', 'Maintenance & support'),
}

// Guide categories: every need appears exactly once, at most seven per column so columns stay even.
const categories: Record<string, { title: Localized; ids: string[] }> = {
  present: { title: ask('Présenter mon activité', 'Present my business'), ids: ['presentActivity', 'about', 'services', 'staffProfiles', 'portfolio', 'testimonials'] },
  requests: { title: ask('Recevoir des demandes', 'Receive enquiries'), ids: ['enquiries', 'quote', 'fileUpload', 'appointments', 'booking', 'location'] },
  inform: { title: ask('Informer et animer', 'Inform and engage'), ids: ['articles', 'faq', 'menu', 'newsletter', 'events', 'eventSignup'] },
  sell: { title: ask('Vendre en ligne', 'Sell online'), ids: ['catalog', 'productDetails', 'cart', 'payment', 'delivery', 'promotions', 'orderTracking'] },
  clients: { title: ask('Espace personnel', 'Personal area'), ids: ['clientArea', 'documents', 'messages', 'tracking', 'history', 'notifications'] },
  manage: { title: ask('Gérer clients et dossiers', 'Manage clients and cases'), ids: ['customerManagement', 'caseManagement', 'quotesDocuments', 'planning', 'tasks', 'stock'] },
  steer: { title: ask('Piloter et automatiser', 'Steer and automate'), ids: ['roles', 'statuses', 'team', 'metrics', 'automation', 'connection'] },
  content: { title: ask('Gérer mon site', 'Manage my site'), ids: ['editTexts', 'editImages', 'manageOffers', 'publishNews', 'multilingual', 'administrators'] },
}

// Everyday wording for options whose configurator title is technical. Ids stay untouched, so saved requests are unaffected.
const plain: Record<string, [string, string]> = {
  fileUpload: ['Recevoir des fichiers de vos clients', 'Receive files from your clients'],
  faq: ['Questions fréquentes', 'Frequently asked questions'],
  newsletter: ['Lettre d’information par email', 'Email newsletter'],
  events: ['Annoncer des événements', 'Announce events'],
  eventSignup: ['Inscriptions aux événements', 'Event sign-ups'],
  catalog: ['Présenter mes produits ou prestations', 'Show my products or services'],
  productDetails: ['Une page par produit', 'One page per product'],
  promotions: ['Codes de réduction', 'Discount codes'],
  clientArea: ['Un compte pour chaque client', 'An account for each client'],
  documents: ['Retrouver ses documents', 'Find their documents'],
  messages: ['Échanger avec moi', 'Message me'],
  tracking: ['Suivre l’avancement de sa demande', 'Follow the progress of their request'],
  history: ['Revoir ses commandes et demandes', 'Look back at orders and requests'],
  notifications: ['Être prévenu par email', 'Get notified by email'],
  customerManagement: ['Fiches clients', 'Client records'],
  caseManagement: ['Suivi des dossiers', 'Case follow-up'],
  quotesDocuments: ['Créer devis et documents', 'Create quotes and documents'],
  tasks: ['Liste des tâches à faire', 'To-do list'],
  stock: ['Suivi des stocks', 'Stock tracking'],
  roles: ['Accès différents selon les personnes', 'Different access for each person'],
  statuses: ['Voir où en est chaque demande', 'See where each request stands'],
  metrics: ['Chiffres clés de l’activité', 'Key figures'],
  automation: ['Tâches répétitives automatiques', 'Automatic repetitive tasks'],
  connection: ['Relier vos outils actuels', 'Connect your current tools'],
  editImages: ['Changer les photos', 'Change the photos'],
  administrators: ['Plusieurs personnes pour gérer le site', 'Several people managing the site'],
}

const category = (id: string): GuideColumn => {
  const group = categories[id]
  if (!group) throw new Error(`Unknown category: ${id}`)
  const items = group.ids.map((needId) => {
    const need = needs.find((item) => item.id === needId)
    if (!need) throw new Error(`Unknown need: ${needId}`)
    return { id: need.id, title: plain[need.id] ? ask(...plain[need.id]) : need.title, description: need.description }
  })
  return { id, title: group.title, items }
}

// One plain question per category. Answering yes reveals the category's features; no or unsure moves on.
export type GuideAnswer = 'yes' | 'no' | 'unsure'
const questions: Record<string, Localized> = {
  present: ask('Voulez-vous présenter votre activité ?', 'Do you want to present your business?'),
  requests: ask('Voulez-vous être contacté ou prendre des rendez-vous ?', 'Do you want to be contacted or take appointments?'),
  inform: ask('Voulez-vous donner des nouvelles et animer votre site ?', 'Do you want to share news and engage visitors?'),
  sell: ask('Voulez-vous vendre en ligne ?', 'Do you want to sell online?'),
  clients: ask('Voulez-vous offrir un espace à vos clients ?', 'Do you want to give your clients their own area?'),
  content: ask('Voulez-vous pouvoir modifier le contenu vous-même ?', 'Do you want to edit the content yourself?'),
  manage: ask('Voulez-vous mieux organiser votre travail ?', 'Do you want to organise your work better?'),
  steer: ask('Voulez-vous suivre et piloter votre activité ?', 'Do you want to follow and steer your activity?'),
}
const question = (id: string): GuidePanelData => ({ ...category(id), question: questions[id] })

const choices = (id: string, title: Localized, list: ReadonlyArray<readonly [string, string, string]>): GuidePanelData => ({
  id,
  title,
  items: list.map(([itemId, fr, en]) => ({ id: itemId, title: ask(fr, en), description: pathChoiceDetails[itemId].description })),
})

export function guidePanels(path: PathId | null): GuidePanelData[] {
  switch (path) {
    case 'create':
      return ['present', 'requests', 'inform', 'sell', 'clients', 'content'].map(question)
    case 'tool':
      return ['manage', 'steer', 'clients', 'requests', 'content'].map(question)
    case 'improve':
      return [choices('improve', ask('Que souhaitez-vous améliorer ?', 'What would you like to improve?'), improvementOptions), ...['requests', 'sell', 'inform', 'content'].map(question)]
    case 'support':
      return [choices('support', ask('Quel suivi souhaitez-vous ?', 'What kind of support do you need?'), supportOptions)]
    default:
      return []
  }
}
