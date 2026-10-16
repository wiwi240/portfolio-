import { useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import type { Language } from '@/data/portfolio-content'
import { paths } from '@/site'
import { ServiceIllustration, type ServiceIllustrationKind } from './service-illustrations'
import { ServiceDetailDialog, type ServiceDetailCopy } from './service-detail-dialog'
import './services-catalog.css'

type Service = { id: ServiceIllustrationKind; title: string; description: string; example?: string }

const serviceDetails: Record<ServiceIllustrationKind, Record<Language, ServiceDetailCopy>> = {
  landing: {
    fr: { needs: 'Présenter une offre précise et orienter les visiteurs vers une action principale.', examples: ['Lancement d’une offre ou d’un événement', 'Campagne de communication', 'Collecte d’inscriptions'], scope: 'La page, son organisation, la présentation de l’offre et l’action principale peuvent être définies puis réalisées selon le périmètre convenu.' },
    en: { needs: 'Present one specific offer and guide visitors towards a clear primary action.', examples: ['Launching an offer or event', 'A communication campaign', 'Collecting registrations'], scope: 'The page, its structure, the way the offer is presented and its primary action can be defined and built according to the agreed scope.' },
  },
  showcase: {
    fr: { needs: 'Présenter votre activité de façon claire et aider les visiteurs à vous contacter.', examples: ['Présentation des prestations', 'Galerie de réalisations', 'Coordonnées et accès au contact'], scope: 'Le périmètre peut couvrir l’organisation des pages, la mise en valeur des contenus et les liens de contact retenus ensemble.' },
    en: { needs: 'Present your business clearly and make it easy for visitors to contact you.', examples: ['A presentation of your services', 'A portfolio of work', 'Contact details and contact links'], scope: 'The agreed scope can cover page structure, content presentation and the contact links selected together.' },
  },
  shop: {
    fr: { needs: 'Présenter des produits en ligne et permettre aux visiteurs de préparer puis passer une commande.', examples: ['Catalogue et fiches produits', 'Panier', 'Étape de paiement'], scope: 'Selon le périmètre retenu, la boutique peut comprendre un catalogue, un panier et le parcours de commande convenu, dont les modalités de paiement à définir.' },
    en: { needs: 'Show products online and let visitors prepare and place an order.', examples: ['A product catalogue and product pages', 'A shopping cart', 'A payment step'], scope: 'Depending on the selected scope, the shop can include a catalogue, a cart and the agreed ordering flow, with payment arrangements to be defined.' },
  },
  webapp: {
    fr: { needs: 'Donner accès depuis un navigateur à un service qui répond à un usage précis.', examples: ['Réservation et confirmation d’un rendez-vous', 'Échange d’informations', 'Suivi d’une demande'], scope: 'Les écrans et étapes du service peuvent être conçus et développés à partir des usages définis ensemble; les éventuelles connexions à d’autres outils sont à préciser.' },
    en: { needs: 'Make a service for a specific purpose available through a web browser.', examples: ['Booking and confirming an appointment', 'Exchanging information', 'Following a request'], scope: 'The screens and steps can be designed and built around the uses agreed together; any connections to other tools must be specified.' },
  },
  business: {
    fr: { needs: 'Rassembler des informations utiles et faciliter des tâches de gestion quotidiennes.', examples: ['Suivi de clients et de devis', 'Consultation de dossiers', 'Organisation d’un planning'], scope: 'L’outil peut réunir les vues et parcours nécessaires à la gestion définie avec vous. Les données et fonctions retenues sont précisées avant le développement.' },
    en: { needs: 'Bring useful information together and make everyday management tasks easier.', examples: ['Tracking clients and quotes', 'Viewing files', 'Organising a schedule'], scope: 'The tool can bring together the views and user journeys needed for the agreed workflow. The selected data and features are specified before development.' },
  },
  custom: {
    fr: { needs: 'Adapter les écrans et la navigation aux besoins de vos utilisateurs.', examples: ['Présenter des informations propres à votre activité', 'Organiser une navigation spécifique', 'Définir les interactions utiles'], scope: 'Les écrans, leur présentation et leurs interactions sont conçus selon les besoins définis ensemble et le périmètre validé.' },
    en: { needs: 'Adapt screens and navigation to your users’ needs.', examples: ['Presenting information specific to your business', 'Organising a tailored navigation', 'Defining useful interactions'], scope: 'Screens, their presentation and their interactions are designed according to the needs agreed together and the validated scope.' },
  },
  redesign: {
    fr: { needs: 'Faire évoluer la présentation ou la navigation d’un site existant.', examples: ['Revoir la hiérarchie des contenus', 'Clarifier la navigation', 'Harmoniser la présentation des pages'], scope: 'Après examen de l’existant, les changements à réaliser sont choisis avec vous. Leur conception et leur mise en place dépendent du périmètre retenu.' },
    en: { needs: 'Improve the presentation or navigation of an existing website.', examples: ['Reviewing content hierarchy', 'Clarifying navigation', 'Making page layouts more consistent'], scope: 'After reviewing the existing site, the changes are selected with you. Their design and implementation depend on the agreed scope.' },
  },
  features: {
    fr: { needs: 'Ajouter à une solution existante les usages qui manquent à votre activité.', examples: ['Parcours de réservation', 'Confirmation visible après une action', 'Nouvelle vue ou étape dans un parcours existant'], scope: 'La fonctionnalité, ses états et son intégration à l’existant sont définis ensemble avant réalisation.' },
    en: { needs: 'Add the uses your business needs to an existing solution.', examples: ['A booking flow', 'A visible confirmation after an action', 'A new view or step in an existing journey'], scope: 'The feature, its states and how it fits into the existing solution are agreed before implementation.' },
  },
  performance: {
    fr: { needs: 'Repérer ce qui ralentit le site ou l’application et améliorer son fonctionnement.', examples: ['Chargement des images', 'Organisation des ressources utilisées par une page', 'Vérification des pages concernées après optimisation'], scope: 'Les points à examiner et optimisations possibles sont définis à partir des lenteurs constatées et du périmètre convenu, sans présumer d’un gain chiffré.' },
    en: { needs: 'Identify what slows down a website or application and improve how it works.', examples: ['Image loading', 'How a page’s resources are organised', 'Checking affected pages after optimisation'], scope: 'Areas to review and possible optimisations are selected from observed slowdowns and the agreed scope, without assuming a numerical improvement.' },
  },
  fixes: {
    fr: { needs: 'Corriger un bug ou un dysfonctionnement constaté sur votre site ou application.', examples: ['Élément qui ne répond plus', 'Affichage incorrect', 'Erreur qui perturbe un parcours'], scope: 'Le problème est reproduit et le périmètre de correction est défini. Les corrections dépendent de la cause identifiée et de l’accord convenu.' },
    en: { needs: 'Fix a bug or malfunction found on your website or application.', examples: ['An element that no longer responds', 'Incorrect display', 'An error disrupting a user journey'], scope: 'The issue is reproduced and the correction scope is defined. The work depends on the identified cause and the agreed arrangement.' },
  },
  updates: {
    fr: { needs: 'Actualiser les composants d’un site ou d’une application et vérifier leur compatibilité.', examples: ['Mise à jour d’un composant utilisé', 'Vérification des pages concernées', 'Contrôle des parcours liés'], scope: 'Les composants à actualiser et les vérifications à effectuer sont définis selon l’existant et le périmètre convenu.' },
    en: { needs: 'Update website or application components and check their compatibility.', examples: ['Updating a component in use', 'Checking affected pages', 'Reviewing related user journeys'], scope: 'Components to update and checks to perform are defined according to the existing solution and the agreed scope.' },
  },
  support: {
    fr: { needs: 'Disposer d’un accompagnement technique adapté aux situations rencontrées.', examples: ['Comprendre un problème technique', 'Examiner une évolution envisagée', 'Effectuer une intervention définie ensemble'], scope: 'Chaque intervention dépend du périmètre convenu; le suivi ne comprend pas automatiquement des interventions illimitées.' },
    en: { needs: 'Get technical support that fits the situations you encounter.', examples: ['Understanding a technical issue', 'Reviewing a planned change', 'Carrying out an intervention agreed together'], scope: 'Each intervention depends on the agreed scope; ongoing support does not automatically include unlimited work.' },
  },
  hosting: {
    fr: { needs: 'Préparer la mise en ligne et vous accompagner dans les démarches auprès d’un prestataire d’hébergement.', examples: ['Configurer le déploiement du site', 'Vous guider dans l’espace du prestataire retenu', 'Vérifier l’accès à la version mise en ligne'], scope: 'L’accompagnement se fait chez le prestataire retenu. Les frais d’hébergement et autres frais facturés par ce prestataire sont distincts de la prestation.' },
    en: { needs: 'Prepare the website launch and guide you through the process with a hosting provider.', examples: ['Configure the website deployment', 'Guide you through the chosen provider’s account', 'Check access to the published version'], scope: 'Support is provided through the selected hosting provider. Hosting and other fees charged by that provider are separate from this service.' },
  },
}

const detailLabels = {
  fr: { viewDetails: 'Voir les détails', scopeNote: 'Ces exemples décrivent des possibilités. Ce qui est effectivement inclus est défini avec vous avant le début de la prestation.' },
  en: { viewDetails: 'View details', scopeNote: 'These examples describe possibilities. What is actually included is agreed with you before the service begins.' },
} satisfies Record<Language, { viewDetails: string; scopeNote: string }>

const content: Record<Language, {
  create: { title: string; intro: string; note: string; items: Service[] }
  improve: { title: string; items: Service[] }
  maintain: { title: string; note: string; cta: string; items: Service[] }
}> = {
  fr: {
    create: {
      title: 'Quelle solution pour votre activité ?', intro: 'Chaque format répond à un usage différent.', note: 'Un outil métier peut aussi être une application web.',
      items: [
        { id: 'landing', title: 'Landing page', description: 'Une page centrée sur une offre et une action.', example: 'Pour un lancement, une campagne ou des inscriptions.' },
        { id: 'showcase', title: 'Site vitrine', description: 'Un site pour présenter votre activité et faciliter le contact.', example: 'Vos prestations, réalisations et coordonnées.' },
        { id: 'shop', title: 'Boutique en ligne', description: 'Un site pour consulter vos produits et passer commande.', example: 'Catalogue, panier et paiement.' },
        { id: 'webapp', title: 'Application web', description: 'Un service accessible depuis un navigateur.', example: 'Réserver, échanger ou suivre une demande.' },
        { id: 'business', title: 'Outil métier', description: 'Un logiciel adapté à votre gestion quotidienne.', example: 'Clients, devis, dossiers et planning.' },
        { id: 'custom', title: 'Interface sur mesure', description: 'Des écrans et des parcours pensés pour vos utilisateurs.', example: 'Navigation, présentation et interactions.' },
      ],
    },
    improve: {
      title: 'Faire évoluer votre solution existante',
      items: [
        { id: 'redesign', title: 'Refonte', description: 'Repenser la présentation et la navigation de votre site.' },
        { id: 'features', title: 'Nouvelles fonctionnalités', description: 'Ajouter les usages dont votre activité a besoin.' },
        { id: 'performance', title: 'Performances', description: 'Identifier les lenteurs et optimiser le fonctionnement.' },
      ],
    },
    maintain: {
      title: 'Faire vivre votre solution dans le temps', note: 'Les frais d’hébergement et le périmètre du suivi sont précisés dans la prestation.', cta: 'Parlons de votre besoin',
      items: [
        { id: 'fixes', title: 'Corrections', description: 'Résoudre les bugs et les dysfonctionnements.' },
        { id: 'updates', title: 'Mises à jour', description: 'Actualiser les composants et vérifier la compatibilité.' },
        { id: 'support', title: 'Suivi technique', description: 'Des interventions définies selon vos besoins.' },
        { id: 'hosting', title: 'Mise en ligne et hébergement', description: 'Configurer le déploiement et vous accompagner chez le prestataire.' },
      ],
    },
  },
  en: {
    create: {
      title: 'Which solution fits your business?', intro: 'Each format serves a different purpose.', note: 'A business tool can also be a web application.',
      items: [
        { id: 'landing', title: 'Landing page', description: 'One page focused on an offer and a clear action.', example: 'For a launch, a campaign or registrations.' },
        { id: 'showcase', title: 'Showcase website', description: 'A website to present your business and make contact easy.', example: 'Your services, work and contact details.' },
        { id: 'shop', title: 'Online shop', description: 'A website where people can browse products and place orders.', example: 'Catalogue, cart and checkout.' },
        { id: 'webapp', title: 'Web application', description: 'A service available through a browser.', example: 'Book, communicate or follow a request.' },
        { id: 'business', title: 'Business tool', description: 'Software tailored to your day-to-day operations.', example: 'Clients, quotes, files and scheduling.' },
        { id: 'custom', title: 'Custom interface', description: 'Screens and journeys designed for your users.', example: 'Navigation, presentation and interactions.' },
      ],
    },
    improve: {
      title: 'Improve your existing solution',
      items: [
        { id: 'redesign', title: 'Redesign', description: 'Rethink your website’s presentation and navigation.' },
        { id: 'features', title: 'New features', description: 'Add the features your business needs.' },
        { id: 'performance', title: 'Performance', description: 'Find bottlenecks and improve how the site works.' },
      ],
    },
    maintain: {
      title: 'Keep your solution working over time', note: 'Hosting costs and the scope of ongoing support are specified in the service agreement.', cta: 'Discuss your needs',
      items: [
        { id: 'fixes', title: 'Bug fixes', description: 'Resolve bugs and malfunctions.' },
        { id: 'updates', title: 'Updates', description: 'Update components and check compatibility.' },
        { id: 'support', title: 'Technical support', description: 'Work carried out according to your needs.' },
        { id: 'hosting', title: 'Launch and hosting', description: 'Configure deployment and guide you with the hosting provider.' },
      ],
    },
  },
}

function ServiceCard({ service, language, onOpen }: { service: Service; language: Language; onOpen: (service: Service, trigger: HTMLButtonElement) => void }) {
  const t = detailLabels[language]
  return <article className="service-catalog-card">
    <div className="service-catalog-art"><ServiceIllustration kind={service.id} language={language} /></div>
    <div className="service-catalog-copy"><h3>{service.title}</h3><p>{service.description}</p>{service.example && <p className="service-catalog-example">{service.example}</p>}<button className="service-detail-trigger" type="button" data-service-id={service.id} aria-haspopup="dialog" aria-controls="service-detail-dialog" aria-label={`${t.viewDetails} : ${service.title}`} onClick={(event) => onOpen(service, event.currentTarget)}>{t.viewDetails}<ArrowRight aria-hidden="true" /></button></div>
  </article>
}

function SectionHeader({ number, label, title, accent, intro, id }: { number: string; label: string; title: string; accent: string; intro?: string; id: string }) {
  const accentStart = title.indexOf(accent)
  return <div className="service-catalog-heading"><span className="service-catalog-kicker">{number}<i />{label}</span><h2 id={id}>{accentStart < 0 ? title : <>{title.slice(0, accentStart)}<span>{accent}</span>{title.slice(accentStart + accent.length)}</>}</h2>{intro && <p>{intro}</p>}</div>
}

export function ServicesCatalog({ language }: { language: Language }) {
  const t = content[language]
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const openerRef = useRef<HTMLButtonElement>(null)
  const selectedDetail = selectedService ? serviceDetails[selectedService.id][language] : null
  const openService = (service: Service, trigger: HTMLButtonElement) => {
    openerRef.current = trigger
    setSelectedService(service)
  }
  return <div className="service-catalog home-container">
    <section className="service-catalog-section service-catalog-section--create" aria-labelledby="create-title"><SectionHeader number="01" label={language === 'fr' ? 'Créer' : 'Create'} title={t.create.title} accent={language === 'fr' ? 'votre activité ?' : 'your business?'} intro={t.create.intro} id="create-title" /><div className="service-catalog-grid service-catalog-grid--three">{t.create.items.map((service) => <ServiceCard key={service.id} service={service} language={language} onOpen={openService} />)}</div><p className="service-catalog-note">{t.create.note}</p></section>
    <section className="service-catalog-section service-catalog-section--improve" aria-labelledby="improve-title"><SectionHeader number="02" label={language === 'fr' ? 'Améliorer' : 'Improve'} title={t.improve.title} accent={language === 'fr' ? 'votre solution existante' : 'existing solution'} id="improve-title" /><div className="service-catalog-grid service-catalog-grid--three">{t.improve.items.map((service) => <ServiceCard key={service.id} service={service} language={language} onOpen={openService} />)}</div></section>
    <section className="service-catalog-section service-catalog-section--maintain" aria-labelledby="maintain-title"><SectionHeader number="03" label={language === 'fr' ? 'Maintenir et accompagner' : 'Maintain and support'} title={t.maintain.title} accent={language === 'fr' ? 'votre solution dans le temps' : 'solution working over time'} id="maintain-title" /><div className="service-catalog-grid service-catalog-grid--four">{t.maintain.items.map((service) => <ServiceCard key={service.id} service={service} language={language} onOpen={openService} />)}</div><p className="service-catalog-note">{t.maintain.note}</p><a className="home-button home-button-primary service-catalog-cta" href={paths[language].contact}>{t.maintain.cta}<ArrowRight aria-hidden="true" /></a></section>
    <ServiceDetailDialog service={selectedService} detail={selectedDetail} language={language} contactHref={paths[language].contact} scopeNote={detailLabels[language].scopeNote} onClose={() => setSelectedService(null)} openerRef={openerRef} />
  </div>
}
