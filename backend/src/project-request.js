const PATHS = {
  create: 'Créer un site',
  tool: 'Créer un outil pour mon activité',
  improve: 'Améliorer un projet existant',
  support: 'Corriger ou assurer le suivi d’un projet',
  unsure: 'Je ne sais pas encore',
}
const AUDIENCES = {
  visitors: 'Visiteurs',
  clients: 'Clients',
  team: 'Équipe',
  partners: 'Partenaires',
  other: 'Autre',
}
const GOALS = {
  present: 'Présenter',
  enquiries: 'Recevoir des demandes',
  sell: 'Vendre',
  book: 'Réserver',
  organize: 'Organiser',
  other: 'Autre',
  unsure: 'À préciser ensemble',
}
const EXISTING = { yes: 'Oui', no: 'Non', inProgress: 'En cours', unsure: 'À préciser' }
const CHOICES = {
  presentActivity: 'Page d’accueil',
  about: 'Présentation de l’entreprise',
  services: 'Présentation des services',
  staffProfiles: 'Équipe ou intervenants',
  portfolio: 'Réalisations ou galerie',
  testimonials: 'Témoignages clients',
  articles: 'Actualités',
  faq: 'FAQ',
  location: 'Coordonnées et localisation',
  enquiries: 'Formulaire de contact',
  quote: 'Demande de devis détaillée',
  fileUpload: 'Envoi de fichiers',
  appointments: 'Prise de rendez-vous',
  booking: 'Réservation d’une prestation',
  newsletter: 'Inscription à une newsletter',
  catalog: 'Catalogue de produits ou de prestations',
  productDetails: 'Fiches détaillées',
  cart: 'Panier',
  payment: 'Paiement en ligne',
  delivery: 'Livraison ou retrait',
  promotions: 'Codes promotionnels',
  orderTracking: 'Suivi de commande',
  clientArea: 'Compte personnel',
  documents: 'Documents privés',
  messages: 'Messagerie',
  tracking: 'Suivi de demande ou de dossier',
  history: 'Historique',
  notifications: 'Notifications',
  customerManagement: 'Gestion des clients',
  caseManagement: 'Gestion des dossiers',
  quotesDocuments: 'Devis et documents',
  planning: 'Planning et rendez-vous',
  tasks: 'Gestion des tâches',
  roles: 'Gestion des utilisateurs et des rôles',
  statuses: 'Statuts personnalisés',
  team: 'Tableau de bord',
  metrics: 'Statistiques',
  automation: 'Automatisations',
  connection: 'Connexion avec des outils existants',
  editTexts: 'Modifier les textes',
  editImages: 'Ajouter des images',
  manageOffers: 'Gérer les produits ou prestations',
  publishNews: 'Publier des actualités',
  multilingual: 'Plusieurs langues',
  administrators: 'Plusieurs administrateurs',
  menu: 'Menu ou carte',
  events: 'Création et gestion d’événements',
  eventSignup: 'Inscription à des événements',
  stock: 'Gestion des stocks',
  commerce: 'Vendre en ligne',
  otherNeed: 'Un autre besoin',
  advice: 'Je souhaite être conseillé',
  appearance: 'Apparence et présentation',
  navigation: 'Navigation et facilité d’utilisation',
  mobile: 'Affichage mobile',
  newFeatures: 'Nouvelles fonctionnalités',
  speed: 'Rapidité',
  accessibility: 'Accessibilité',
  seo: 'Référencement technique',
  technology: 'Hébergement ou technologie',
  review: 'Avis sur l’ensemble',
  diagnosis: 'Diagnostic avant de choisir les travaux',
  broken: 'Une fonction ne marche plus',
  display: 'Un problème d’affichage',
  updates: 'Des mises à jour',
  ongoing: 'Un accompagnement régulier',
  launch: 'Une mise en ligne',
  hosting: 'Un changement d’hébergeur',
}
const NEED_IDS = [
  'presentActivity',
  'about',
  'services',
  'staffProfiles',
  'portfolio',
  'testimonials',
  'articles',
  'faq',
  'location',
  'enquiries',
  'quote',
  'fileUpload',
  'appointments',
  'booking',
  'newsletter',
  'catalog',
  'productDetails',
  'cart',
  'payment',
  'delivery',
  'promotions',
  'orderTracking',
  'clientArea',
  'documents',
  'messages',
  'tracking',
  'history',
  'notifications',
  'customerManagement',
  'caseManagement',
  'quotesDocuments',
  'planning',
  'tasks',
  'roles',
  'statuses',
  'team',
  'metrics',
  'automation',
  'connection',
  'editTexts',
  'editImages',
  'manageOffers',
  'publishNews',
  'multilingual',
  'administrators',
  'menu',
  'events',
  'eventSignup',
  'stock',
  'commerce',
  'otherNeed',
  'advice',
]
const IMPROVE_IDS = [
  'appearance',
  'navigation',
  'mobile',
  'newFeatures',
  'speed',
  'accessibility',
  'seo',
  'technology',
  'review',
  'diagnosis',
]
const SUPPORT_IDS = ['broken', 'display', 'updates', 'ongoing', 'launch', 'hosting']
const ANSWERS = {
  offers: 'Offres',
  contents: 'Contenus existants',
  media: 'Médias',
  mediaOwner: 'Ajout des médias',
  formats: 'Formats',
  publisher: 'Publication',
  enquiryFields: 'Informations demandées',
  enquiryReceiver: 'Destinataires',
  productType: 'Type de produits',
  productVolume: 'Volume de produits',
  variants: 'Variantes',
  visiblePrices: 'Prix visibles',
  saleType: 'Type de ventes',
  fulfilment: 'Livraison ou retrait',
  orderHandling: 'Gestion des commandes',
  payment: 'Paiement',
  bookingType: 'Type de réservation',
  staff: 'Intervenants',
  bookingPayment: 'Paiement éventuel',
  clientFunctions: 'Fonctions de l’espace personnel',
  documentFlow: 'Échange de documents',
  documentPrivacy: 'Confidentialité des documents',
  documentAccess: 'Identification et autorisations',
  participants: 'Participants',
  messageAccess: 'Accès aux messages',
  notifications: 'Notifications',
  stages: 'Étapes des dossiers',
  casePeople: 'Intervenants des dossiers',
  clientVisibility: 'Visibilité client',
  teamPeople: 'Utilisateurs et rôles',
  currentWorkflow: 'Fonctionnement actuel',
  teamRights: 'Droits',
  operation: 'Opération actuelle',
  trigger: 'Déclencheur',
  outcome: 'Résultat attendu',
  exceptions: 'Exceptions',
  tools: 'Outils à connecter',
  transferredData: 'Données transférées',
  direction: 'Sens du transfert',
  decisions: 'Décisions à éclairer',
  dataSource: 'Sources de données',
  otherDescription: 'Autre besoin',
  uncertainty: 'Point d’incertitude',
  current: 'Existant actuel',
  affected: 'Pages ou usages concernés',
  difficulty: 'Difficultés observées',
  preserve: 'À conserver',
  changes: 'Changements souhaités',
  knownConstraints: 'Contraintes connues',
  expected: 'Résultat attendu',
  observed: 'Résultat observé',
  steps: 'Étapes pour reproduire',
  errorMessage: 'Message d’erreur',
  device: 'Page, appareil et navigateur',
  importantFunctions: 'Fonctions importantes',
  interventions: 'Interventions souhaitées',
  hostingInfo: 'Domaine et hébergement',
  keepData: 'Données à conserver',
}
const SELF_EDIT = {
  texts: 'Textes',
  images: 'Images',
  products: 'Produits',
  availability: 'Disponibilités',
  other: 'Autres',
  unsure: 'À préciser',
}
const MATERIALS = {
  texts: 'Textes',
  photos: 'Photos',
  logo: 'Logo',
  documents: 'Documents',
  none: 'Pas encore',
  unsure: 'À préciser',
}
const ACCESS = { public: 'Public', private: 'Privé', mixed: 'Mixte', unsure: 'À préciser' }

