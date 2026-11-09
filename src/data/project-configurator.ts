import type { Language } from './portfolio-content'

export type Localized = Record<Language, string>
export type PathId = 'create' | 'tool' | 'improve' | 'support' | 'unsure'
export type ChoiceState = 'wanted' | 'discuss'
export type Question = {
  id: string
  label: Localized
  hint?: Localized
  options?: { id: string; label: Localized }[]
}
export type Need = {
  id: string
  group: string
  title: Localized
  description: Localized
  example: Localized
  materials: Localized
  image: string
  questions: Question[]
  conditional?: 'privateDocuments' | 'privateMessages' | 'team' | 'automation' | 'connection' | 'metrics'
}
export type ProjectDraft = {
  path: PathId
  activity: string
  projectName: string
  namePending: boolean
  audience: string[]
  goal: string
  existing: string
  existingDetails: string
  aspiration: string
  choices: Record<string, ChoiceState>
  answers: Record<string, string>
  priorityNow: string[]
  priorityLater: string[]
  selfEdit: string[]
  languages: string
  materials: string[]
  dataToMove: string
  access: string
  importantDate: string
  budget: string
  dateReason: string
  constraints: string
  name: string
  email: string
  company: string
  message: string
}

const t = (fr: string, en: string): Localized => ({ fr, en })
const q = (id: string, fr: string, en: string, hint?: Localized): Question => ({ id, label: t(fr, en), hint })

export const pathOptions: { id: PathId; title: Localized; description: Localized; image: string }[] = [
  {
    id: 'create',
    title: t('Créer un site', 'Create a website'),
    description: t(
      'Présentez votre activité, obtenez des demandes, proposez des réservations ou vendez en ligne.',
      'Present your business, receive enquiries, offer bookings or sell online.',
    ),
    image: '/configurator-assets/create-studio.webp',
  },
  {
    id: 'tool',
    title: t('Créer un outil pour mon activité', 'Create a tool for my business'),
    description: t(
      'Centralisez vos clients, dossiers, documents, rendez-vous ou tâches dans un outil adapté à votre fonctionnement.',
      'Bring your clients, cases, documents, appointments and tasks into a tool tailored to your work.',
    ),
    image: '/configurator-assets/atelier-sillage-team.webp',
  },
  {
    id: 'improve',
    title: t('Améliorer un projet existant', 'Improve an existing project'),
    description: t(
      'Modernisez l’apparence de votre site, ajoutez des fonctionnalités ou simplifiez son utilisation.',
      'Modernise the look of your site, add features or make it easier to use.',
    ),
    image: '/configurator-assets/improve-workspace.webp',
  },
  {
    id: 'support',
    title: t('Corriger ou assurer le suivi d’un projet', 'Fix or maintain a project'),
    description: t(
      'Résolvez un problème, effectuez les mises à jour nécessaires ou mettez en place un suivi technique.',
      'Fix an issue, make necessary updates or arrange technical support.',
    ),
    image: '/configurator-assets/support-desk.webp',
  },
  {
    id: 'unsure',
    title: t('Je ne sais pas encore', 'I am not sure yet'),
    description: t(
      'Décrivez votre activité et laissez-vous guider vers les éléments les plus adaptés.',
      'Describe your business and explore the most suitable options.',
    ),
    image: '/configurator-assets/create-studio.webp',
  },
]

export const groups = [
  { id: 'present', title: t('Présenter votre activité', 'Present your business') },
  { id: 'requests', title: t('Recevoir des demandes', 'Receive enquiries') },
  { id: 'sell', title: t('Présenter ou vendre une offre', 'Present or sell an offer') },
  { id: 'clients', title: t('Créer un espace client', 'Create a client area') },
  { id: 'organize', title: t('Créer un outil métier', 'Create a business tool') },
  { id: 'content', title: t('Gérer votre contenu', 'Manage your content') },
]

