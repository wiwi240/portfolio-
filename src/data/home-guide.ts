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
export type GuidePanelData = GuideColumn & { columns?: GuideColumn[] }

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

// One slide whose columns are the given categories, side by side.
const slide = (id: string, title: Localized, ids: string[]): GuidePanelData => {
  const columns = ids.map(category)
  return { id, title, items: columns.flatMap((column) => column.items), columns }
}

const featuresTitle = ask('Voici ce que nous pouvons faire pour vous', 'Here is what we can do for you')

// Page 1 of the guide: what the visitor wants to be able to do, in everyday words. Each need opens one or more categories on page 2.
export type GuideTheme = { id: string; title: Localized; description: Localized; categories: string[] }
export const needsTitle = ask('Qu’est-ce que vous voulez pouvoir faire ?', 'What do you want to be able to do?')
const theme = (id: string, fr: [string, string], en: [string, string], categoryIds: string[]): GuideTheme => ({ id: `need-${id}`, title: ask(fr[0], en[0]), description: ask(fr[1], en[1]), categories: categoryIds })
const themes = {
  show: theme('show', ['Montrer ce que je fais', 'Photos, services, qui je suis, avis de clients.'], ['Show what I do', 'Photos, services, who I am, client reviews.'], ['present']),
  contact: theme('contact', ['Être contacté ou prendre des rendez-vous', 'Formulaire de contact, devis, réservations.'], ['Be contacted or take appointments', 'Contact form, quotes, bookings.'], ['requests']),
  news: theme('news', ['Donner des nouvelles et animer', 'Actualités, newsletter, événements, questions fréquentes.'], ['Share news and engage', 'News, newsletter, events, frequently asked questions.'], ['inform']),
  sell: theme('sell', ['Vendre en ligne', 'Produits ou prestations, panier, paiement, livraison.'], ['Sell online', 'Products or services, basket, payment, delivery.'], ['sell']),
  clients: theme('clientspace', ['Offrir un espace à mes clients', 'Retrouver leurs documents, suivre leur dossier, m’écrire.'], ['Give my clients their own area', 'Find their documents, follow their file, message me.'], ['clients']),
  organize: theme('organize', ['Mieux organiser mon travail', 'Fiches clients, planning, tâches, stocks, chiffres clés.'], ['Organise my work better', 'Client records, planning, tasks, stock, key figures.'], ['manage', 'steer']),
  editing: theme('editing', ['Modifier mon site moi-même', 'Changer les textes et les photos sans aide.'], ['Edit my site myself', 'Change texts and photos without help.'], ['content']),
}
const themesByPath: Partial<Record<PathId, GuideTheme[]>> = {
  create: [themes.show, themes.contact, themes.news, themes.sell, themes.clients, themes.editing],
  tool: [themes.organize, themes.clients, themes.contact, themes.editing],
}
export const guideThemes = (path: PathId | null): GuideTheme[] => (path && themesByPath[path]) || []

const choices = (id: string, title: Localized, list: ReadonlyArray<readonly [string, string, string]>): GuidePanelData => ({
  id,
  title,
  items: list.map(([itemId, fr, en]) => ({ id: itemId, title: ask(fr, en), description: pathChoiceDetails[itemId].description })),
})

// Page 2: one column per category opened by the needs ticked on page 1 (`chosen` holds theme ids).
export function guidePanels(path: PathId | null, chosen: string[] = []): GuidePanelData[] {
  switch (path) {
    case 'create':
    case 'tool': {
      const ids = guideThemes(path).filter((item) => chosen.includes(item.id)).flatMap((item) => item.categories)
      return [slide('features', featuresTitle, [...new Set(ids)])]
    }
    case 'improve':
      return [choices('improve', ask('Que souhaitez-vous améliorer ?', 'What would you like to improve?'), improvementOptions), slide('features', ask('Souhaitez-vous ajouter quelque chose ?', 'Would you like to add anything?'), ['requests', 'sell', 'inform', 'content'])]
    case 'support':
      return [choices('support', ask('Quel suivi souhaitez-vous ?', 'What kind of support do you need?'), supportOptions)]
    default:
      return []
  }
}