const text = (value, max = 2000) => (typeof value === 'string' ? value.trim().slice(0, max) : '')
const validList = (value, options) =>
  Array.isArray(value) &&
  value.length <= Object.keys(options).length &&
  value.every((item) => Object.hasOwn(options, item)) &&
  new Set(value).size === value.length
const list = (value, names) => value.map((id) => names[id]).join(', ') || 'À préciser'

function validateProject(project) {
  if (!project || typeof project !== 'object' || Array.isArray(project)) return null
  if (
    !Object.hasOwn(PATHS, project.path) ||
    text(project.activity, 500).length < 2 ||
    text(project.activity).length > 160
  )
    return null
  if (project.audience !== undefined && !validList(project.audience, AUDIENCES)) return null
  if (project.goal && !Object.hasOwn(GOALS, project.goal)) return null
  if (project.existing && !Object.hasOwn(EXISTING, project.existing)) return null
  if (
    project.projectName !== undefined &&
    (typeof project.projectName !== 'string' || project.projectName.length > 160)
  )
    return null
  if (project.namePending !== undefined && typeof project.namePending !== 'boolean') return null
  const allowedChoices =
    project.path === 'improve'
      ? [...IMPROVE_IDS, ...NEED_IDS]
      : project.path === 'support'
        ? SUPPORT_IDS
        : NEED_IDS
  if (
    !project.choices ||
    typeof project.choices !== 'object' ||
    Array.isArray(project.choices) ||
    Object.entries(project.choices).some(
      ([id, state]) => !allowedChoices.includes(id) || !['wanted', 'discuss'].includes(state),
    )
  )
    return null
  if (
    !project.answers ||
    typeof project.answers !== 'object' ||
    Array.isArray(project.answers) ||
    Object.entries(project.answers).some(
      ([id, value]) => !Object.hasOwn(ANSWERS, id) || typeof value !== 'string' || value.length > 2000,
    )
  )
    return null
  if (
    !validList(project.priorityNow, CHOICES) ||
    !validList(project.priorityLater, CHOICES) ||
    [...project.priorityNow, ...project.priorityLater].some((id) => !project.choices[id]) ||
    project.priorityNow.some((id) => project.priorityLater.includes(id))
  )
    return null
  if (
    !validList(project.selfEdit, SELF_EDIT) ||
    !validList(project.materials, MATERIALS) ||
    (project.access && !Object.hasOwn(ACCESS, project.access))
  )
    return null
  const fields = [
    'existingDetails',
    'aspiration',
    'languages',
    'dataToMove',
    'importantDate',
    'dateReason',
    'constraints',
  ]
  if (fields.some((key) => typeof project[key] !== 'string' || project[key].length > 2000)) return null
  if (project.budget !== undefined && (typeof project.budget !== 'string' || project.budget.length > 160))
    return null
  if (
    project.answers.documentPrivacy &&
    !['public', 'private', 'unsure'].includes(project.answers.documentPrivacy)
  )
    return null
  return Object.fromEntries(
    [
      'path',
      'activity',
      'projectName',
      'namePending',
      'audience',
      'goal',
      'existing',
      'existingDetails',
      'aspiration',
      'choices',
      'answers',
      'priorityNow',
      'priorityLater',
      'selfEdit',
      'languages',
      'materials',
      'dataToMove',
      'access',
      'importantDate',
      'budget',
      'dateReason',
      'constraints',
    ]
      .filter((key) => project[key] !== undefined)
      .map((key) => [key, project[key]]),
  )
}