export const compactCategories = [
  {
    id: 'present',
    title: t('Présenter mon activité', 'Present my business'),
    ids: ['presentActivity', 'portfolio', 'staffProfiles', 'testimonials'],
  },
  {
    id: 'requests',
    title: t('Recevoir des demandes', 'Receive enquiries'),
    ids: ['enquiries', 'appointments', 'quote', 'events', 'eventSignup'],
  },
  {
    id: 'sell',
    title: t('Vendre en ligne', 'Sell online'),
    ids: ['catalog', 'cart', 'payment', 'orderTracking'],
  },
  {
    id: 'organize',
    title: t('Gérer mon activité', 'Manage my business'),
    ids: ['customerManagement', 'planning', 'stock', 'team'],
  },
  {
    id: 'clients',
    title: t('Espace personnel', 'Personal area'),
    ids: ['clientArea', 'documents', 'messages', 'notifications'],
  },
  { id: 'all', title: t('Découvrir toutes les possibilités', 'Explore every feature'), ids: [] },
] as const

const studio = '/configurator-assets/create-studio.webp'
const detail = '/service-assets/lampe-aube-detail.webp'
const workspace = '/configurator-assets/improve-workspace.webp'
const desk = '/configurator-assets/support-desk.webp'
const aube = '/configurator-assets/atelier-sillage-aube.webp'
const documents = '/configurator-assets/atelier-sillage-documents.webp'
const booking = '/configurator-assets/atelier-sillage-booking.webp'
const team = '/configurator-assets/atelier-sillage-team.webp'

