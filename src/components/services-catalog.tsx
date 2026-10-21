import { useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import type { Language } from '@/data/portfolio-content'
import { paths } from '@/site'
import { ServiceIllustration, type ServiceIllustrationKind } from './service-illustrations'
import { ServiceDetailDialog } from './service-detail-dialog'
import { serviceDetailContent } from './service-detail-data'
import './services-catalog.css'

type Service = { id: ServiceIllustrationKind; title: string; description: string; example?: string }

const detailLabels = {
  fr: { viewDetails: 'Voir les détails' },
  en: { viewDetails: 'View details' },
} satisfies Record<Language, { viewDetails: string }>

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
  const selectedDetail = selectedService ? serviceDetailContent[selectedService.id][language] : null
  const openService = (service: Service, trigger: HTMLButtonElement) => {
    openerRef.current = trigger
    setSelectedService(service)
  }
  return <div className="service-catalog home-container">
    <section className="service-catalog-section service-catalog-section--create" aria-labelledby="create-title"><SectionHeader number="01" label={language === 'fr' ? 'Créer' : 'Create'} title={t.create.title} accent={language === 'fr' ? 'votre activité ?' : 'your business?'} intro={t.create.intro} id="create-title" /><div className="service-catalog-grid service-catalog-grid--three">{t.create.items.map((service) => <ServiceCard key={service.id} service={service} language={language} onOpen={openService} />)}</div><p className="service-catalog-note">{t.create.note}</p></section>
    <section className="service-catalog-section service-catalog-section--improve" aria-labelledby="improve-title"><SectionHeader number="02" label={language === 'fr' ? 'Améliorer' : 'Improve'} title={t.improve.title} accent={language === 'fr' ? 'votre solution existante' : 'existing solution'} id="improve-title" /><div className="service-catalog-grid service-catalog-grid--three">{t.improve.items.map((service) => <ServiceCard key={service.id} service={service} language={language} onOpen={openService} />)}</div></section>
    <section className="service-catalog-section service-catalog-section--maintain" aria-labelledby="maintain-title"><SectionHeader number="03" label={language === 'fr' ? 'Maintenir et accompagner' : 'Maintain and support'} title={t.maintain.title} accent={language === 'fr' ? 'votre solution dans le temps' : 'solution working over time'} id="maintain-title" /><div className="service-catalog-grid service-catalog-grid--four">{t.maintain.items.map((service) => <ServiceCard key={service.id} service={service} language={language} onOpen={openService} />)}</div><p className="service-catalog-note">{t.maintain.note}</p><a className="home-button home-button-primary service-catalog-cta" href={paths[language].contact}>{t.maintain.cta}<ArrowRight aria-hidden="true" /></a></section>
    <ServiceDetailDialog service={selectedService} detail={selectedDetail} language={language} contactHref={paths[language].contact} onClose={() => setSelectedService(null)} openerRef={openerRef} />
  </div>
}
