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
export type GuidePanelData = GuideColumn & { columns?: GuideColumn[]; question?: Localized; hint?: Localized }

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
// Each question names the concrete result for the visitor, and the hint lists what it covers so the answer is never a guess.
const questions: Record<string, { ask: Localized; hint: Localized }> = {
  present: {
    ask: ask('Un site qui présente votre entreprise et vos services ?', 'A site that presents your business and services?'),
    hint: ask('Page d’accueil, présentation de l’entreprise, vos services, votre équipe, vos réalisations et les avis de vos clients.', 'Home page, about the business, your services, your team, your work and client reviews.'),
  },
  requests: {
    ask: ask('Des clients qui vous contactent ou réservent en ligne ?', 'Clients who contact you or book online?'),
    hint: ask('Formulaire de contact, demande de devis, envoi de fichiers, rendez-vous, réservation, plan d’accès.', 'Contact form, quote request, file upload, appointments, booking, directions.'),
  },
  inform: {
    ask: ask('Publier des actualités, événements ou une FAQ ?', 'Publish news, events or an FAQ?'),
    hint: ask('Actualités, questions fréquentes, menu ou carte, lettre d’information, événements et inscriptions.', 'News, frequently asked questions, menu, newsletter, events and sign-ups.'),
  },
  sell: {
    ask: ask('Vendre vos produits avec paiement en ligne ?', 'Sell your products with online payment?'),
    hint: ask('Catalogue, une page par produit, panier, paiement en ligne, livraison, codes de réduction, suivi de commande.', 'Catalogue, one page per product, basket, online payment, delivery, discount codes, order tracking.'),
  },
  clients: {
    ask: ask('Un espace personnel avec connexion pour chaque client ?', 'A personal login area for each client?'),
    hint: ask('Se connecter, retrouver ses documents, vous écrire, suivre l’avancement de sa demande, être prévenu par email.', 'Log in, find their documents, message you, follow their request, get email updates.'),
  },
  content: {
    ask: ask('Modifier vous-même les textes et photos du site ?', 'Edit the site’s texts and photos yourself?'),
    hint: ask('Changer les textes et les photos, gérer vos produits ou prestations, publier des actualités, ajouter des langues ou des administrateurs.', 'Change texts and photos, manage your products or services, publish news, add languages or administrators.'),
  },
  manage: {
    ask: ask('Gérer vos clients, dossiers et devis au même endroit ?', 'Manage your clients, cases and quotes in one place?'),
    hint: ask('Fiches clients, suivi des dossiers, devis et documents, planning, liste des tâches, stocks.', 'Client records, case follow-up, quotes and documents, planning, to-do list, stock.'),
  },
  steer: {
    ask: ask('Un tableau de bord avec chiffres et tâches automatiques ?', 'A dashboard with figures and automatic tasks?'),
    hint: ask('Tableau de bord, chiffres clés, accès différents selon les personnes, statut de chaque demande, tâches automatiques, liaison avec vos outils.', 'Dashboard, key figures, different access per person, status of each request, automatic tasks, links with your tools.'),
  },
}
const question = (id: string): GuidePanelData => ({ ...category(id), question: questions[id].ask, hint: questions[id].hint })

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