const c = (
  id: string,
  group: string,
  fr: string,
  en: string,
  descriptionFr: string,
  descriptionEn: string,
  exampleFr: string,
  exampleEn: string,
  materialsFr = 'Textes et informations à fournir ou à créer ensemble.',
  materialsEn = 'Content and information to provide or create together.',
  image = studio,
  questions: Question[] = [],
): Need => ({
  id,
  group,
  title: t(fr, en),
  description: t(descriptionFr, descriptionEn),
  example: t(exampleFr, exampleEn),
  materials: t(materialsFr, materialsEn),
  image,
  questions,
})
export const needs: Need[] = [
  c(
    'presentActivity',
    'present',
    'Page d’accueil',
    'Home page',
    'Présentez immédiatement votre activité, votre différence et l’action principale attendue.',
    'Introduce your business, what makes it different and the main action visitors should take.',
    'Un accueil qui oriente vers vos services.',
    'A home page that leads to your services.',
  ),
  c(
    'about',
    'present',
    'Présentation de l’entreprise',
    'About the business',
    'Expliquez votre histoire, votre méthode, vos valeurs et votre fonctionnement.',
    'Explain your story, approach, values and how you work.',
    'Votre parcours et votre façon de travailler.',
    'Your story and how you work.',
  ),
  c(
    'services',
    'present',
    'Présentation des services',
    'Services',
    'Détaillez vos prestations pour aider les visiteurs à comprendre ce que vous proposez.',
    'Explain your services so visitors understand what you offer.',
    'Une fiche par prestation.',
    'A page for each service.',
  ),
  c(
    'staffProfiles',
    'present',
    'Équipe ou intervenants',
    'Team or specialists',
    'Présentez les personnes, leurs rôles et leurs spécialités.',
    'Introduce the people, their roles and specialisms.',
    'Portraits et domaines d’expertise.',
    'Profiles and areas of expertise.',
    'Photos et rôles des personnes.',
    'Photos and roles of the people.',
    team,
  ),
  c(
    'portfolio',
    'present',
    'Réalisations ou galerie',
    'Work or gallery',
    'Montrez vos projets, créations, interventions ou résultats avec des images et des explications.',
    'Show projects, creations or results with images and explanations.',
    'Une galerie de trois réalisations ouvrables.',
    'A gallery of three projects with details.',
    'Photos et descriptions de réalisations.',
    'Project photos and descriptions.',
    detail,
  ),
  c(
    'testimonials',
    'present',
    'Témoignages clients',
    'Testimonials',
    'Rassurez les visiteurs avec des retours d’expérience authentiques.',
    'Build confidence with authentic client feedback.',
    'Deux retours de clients sur votre méthode.',
    'Two clients sharing their experience.',
    'Avis réels et autorisation de publication.',
    'Real feedback and permission to publish.',
  ),
  c(
    'articles',
    'present',
    'Actualités',
    'News',
    'Publiez des nouveautés, événements, conseils ou informations importantes.',
    'Publish news, events, advice and important updates.',
    'Un article sur une nouveauté.',
    'A post about something new.',
  ),
  c(
    'faq',
    'present',
    'FAQ',
    'FAQ',
    'Répondez aux questions fréquentes avant que les visiteurs aient besoin de vous contacter.',
    'Answer common questions before visitors need to contact you.',
    'Délais, déroulement et tarifs expliqués.',
    'Timing, process and pricing explained.',
    'Questions et réponses fiables.',
    'Reliable questions and answers.',
  ),
  c(
    'location',
    'present',
    'Coordonnées et localisation',
    'Contact details and location',
    'Affichez vos moyens de contact, vos horaires et votre zone d’intervention.',
    'Show how to contact you, your hours and service area.',
    'Adresse, horaires et zone couverte.',
    'Address, hours and service area.',
    'Coordonnées et horaires exacts.',
    'Accurate contact details and hours.',
  ),
  c(
    'enquiries',
    'requests',
    'Formulaire de contact',
    'Contact form',
    'Permettez aux visiteurs de vous envoyer une question simple.',
    'Let visitors send a simple question.',
    'Nom, email et message.',
    'Name, email and message.',
  ),
  c(
    'quote',
    'requests',
    'Demande de devis détaillée',
    'Detailed quote request',
    'Recueillez les informations utiles pour comprendre une demande avant de rappeler le client.',
    'Collect the details needed to understand a request before replying.',
    'Type de projet, dimensions et délai.',
    'Project type, size and timeline.',
  ),
  c(
    'fileUpload',
    'requests',
    'Envoi de fichiers',
    'File attachments',
    'Autorisez l’ajout de photos ou de documents à une demande.',
    'Let visitors attach photos or documents to a request.',
    'Joindre une photo du lieu.',
    'Attach a photo of the space.',
    'Types de fichiers et limites à définir.',
    'File types and limits to agree on.',
  ),
  c(
    'appointments',
    'requests',
    'Prise de rendez-vous',
    'Appointments',
    'Permettez de choisir un motif, une date et un créneau disponible.',
    'Let visitors choose a purpose, date and available time.',
    'Un rendez-vous découverte de 30 minutes.',
    'A 30 minute introductory call.',
    'Disponibilités et motifs de rendez-vous.',
    'Availability and appointment reasons.',
    booking,
  ),
  c(
    'booking',
    'requests',
    'Réservation d’une prestation',
    'Service booking',
    'Permettez de sélectionner une prestation, un nombre de participants ou des options avant de réserver.',
    'Let visitors select a service, participants or options before booking.',
    'Réserver un atelier pour deux personnes.',
    'Book a workshop for two.',
    'Prestations, capacités et disponibilités.',
    'Services, capacity and availability.',
    booking,
  ),
  c(
    'newsletter',
    'requests',
    'Inscription à une newsletter',
    'Newsletter signup',
    'Permettez aux visiteurs de recevoir vos nouvelles et communications.',
    'Let visitors sign up for news and updates.',
    'Une inscription depuis la page d’accueil.',
    'Sign up from the home page.',
    'Contenus à envoyer et consentement.',
    'Newsletter content and consent.',
  ),
  c(
    'catalog',
    'sell',
    'Catalogue de produits ou de prestations',
    'Product or service catalogue',
    'Organisez vos offres avec images, descriptions, catégories et détails. Un catalogue peut être utilisé sans vente en ligne.',
    'Organise offers with images, descriptions, categories and details. A catalogue works without online sales.',
    'Une collection avec catégories et fiches.',
    'A collection with categories and detail pages.',
    'Photos, descriptions et catégories.',
    'Photos, descriptions and categories.',
    aube,
  ),
  c(
    'productDetails',
    'sell',
    'Fiches détaillées',
    'Detail pages',
    'Donnez à chaque produit ou prestation sa propre présentation complète.',
    'Give every product or service a full detail page.',
    'Une fiche avec images et caractéristiques.',
    'A page with images and specifications.',
    'Descriptions et visuels de chaque offre.',
    'Descriptions and images for each offer.',
    aube,
  ),
  c(
    'cart',
    'sell',
    'Panier',
    'Basket',
    'Permettez de regrouper plusieurs produits avant de commander.',
    'Let customers collect multiple products before ordering.',
    'Ajouter une pièce puis modifier sa quantité.',
    'Add an item then change its quantity.',
    'Produits et prix à définir.',
    'Products and prices to define.',
    aube,
  ),
  c(
    'payment',
    'sell',
    'Paiement en ligne',
    'Online payment',
    'Permettez de régler une commande ou un acompte depuis le site.',
    'Let customers pay for an order or deposit on the site.',
    'Un acompte réglé lors de la réservation.',
    'A deposit paid with a booking.',
    'Prestataire et conditions de paiement à étudier.',
    'Payment provider and terms to review.',
    aube,
  ),
  c(
    'delivery',
    'sell',
    'Livraison ou retrait',
    'Delivery or collection',
    'Proposez les méthodes de récupération disponibles et leurs conditions.',
    'Offer the available delivery or collection methods and terms.',
    'Retrait à l’atelier ou livraison.',
    'Collect from the studio or receive delivery.',
    'Zones, frais et délais.',
    'Areas, fees and timing.',
    aube,
  ),
  c(
    'promotions',
    'sell',
    'Codes promotionnels',
    'Promo codes',
    'Créez des réductions temporaires ou réservées à certains clients.',
    'Create temporary or customer specific discounts.',
    'Un code de lancement limité.',
    'A limited launch code.',
    'Règles et durée des réductions.',
    'Discount rules and duration.',
    aube,
  ),
  c(
    'orderTracking',
    'sell',
    'Suivi de commande',
    'Order tracking',
    'Permettez au client de consulter les étapes de traitement de sa commande.',
    'Let customers see the progress of an order.',
    'Commande reçue, préparée puis expédiée.',
    'Received, prepared then shipped.',
    'Étapes réelles de traitement.',
    'Actual order handling stages.',
    aube,
  ),
  c(
    'clientArea',
    'clients',
    'Compte personnel',
    'Personal account',
    'Donnez à chaque client un accès privé à ses informations.',
    'Give each client private access to their information.',
    'Un tableau de bord personnel.',
    'A personal dashboard.',
  ),
  c(
    'documents',
    'clients',
    'Documents privés',
    'Private documents',
    'Partagez des devis, factures, fichiers ou documents uniquement avec les personnes concernées.',
    'Share quotes, invoices and files only with authorised people.',
    'Ouvrir un devis depuis son espace.',
    'Open a quote in the client area.',
    'Documents et droits d’accès à définir.',
    'Documents and access rules to define.',
    documents,
    [
      {
        id: 'documentPrivacy',
        label: t('Documents publics ou privés ?', 'Public or private documents?'),
        options: [
          { id: 'public', label: t('Publics', 'Public') },
          { id: 'private', label: t('Privés', 'Private') },
          { id: 'unsure', label: t('À préciser', 'To discuss') },
        ],
      },
      q('documentAccess', 'Qui peut consulter chaque document ?', 'Who can view each document?'),
    ],
  ),
  c(
    'messages',
    'clients',
    'Messagerie',
    'Messages',
    'Centralisez les échanges liés à une demande ou à un dossier.',
    'Keep conversations about a request or case in one place.',
    'Un échange dans le dossier client.',
    'A conversation in the client case.',
  ),
  c(
    'tracking',
    'clients',
    'Suivi de demande ou de dossier',
    'Request or case tracking',
    'Montrez clairement l’étape actuelle, les actions réalisées et les prochaines étapes.',
    'Show the current stage, completed actions and next steps.',
    'Une chronologie du dossier.',
    'A case timeline.',
  ),
  c(
    'history',
    'clients',
    'Historique',
    'History',
    'Retrouvez les demandes, rendez-vous, commandes ou documents précédents.',
    'Find previous requests, appointments, orders or documents.',
    'Les anciens rendez-vous d’un client.',
    'A client’s past appointments.',
  ),
  c(
    'notifications',
    'clients',
    'Notifications',
    'Notifications',
    'Informez le client lorsqu’une action ou une nouvelle information est disponible.',
    'Tell clients when an action or update is available.',
    'Une alerte lorsqu’un devis est prêt.',
    'An alert when a quote is ready.',
    'Événements et canaux à définir.',
    'Events and channels to define.',
  ),
  c(
    'customerManagement',
    'organize',
    'Gestion des clients',
    'Customer management',
    'Centralisez les coordonnées, demandes, échanges et informations utiles.',
    'Keep contact details, enquiries and useful information together.',
    'Une fiche client avec ses échanges.',
    'A client record with conversations.',
    team,
  ),
  c(
    'caseManagement',
    'organize',
    'Gestion des dossiers',
    'Case management',
    'Regroupez les informations, documents, statuts et personnes liés à chaque dossier.',
    'Bring each case’s information, documents, status and people together.',
    'Un dossier par projet client.',
    'One case per client project.',
    team,
  ),
  c(
    'quotesDocuments',
    'organize',
    'Devis et documents',
    'Quotes and documents',
    'Créez, classez et suivez les documents nécessaires à votre activité.',
    'Create, organise and track the documents your business needs.',
    'Un devis en attente de validation.',
    'A quote awaiting approval.',
    documents,
  ),
  c(
    'planning',
    'organize',
    'Planning et rendez-vous',
    'Schedule and appointments',
    'Organisez les disponibilités, affectations et événements de l’équipe.',
    'Organise team availability, assignments and events.',
    'Une semaine de rendez-vous.',
    'A week of appointments.',
    booking,
  ),
  c(
    'tasks',
    'organize',
    'Gestion des tâches',
    'Task management',
    'Répartissez les actions à effectuer et suivez leur avancement.',
    'Assign tasks and track their progress.',
    'Une tâche à faire puis terminée.',
    'A task moved from open to done.',
    team,
  ),
  c(
    'roles',
    'organize',
    'Gestion des utilisateurs et des rôles',
    'Users and roles',
    'Définissez précisément ce que chaque personne peut consulter ou modifier.',
    'Define what each person can view or edit.',
    'Une personne gère les dossiers, une autre les rendez-vous.',
    'One person manages cases, another appointments.',
    team,
  ),
  c(
    'statuses',
    'organize',
    'Statuts personnalisés',
    'Custom statuses',
    'Adaptez les étapes de suivi au véritable fonctionnement de l’activité.',
    'Tailor progress stages to how your business works.',
    'À étudier, en cours, livré.',
    'To review, in progress, delivered.',
    team,
  ),
  c(
    'team',
    'organize',
    'Tableau de bord',
    'Dashboard',
    'Regroupez les informations importantes et les actions prioritaires.',
    'Bring key information and priority actions together.',
    'Dossiers actifs et tâches du jour.',
    'Active cases and today’s tasks.',
    team,
  ),
  c(
    'metrics',
    'organize',
    'Statistiques',
    'Statistics',
    'Consultez des indicateurs utiles pour comprendre l’activité.',
    'View useful indicators to understand your business.',
    'Demandes reçues chaque mois.',
    'Monthly enquiries received.',
    team,
  ),
  c(
    'automation',
    'organize',
    'Automatisations',
    'Automations',
    'Déclenchez certaines actions répétitives selon des règles définies ensemble.',
    'Trigger repeated actions using rules agreed together.',
    'Créer une tâche après une demande.',
    'Create a task after an enquiry.',
    team,
  ),
  c(
    'connection',
    'organize',
    'Connexion avec des outils existants',
    'Connect existing tools',
    'Étudiez la possibilité d’échanger des données avec les services déjà utilisés. Faisabilité à vérifier.',
    'Explore data exchange with existing services. Feasibility to verify.',
    'Étudier un transfert de données entre deux outils.',
    'Review data flow between two tools.',
    'Nom et accès des outils, sous réserve de faisabilité.',
    'Tool names and access, subject to feasibility.',
    desk,
  ),
  c(
    'editTexts',
    'content',
    'Modifier les textes',
    'Edit text',
    'Mettez à jour les informations du site sans modifier le code.',
    'Update site information without changing code.',
    'Modifier les horaires depuis une interface.',
    'Change opening hours in an editor.',
  ),
  c(
    'editImages',
    'content',
    'Ajouter des images',
    'Add images',
    'Gérez les photos, réalisations ou visuels depuis une interface simple.',
    'Manage photos and visuals in a simple interface.',
    'Ajouter une nouvelle réalisation.',
    'Add a new project.',
  ),
  c(
    'manageOffers',
    'content',
    'Gérer les produits ou prestations',
    'Manage offers',
    'Ajoutez, modifiez ou retirez les offres présentées.',
    'Add, edit or remove the offers shown.',
    'Modifier une fiche produit.',
    'Edit a product page.',
  ),
  c(
    'publishNews',
    'content',
    'Publier des actualités',
    'Publish news',
    'Créez et programmez de nouveaux contenus.',
    'Create and schedule new content.',
    'Préparer un article à publier lundi.',
    'Schedule a post for Monday.',
  ),
  c(
    'multilingual',
    'content',
    'Plusieurs langues',
    'Multiple languages',
    'Proposez les contenus dans plusieurs langues.',
    'Offer content in multiple languages.',
    'Une version française et anglaise.',
    'French and English versions.',
    'Textes et traductions à fournir ou prévoir.',
    'Text and translations to provide or plan.',
  ),
  c(
    'administrators',
    'content',
    'Plusieurs administrateurs',
    'Multiple administrators',
    'Permettez à plusieurs personnes de gérer le projet avec des droits adaptés.',
    'Let several people manage the project with appropriate permissions.',
    'Un accès éditeur et un accès responsable.',
    'Editor and manager access.',
  ),
  c(
    'menu',
    'present',
    'Menu ou carte',
    'Menu',
    'Présentez les plats, boissons ou formules par catégorie.',
    'Present dishes, drinks or packages by category.',
    'Une carte consultable avant de réserver.',
    'A menu to browse before booking.',
  ),
  c(
    'events',
    'requests',
    'Création et gestion d’événements',
    'Create and manage events',
    'Publiez des événements avec une date, un lieu et une description.',
    'Publish events with a date, place and description.',
    'Ajouter un atelier découverte.',
    'Add an introductory workshop.',
  ),
  c(
    'eventSignup',
    'requests',
    'Inscription à des événements',
    'Event registration',
    'Permettez aux visiteurs de s’inscrire à un événement.',
    'Let visitors sign up for an event.',
    'Réserver une place pour un atelier.',
    'Book a place at a workshop.',
  ),
  c(
    'stock',
    'organize',
    'Gestion des stocks',
    'Stock management',
    'Suivez les quantités disponibles de vos produits ou fournitures.',
    'Track available quantities of products or supplies.',
    'Vérifier les articles à réapprovisionner.',
    'See which items need restocking.',
  ),
]