function buildProjectSummary(project, company, message) {
  const line = (label, value) => `${label} : ${value || 'À définir ensemble'}`
  const wanted = Object.keys(project.choices).filter((id) => project.choices[id] === 'wanted')
  const discuss = Object.keys(project.choices).filter((id) => project.choices[id] === 'discuss')
  const answerLines = Object.entries(project.answers)
    .filter(([, value]) => text(value))
    .map(([id, value]) => line(ANSWERS[id], text(value)))
  return [
    'DEMANDE DE PROJET',
    line('Parcours', PATHS[project.path]),
    line('Activité', text(project.activity)),
    line('Nom du projet', project.namePending ? 'À définir' : text(project.projectName)),
    ...(project.path === 'improve' || project.path === 'support'
      ? [
          line(
            'Existant',
            `${EXISTING[project.existing] || 'À préciser'}${text(project.existingDetails) ? ` — ${text(project.existingDetails)}` : ''}`,
          ),
        ]
      : []),
    '',
    'BESOINS SOUHAITÉS',
    ...wanted.map((id) => `• ${CHOICES[id]}`),
    ...(wanted.length ? [] : ['À préciser']),
    '',
    'POSSIBILITÉS À DISCUTER',
    ...discuss.map((id) => `• ${CHOICES[id]}`),
    ...(discuss.length ? [] : ['À préciser']),
    '',
    'PRÉCISIONS',
    ...answerLines,
    ...(answerLines.length ? [] : ['À préciser']),
    '',
    'CONTEXTE ET CONTACT',
    ...(text(project.aspiration) ? [line('Idée particulière', text(project.aspiration))] : []),
    ...(text(project.importantDate) ? [line('Délai souhaité', text(project.importantDate))] : []),
    ...(text(project.budget) ? [line('Budget indicatif', text(project.budget, 160))] : []),
    ...(project.materials?.length ? [line('Éléments disponibles', list(project.materials, MATERIALS))] : []),
    ...(text(project.dataToMove) ? [line('Données à reprendre', text(project.dataToMove))] : []),
    ...(text(project.constraints) ? [line('Contraintes et questions', text(project.constraints))] : []),
    ...(text(company, 160) ? [line('Entreprise', text(company, 160))] : []),
    ...(text(message) ? [line('Message complémentaire', text(message))] : []),
    '',
    'Ces choix servent de base à une discussion sur le périmètre, la faisabilité et le budget.',
  ].join('\n')
}

module.exports = { validateProject, buildProjectSummary, PATHS, CHOICES, ANSWERS, MATERIALS }