export const improvementOptions = [
  ['appearance', 'Apparence et présentation', 'Appearance and presentation'],
  ['navigation', 'Navigation et facilité d’utilisation', 'Navigation and ease of use'],
  ['mobile', 'Affichage mobile', 'Mobile display'],
  ['newFeatures', 'Nouvelles fonctionnalités', 'New features'],
  ['speed', 'Rapidité', 'Speed'],
  ['accessibility', 'Accessibilité', 'Accessibility'],
  ['seo', 'Référencement technique', 'Technical SEO'],
  ['technology', 'Hébergement ou technologie', 'Hosting or technology'],
  ['review', 'Avis sur l’ensemble', 'Overall review'],
  ['diagnosis', 'Diagnostic avant de choisir les travaux', 'Diagnosis before choosing work'],
] as const
export const supportOptions = [
  ['broken', 'Une fonction ne marche plus', 'A function no longer works'],
  ['display', 'Un problème d’affichage', 'A display problem'],
  ['updates', 'Des mises à jour', 'Updates'],
  ['ongoing', 'Un accompagnement régulier', 'Ongoing support'],
  ['launch', 'Une mise en ligne', 'A launch'],
  ['hosting', 'Un changement d’hébergeur', 'A hosting change'],
] as const

export const pathChoiceDetails: Record<string, { description: Localized; image: string }> = {
  appearance: {
    description: t(
      'Clarifier l’identité et la présentation des contenus.',
      'Clarify the identity and how content is presented.',
    ),
    image: workspace,
  },
  navigation: {
    description: t('Aider chacun à trouver ce qu’il cherche.', 'Help people find what they need.'),
    image: '/service-assets/interior-office.webp',
  },
  mobile: {
    description: t('Adapter les pages aux petits écrans.', 'Adapt pages to smaller screens.'),
    image: workspace,
  },
  newFeatures: {
    description: t('Ajouter de nouveaux usages à l’existant.', 'Add new uses to what already exists.'),
    image: studio,
  },
  speed: {
    description: t('Examiner les lenteurs ressenties.', 'Look into the delays people experience.'),
    image: '/service-assets/hosting-servers.png',
  },
  accessibility: {
    description: t(
      'Faciliter l’utilisation pour davantage de personnes.',
      'Make the site easier for more people to use.',
    ),
    image: workspace,
  },
  seo: {
    description: t(
      'Examiner les bases techniques de visibilité.',
      'Review the technical foundations for discoverability.',
    ),
    image: workspace,
  },
  technology: {
    description: t(
      'Étudier l’hébergement ou la base technique.',
      'Review hosting or the technical foundation.',
    ),
    image: '/service-assets/hosting-servers.png',
  },
  review: {
    description: t(
      'Prendre du recul sur le site dans son ensemble.',
      'Take a broader look at the whole site.',
    ),
    image: workspace,
  },
  diagnosis: {
    description: t(
      'Faire le point avant de choisir les travaux.',
      'Review the situation before choosing any work.',
    ),
    image: workspace,
  },
  broken: {
    description: t(
      'Décrire ce qui devrait se passer et ce qui arrive.',
      'Describe what should happen and what happens instead.',
    ),
    image: desk,
  },
  display: {
    description: t(
      'Signaler une page ou un écran qui s’affiche mal.',
      'Report a page or screen that displays incorrectly.',
    ),
    image: workspace,
  },
  updates: {
    description: t('Prévoir les mises à jour nécessaires.', 'Plan the updates that are needed.'),
    image: '/service-assets/hosting-servers.png',
  },
  ongoing: {
    description: t('Définir les interventions utiles dans le temps.', 'Define useful support over time.'),
    image: desk,
  },
  launch: {
    description: t('Préparer la publication du site ou de l’outil.', 'Prepare to publish the site or tool.'),
    image: studio,
  },
  hosting: {
    description: t('Organiser le déplacement sans perdre les données.', 'Plan a move without losing data.'),
    image: '/service-assets/hosting-servers.png',
  },
}
function pathQuestionsFor(draft: ProjectDraft): { main: string[]; extra: string[] } {
  if (draft.path === 'improve')
    return improvementOptions.some(([id]) => draft.choices[id])
      ? { main: ['current', 'affected', 'difficulty'], extra: ['preserve', 'changes', 'knownConstraints'] }
      : { main: ['current'], extra: [] }
  if (draft.path === 'support') {
    const choices = draft.choices
    return {
      main: [
        ...(choices.broken || choices.display ? ['expected', 'observed', 'steps'] : []),
        ...(choices.ongoing || choices.updates ? ['importantFunctions', 'interventions'] : []),
        ...(choices.launch || choices.hosting ? ['hostingInfo'] : []),
        ...(choices.updates || choices.launch || choices.hosting ? ['keepData'] : []),
      ],
      extra: choices.broken || choices.display ? ['errorMessage', 'device'] : [],
    }
  }
  return { main: [], extra: [] }
}

export function initialDraft(path: PathId = 'unsure'): ProjectDraft {
  return {
    path,
    activity: '',
    projectName: '',
    namePending: false,
    audience: [],
    goal: '',
    existing: '',
    existingDetails: '',
    aspiration: '',
    choices: {},
    answers: {},
    priorityNow: [],
    priorityLater: [],
    selfEdit: [],
    languages: '',
    materials: [],
    dataToMove: '',
    access: '',
    importantDate: '',
    budget: '',
    dateReason: '',
    constraints: '',
    name: '',
    email: '',
    company: '',
    message: '',
  }
}
function selectedNeedIds(draft: ProjectDraft) {
  return needs.filter((item) => draft.choices[item.id]).map((item) => item.id)
}
function hasPrivateDocuments(draft: ProjectDraft): boolean {
  return Boolean(draft.choices.documents && draft.answers.documentPrivacy !== 'public')
}
function getActiveQuestions(draft: ProjectDraft, need: Need): Question[] {
  return need.questions.filter((question) => question.id !== 'documentAccess' || hasPrivateDocuments(draft))
}
function removalConsequences(draft: ProjectDraft, id: string): string[] {
  if (id === 'newFeatures' && draft.path === 'improve') return selectedNeedIds(draft)
  if (id === 'catalog')
    return ['productDetails', 'cart', 'delivery', 'promotions', 'orderTracking'].filter(
      (item) => draft.choices[item],
    )
  return []
}
export function setChoice(draft: ProjectDraft, id: string, state?: ChoiceState): ProjectDraft {
  const choices = { ...draft.choices }
  if (state) {
    choices[id] = state
    if (
      ['productDetails', 'cart', 'delivery', 'promotions', 'orderTracking'].includes(id) &&
      !choices.catalog
    )
      choices.catalog = 'wanted'
  } else {
    delete choices[id]
    for (const linkedId of removalConsequences(draft, id)) delete choices[linkedId]
  }
  return {
    ...draft,
    choices,
    priorityNow: draft.priorityNow.filter((choiceId) => choices[choiceId]),
    priorityLater: draft.priorityLater.filter((choiceId) => choices[choiceId]),
  }
}
export function toProjectPayload(draft: ProjectDraft) {
  const pathQuestions = pathQuestionsFor(draft)
  const activeIds = new Set([...pathQuestions.main, ...pathQuestions.extra])
  for (const need of needs)
    if (draft.choices[need.id])
      for (const question of getActiveQuestions(draft, need)) activeIds.add(question.id)
  const answers = Object.fromEntries(Object.entries(draft.answers).filter(([id]) => activeIds.has(id)))
  const { name: _name, email: _email, company: _company, message: _message, ...project } = draft
  void _name
  void _email
  void _company
  void _message
  return { ...project, answers }
}