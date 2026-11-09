import { createElement, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Expand,
  FileText,
  Menu,
  Monitor,
  RefreshCw,
  ShoppingBag,
  Smartphone,
  Users,
  X,
} from 'lucide-react'
import { guideIcon } from '@/data/guide-icons'
import { managementPageIds } from '@/data/management-pages'
import { ManagementPage } from './preview-management-pages'
import type { Language } from '@/data/portfolio-content'
import type { ProjectDraft } from '@/data/project-configurator'
import { previewContextFor, previewModules, type PreviewContext } from '@/data/project-preview-adapter'
import './project-style-preview.css'

const tr = (language: Language, fr: string, en: string) => (language === 'fr' ? fr : en)
const demoKinds = [
  {
    match: /luminaire|lampe|éclairage|eclairage|lighting|light/i,
    name: ['Atelier Sillage', 'Atelier Sillage'],
    title: [
      'Des luminaires façonnés pour donner du caractère à vos espaces',
      'Lighting crafted to give your spaces character',
    ],
    offering: ['Luminaires sur mesure', 'Custom lighting'],
    image: '/configurator-assets/atelier-sillage-aube.webp',
    images: [
      '/configurator-assets/atelier-sillage-aube.webp',
      '/service-assets/atelier-sillage-tournage.webp',
      '/service-assets/lampe-aube-detail.webp',
    ],
    items: ['Lampe Aube', 'Suspension Sillage', 'Applique Horizon'],
  },
  {
    match: /céramique|ceramic|poterie|pottery/i,
    name: ['Atelier Terre', 'Terra Studio'],
    title: [
      'Des pièces façonnées pour accompagner vos moments de vie',
      'Pieces crafted for everyday moments',
    ],
    offering: ['Céramiques artisanales', 'Handmade ceramics'],
    image: '/configurator-assets/demo-ceramics.webp',
    items: ['Collection Terre', 'Vase Horizon', 'Tasse Épure'],
  },
  {
    match: /restaurant|café|cafe|boulanger|pâtisser|patisser|traiteur|food|cuisine/i,
    name: ['Maison Saison', 'Season House'],
    title: ['Une cuisine de saison à savourer et à partager', 'Seasonal food made to share'],
    offering: ['Carte de saison', 'Seasonal menu'],
    image: '/configurator-assets/demo-cafe.webp',
    images: [
      '/configurator-assets/demo-cafe.webp',
      '/configurator-assets/demo-cafe-dish.webp',
      '/configurator-assets/demo-cafe-dining.webp',
    ],
    items: ['Menu du jour', 'Atelier dégustation', 'Table du week-end'],
  },
  {
    match: /coiff|soin|bien-être|bien etre|massage|thérap|therap|santé|sante/i,
    name: ['Studio Harmonie', 'Harmony Studio'],
    title: ['Un accompagnement attentif pour prendre soin de vous', 'Thoughtful care tailored to you'],
    offering: ['Séances personnalisées', 'Personal sessions'],
    image: '/configurator-assets/demo-wellness.webp',
    items: ['Séance découverte', 'Accompagnement', 'Atelier collectif'],
  },
  {
    match: /architect|décor|decor|design/i,
    name: ['Studio Perspective', 'Perspective Studio'],
    title: ['Des espaces pensés autour de votre façon de vivre', 'Spaces shaped around the way you live'],
    offering: ['Projets sur mesure', 'Tailored projects'],
    image: '/configurator-assets/demo-architecture.webp',
    items: ['Maison Épure', 'Intérieur Clair', 'Projet Horizon'],
  },
]
function demoContent(draft: ProjectDraft, language: Language) {
  const kind = demoKinds.find((item) => item.match.test(draft.activity))
  const i = language === 'fr' ? 0 : 1
  return {
    name:
      draft.projectName.trim() ||
      (draft.namePending || !draft.activity.trim()
        ? tr(language, 'Votre activité', 'Your business')
        : kind?.name[i] || draft.activity.trim().replace(/^./, (c) => c.toUpperCase())),
    title:
      kind?.title[i] ||
      tr(
        language,
        'Une activité à découvrir, des solutions à votre mesure',
        'Discover our work and find a solution made for you',
      ),
    offering:
      kind?.offering[i] || tr(language, 'Services adaptés à vos besoins', 'Services tailored to your needs'),
    image: kind?.image || '/configurator-assets/create-studio.webp',
    images: kind && 'images' in kind ? kind.images : undefined,
    items: kind?.items || [
      tr(language, 'Projet Signature', 'Signature project'),
      tr(language, 'Service Essentiel', 'Essential service'),
      tr(language, 'Création sur mesure', 'Tailored work'),
    ],
  }
}
const names: Record<string, [string, string]> = {
  home: ['Accueil', 'Home'],
  dashboard: ['Tableau de bord', 'Dashboard'],
  presentActivity: ['Accueil', 'Home'],
  about: ['Présentation', 'About'],
  services: ['Services', 'Services'],
  staffProfiles: ['Équipe', 'Team'],
  portfolio: ['Galerie', 'Gallery'],
  testimonials: ['Témoignages', 'Testimonials'],
  articles: ['Actualités', 'News'],
  faq: ['FAQ', 'FAQ'],
  location: ['Coordonnées', 'Contact details'],
  enquiries: ['Contact', 'Contact'],
  quote: ['Devis', 'Quote'],
  fileUpload: ['Fichiers', 'Files'],
  appointments: ['Rendez-vous', 'Appointments'],
  booking: ['Réservation', 'Booking'],
  newsletter: ['Newsletter', 'Newsletter'],
  catalog: ['Catalogue', 'Catalogue'],
  productDetails: ['Fiches', 'Details'],
  cart: ['Panier', 'Basket'],
  payment: ['Paiement', 'Payment'],
  delivery: ['Livraison', 'Delivery'],
  promotions: ['Promotions', 'Promotions'],
  orderTracking: ['Commande', 'Order'],
  clientArea: ['Mon espace', 'My area'],
  documents: ['Documents', 'Documents'],
  messages: ['Messagerie', 'Messages'],
  tracking: ['Suivi', 'Tracking'],
  history: ['Historique', 'History'],
  notifications: ['Notifications', 'Notifications'],
  customerManagement: ['Clients', 'Customers'],
  caseManagement: ['Dossiers', 'Cases'],
  quotesDocuments: ['Devis', 'Quotes'],
  planning: ['Planning', 'Schedule'],
  tasks: ['Tâches', 'Tasks'],
  roles: ['Rôles', 'Roles'],
  statuses: ['Statuts', 'Statuses'],
  team: ['Tableau de bord', 'Dashboard'],
  metrics: ['Statistiques', 'Statistics'],
  automation: ['Automatisations', 'Automations'],
  connection: ['Connexion', 'Integration'],
  editTexts: ['Textes', 'Text'],
  editImages: ['Images', 'Images'],
  manageOffers: ['Offres', 'Offers'],
  publishNews: ['Publications', 'Posts'],
  multilingual: ['Langues', 'Languages'],
  administrators: ['Administrateurs', 'Administrators'],
  menu: ['Menu', 'Menu'],
  events: ['Événements', 'Events'],
  eventSignup: ['Inscriptions', 'Registration'],
  stock: ['Stocks', 'Stock'],
}
const pageName = (id: string, language: Language) => names[id]?.[language === 'fr' ? 0 : 1] || id
const contextName = (context: PreviewContext, language: Language) =>
  context === 'public'
    ? tr(language, 'Site public', 'Public site')
    : context === 'client'
      ? tr(language, 'Espace client', 'Client area')
      : tr(language, 'Gestion', 'Management')

export function ProjectStylePreview({
  draft,
  language,
  lastChanged,
  changeSequence,
  newIds,
}: {
  draft: ProjectDraft
  language: Language
  lastChanged: string
  changeSequence: number
  /** Optional ids shown with a "new" badge (used by the home guide). */
  newIds?: string[]
}) {
  const modules = useMemo(() => previewModules(draft, language), [draft, language])
  const enabled = useMemo(() => new Set(modules.map((item) => item.id)), [modules])
  const content = useMemo(() => demoContent(draft, language), [draft, language])
  const [destination, setDestination] = useState('home')
  const [history, setHistory] = useState(['home'])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [expanded, setExpanded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [highlight, setHighlight] = useState('')
  const [detail, setDetail] = useState<number | null>(null)
  const [category, setCategory] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [cart, setCart] = useState<Record<number, number>>({})
  const [calendarMonth, setCalendarMonth] = useState(0)
  const [calendarBase] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [selectedService, setSelectedService] = useState(0)
  const [participants, setParticipants] = useState(1)
  const [confirmation, setConfirmation] = useState('')
  const [messages, setMessages] = useState<string[]>([])
  const [taskDone, setTaskDone] = useState(false)
  const [caseStep, setCaseStep] = useState(1)
  const [events, setEvents] = useState<{ title: string; date: string }[]>([])
  const [stock, setStock] = useState<Record<number, number>>({ 0: 6, 1: 3, 2: 9 })
  const [clientDetail, setClientDetail] = useState<number | null>(null)
  const handledSequence = useRef(0)
  const previousEnabled = useRef<Set<string>>(new Set())
  const historyIndexRef = useRef(historyIndex)
  useEffect(() => {
    historyIndexRef.current = historyIndex
  }, [historyIndex])
  const isTool = draft.path === 'tool'
  const base = isTool ? 'dashboard' : 'home'
  const currentPage =
    destination === 'home' && isTool
      ? 'dashboard'
      : destination === 'dashboard' && !isTool
        ? 'home'
        : destination === 'home' || destination === 'dashboard' || enabled.has(destination)
          ? destination
          : base
  const currentContext: PreviewContext =
    currentPage === 'dashboard'
      ? 'management'
      : currentPage === 'home'
        ? 'public'
        : previewContextFor(currentPage)
  const contexts: PreviewContext[] = [
    ...(!isTool || modules.some((item) => item.context === 'public') ? ['public' as const] : []),
    ...(modules.some((item) => item.context === 'client') ? ['client' as const] : []),
    ...(isTool || modules.some((item) => item.context === 'management') ? ['management' as const] : []),
  ]
  const contextModules = modules.filter(
    (item) => item.context === currentContext && item.id !== 'presentActivity',
  )
  const fakeDomain = `${
    content.name
      .toLocaleLowerCase(language)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 34) || 'votre-activite'
  }.example`
  const cartCount = Object.values(cart).reduce((total, count) => total + count, 0)
  const cartTotal = Object.entries(cart).reduce(
    (total, [index, count]) => total + (45 + Number(index) * 30) * count,
    0,
  )
  const addToCart = (index: number, count = 1) =>
    setCart((previous) => ({ ...previous, [index]: (previous[index] || 0) + count }))
  const changeCart = (index: number, count: number) =>
    setCart((previous) => {
      const next = { ...previous }
      if (count <= 0) delete next[index]
      else next[index] = count
      return next
    })
  const resetDemo = () => {
    setDetail(null)
    setCategory(0)
    setQuantity(1)
    setCart({})
    setCalendarMonth(0)
    setSelectedDate('')
    setSelectedSlot('')
    setSelectedService(0)
    setParticipants(1)
    setConfirmation('')
    setMessages([])
    setTaskDone(false)
    setCaseStep(1)
    setEvents([])
    setStock({ 0: 6, 1: 3, 2: 9 })
    setClientDetail(null)
  }
  const navigate = (page: string) => {
    const target =
      page === 'presentActivity'
        ? 'home'
        : page === 'home' || page === 'dashboard' || enabled.has(page)
          ? page
          : base
    setDestination(target)
    setHistory((previous) => [...previous.slice(0, historyIndex + 1), target])
    setHistoryIndex(historyIndex + 1)
    setMenuOpen(false)
    setDetail(null)
    setConfirmation('')
    document.getElementById('psp-site')?.scrollTo({ top: 0, behavior: 'auto' })
  }
  const switchContext = (context: PreviewContext) =>
    navigate(
      modules.find((item) => item.context === context && item.id !== 'presentActivity')?.id ||
        (context === 'management' ? 'dashboard' : 'home'),
    )
  useEffect(() => {
    if (handledSequence.current === changeSequence) return
    handledSequence.current = changeSequence
    if (!lastChanged || !enabled.has(lastChanged)) return
    const target = lastChanged === 'presentActivity' ? 'home' : lastChanged
    const timer = window.setTimeout(() => {
      setDestination(target)
      setHistory((previous) => [...previous.slice(0, historyIndexRef.current + 1), target])
      setHistoryIndex(historyIndexRef.current + 1)
      setDetail(null)
      setConfirmation('')
      setHighlight(target)
      setNotice(
        `${pageName(lastChanged, language)} — ${tr(language, 'aperçu disponible, essayez cette vue.', 'preview ready, try this view.')}`,
      )
      document.getElementById('psp-site')?.scrollTo({ top: 0, behavior: 'auto' })
    }, 0)
    const clear = window.setTimeout(() => {
      setHighlight('')
      setNotice('')
    }, 2200)
    return () => {
      clearTimeout(timer)
      clearTimeout(clear)
    }
  }, [changeSequence, lastChanged, enabled, language])
  useEffect(() => {
    const removed = [...previousEnabled.current].filter((id) => !enabled.has(id))
    previousEnabled.current = enabled
    if (!removed.length) return
    const timer = window.setTimeout(() => {
      if (removed.some((id) => ['catalog', 'productDetails', 'cart'].includes(id))) {
        setCart({})
        setQuantity(1)
        setCategory(0)
      }
      if (removed.some((id) => ['booking', 'appointments'].includes(id))) {
        setCalendarMonth(0)
        setSelectedDate('')
        setSelectedSlot('')
        setSelectedService(0)
        setParticipants(1)
      }
      if (removed.includes('messages')) setMessages([])
      if (removed.includes('tasks')) setTaskDone(false)
      if (removed.includes('events')) setEvents([])
      if (removed.includes('stock')) setStock({ 0: 6, 1: 3, 2: 9 })
      if (removed.includes('customerManagement')) setClientDetail(null)
      if (removed.some((id) => ['tracking', 'orderTracking'].includes(id))) setCaseStep(1)
      if (removed.includes(destination)) {
        setDestination(base)
        setHistory([base])
        setHistoryIndex(0)
        setDetail(null)
        setConfirmation('')
        setNotice(tr(language, 'Vue retirée — retour à l’accueil.', 'View removed — back to start.'))
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [enabled, destination, base, language])
  useEffect(() => {
    if (!expanded) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(false)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [expanded])
  const moveHistory = (offset: number) => {
    const nextIndex = historyIndex + offset
    if (nextIndex < 0 || nextIndex >= history.length) return
    setHistoryIndex(nextIndex)
    setDestination(
      enabled.has(history[nextIndex]) || ['home', 'dashboard'].includes(history[nextIndex])
        ? history[nextIndex]
        : base,
    )
    setDetail(null)
    document.getElementById('psp-site')?.scrollTo({ top: 0, behavior: 'auto' })
  }
  const localSubmit = (event: FormEvent<HTMLFormElement>, message: string) => {
    event.preventDefault()
    setConfirmation(message)
  }
  const demoNote = tr(
    language,
    'Démonstration interactive — aucune commande, réservation ou donnée n’est transmise.',
    'Interactive demo — no order, booking or data is transmitted.',
  )
  const intro = (title: string, description: string) => (
    <div className="psp-intro">
      <small>{tr(language, 'APERÇU INTERACTIF', 'INTERACTIVE PREVIEW')}</small>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
  const media = (index = 0) => (
    <img
      src={content.images?.[index % content.images.length] || content.image}
      alt={`${content.items[index % content.items.length]} — ${tr(language, 'illustration de démonstration', 'sample illustration')}`}
    />
  )
  const simpleForm = (kind: string) =>
    confirmation ? (
      <p className="psp-success" role="status">
        <Check size={18} />
        {confirmation}
      </p>
    ) : (
      <form
        className="psp-demo-form"
        onSubmit={(event) =>
          localSubmit(
            event,
            tr(language, 'Envoi fictif confirmé localement.', 'Sample submission confirmed locally.'),
          )
        }
      >
        <label>
          {tr(language, 'Votre nom', 'Your name')}
          <input required />
        </label>
        <label>
          Email
          <input required type="email" />
        </label>
        {kind === 'quote' && (
          <label>
            {tr(language, 'Votre projet', 'Your project')}
            <input required />
          </label>
        )}
        {kind === 'fileUpload' && (
          <label>
            {tr(language, 'Fichier de démonstration', 'Sample file')}
            <input type="file" />
          </label>
        )}
        <label>
          {tr(language, 'Votre message', 'Your message')}
          <textarea required rows={3} />
        </label>
        <button type="submit" className="psp-primary">
          {tr(language, 'Simuler l’envoi', 'Simulate sending')}
        </button>
      </form>
    )
  const monthDate = new Date(calendarBase.year, calendarBase.month + calendarMonth, 1)
  const monthLabel = new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-GB', {
    month: 'long',
    year: 'numeric',
  }).format(monthDate)
  const leadingDays = (monthDate.getDay() + 6) % 7
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()
  const bookingView = () => (
    <div className="psp-widget">
      <CalendarDays size={24} />
      <h3>{tr(language, 'Choisissez un créneau', 'Choose a time')}</h3>
      <fieldset>
        <legend>
          {currentPage === 'booking'
            ? tr(language, 'Prestation', 'Service')
            : tr(language, 'Motif', 'Reason')}
        </legend>
        {[tr(language, 'Découverte', 'Introduction'), tr(language, 'Atelier', 'Workshop')].map(
          (item, index) => (
            <button
              type="button"
              key={item}
              aria-pressed={selectedService === index}
              onClick={() => setSelectedService(index)}
            >
              {item}
            </button>
          ),
        )}
      </fieldset>
      {currentPage === 'booking' && (
        <div className="psp-participants">
          <strong>{tr(language, 'Participants', 'Participants')}</strong>
          <button
            type="button"
            aria-label={tr(language, 'Réduire le nombre de participants', 'Decrease participants')}
            onClick={() => setParticipants(Math.max(1, participants - 1))}
          >
            −
          </button>
          <span>{participants}</span>
          <button
            type="button"
            aria-label={tr(language, 'Augmenter le nombre de participants', 'Increase participants')}
            onClick={() => setParticipants(participants + 1)}
          >
            +
          </button>
        </div>
      )}
      <div className="psp-calendar">
        <div className="psp-calendar-header">
          <strong>{monthLabel}</strong>
          <div>
            <button
              type="button"
              aria-label={tr(language, 'Mois précédent', 'Previous month')}
              onClick={() => {
                setCalendarMonth((value) => value - 1)
                setSelectedDate('')
                setConfirmation('')
              }}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label={tr(language, 'Mois suivant', 'Next month')}
              onClick={() => {
                setCalendarMonth((value) => value + 1)
                setSelectedDate('')
                setConfirmation('')
              }}
            >
              ›
            </button>
          </div>
        </div>
        <div
          className="psp-calendar-grid"
          role="group"
          aria-label={tr(language, 'Choisissez une date', 'Choose a date')}
        >
          {(language === 'fr'
            ? ['L', 'M', 'M', 'J', 'V', 'S', 'D']
            : ['M', 'T', 'W', 'T', 'F', 'S', 'S']
          ).map((day, index) => (
            <small key={`${day}-${index}`}>{day}</small>
          ))}
          {Array.from({ length: leadingDays }, (_, index) => (
            <span key={`empty-${index}`} aria-hidden="true" />
          ))}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = String(index + 1)
            return (
              <button
                key={day}
                type="button"
                aria-pressed={selectedDate === day}
                onClick={() => {
                  setSelectedDate(day)
                  setConfirmation('')
                }}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
      <fieldset>
        <legend>{tr(language, 'Horaire', 'Time')}</legend>
        {['10:00', '14:00', '16:00'].map((slot) => (
          <button
            type="button"
            key={slot}
            aria-pressed={selectedSlot === slot}
            onClick={() => setSelectedSlot(slot)}
          >
            {slot}
          </button>
        ))}
      </fieldset>
      {confirmation ? (
        <p className="psp-success">
          <Check size={18} />
          {confirmation}
        </p>
      ) : (
        <button
          type="button"
          className="psp-primary"
          disabled={!selectedDate || !selectedSlot}
          onClick={() =>
            setConfirmation(
              tr(
                language,
                `${currentPage === 'booking' ? `Prestation ${selectedService === 0 ? 'Découverte' : 'Atelier'} · ${participants} participant(s) · ` : 'Rendez-vous · '}créneau fictif du ${selectedDate} ${monthLabel} à ${selectedSlot} confirmé.`,
                `${currentPage === 'booking' ? `${selectedService === 0 ? 'Introduction' : 'Workshop'} · ${participants} participant(s) · ` : 'Appointment · '}sample time on ${selectedDate} ${monthLabel} at ${selectedSlot} confirmed.`,
              ),
            )
          }
        >
          {tr(language, 'Confirmer fictivement', 'Confirm sample booking')}
        </button>
      )}
    </div>
  )
  const productCards = () => (
    <div className="psp-products">
      {content.items
        .map((item, index) => ({ item, index }))
        .filter(({ index }) => category === 0 || index === category - 1)
        .map(({ item, index }) => (
          <article key={item}>
            {media(index)}
            <h3>{item}</h3>
            <p>{tr(language, 'Une proposition à découvrir en détail.', 'Explore this offer in detail.')}</p>
            <strong>{45 + index * 30} €</strong>
            <button type="button" className="psp-secondary" onClick={() => setDetail(index)}>
              {tr(language, 'Voir la fiche', 'View details')}
            </button>
          </article>
        ))}
    </div>
  )
  const productDetail = detail !== null && (
    <div className="psp-inline-detail">
      <button
        type="button"
        aria-label={tr(language, 'Fermer la fiche', 'Close details')}
        onClick={() => setDetail(null)}
      >
        <X size={18} />
      </button>
      <h3>{content.items[detail]}</h3>
      <p>
        {tr(
          language,
          'Matériaux, dimensions et options sont présentés ici dans une fiche de démonstration.',
          'Materials, dimensions and options appear on this sample detail page.',
        )}
      </p>
      {enabled.has('cart') && (
        <>
          <div className="psp-cart-controls">
            <button
              type="button"
              aria-label={tr(language, 'Réduire la quantité', 'Decrease quantity')}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              −
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              aria-label={tr(language, 'Augmenter la quantité', 'Increase quantity')}
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="psp-primary"
            onClick={() => {
              addToCart(detail, quantity)
              setConfirmation(
                tr(language, 'Produit ajouté au panier fictif.', 'Item added to the sample basket.'),
              )
            }}
          >
            {tr(language, 'Ajouter au panier', 'Add to basket')}
          </button>
          {confirmation && <p className="psp-success">{confirmation}</p>}
        </>
      )}
    </div>
  )
  const publicContent = () => {
    if (currentPage === 'home')
      return (
        <>
          <section className="psp-hero">
            <div className="psp-hero-copy">
              <small>{content.name}</small>
              <h1>{content.title}</h1>
              <p>
                {tr(
                  language,
                  'Découvrez notre savoir-faire et imaginons ensemble la suite de votre projet.',
                  'Explore our work and shape the next step together.',
                )}
              </p>
              <div>
                <button
                  type="button"
                  className="psp-primary"
                  onClick={() =>
                    enabled.has('booking')
                      ? navigate('booking')
                      : enabled.has('enquiries')
                        ? navigate('enquiries')
                        : document.getElementById('psp-contact')?.scrollIntoView({
                            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                              ? 'auto'
                              : 'smooth',
                          })
                  }
                >
                  {tr(language, 'Parlons de votre projet', 'Let’s talk')}
                </button>
              </div>
            </div>
            <div className="psp-hero-media">{media()}</div>
          </section>
          <p className="psp-start-note">
            {tr(
              language,
              'Exemple de départ — complétez votre configuration pour le personnaliser.',
              'Starting example — complete your configuration to personalise it.',
            )}
          </p>
          <section id="psp-services" className="psp-home-section">
            <small>{tr(language, 'NOS SERVICES', 'OUR SERVICES')}</small>
            <h2>{content.offering}</h2>
            <div className="psp-service-line">
              <strong>{tr(language, 'Une offre claire', 'A clear offer')}</strong>
              <span>
                {tr(
                  language,
                  'Découvrez ce que nous pouvons réaliser avec vous.',
                  'See what we can create with you.',
                )}
              </span>
            </div>
            {contextModules.length > 0 && (
              <div className="psp-feature-links">
                {contextModules.map((item) => (
                  <button key={item.id} type="button" data-new={newIds?.includes(item.id) || undefined} onClick={() => navigate(item.id)}>
                    <i className="psp-feature-icon" aria-hidden="true">
                      {createElement(guideIcon(item.id), { size: 20, strokeWidth: 1.9 })}
                    </i>
                    <strong>{pageName(item.id, language)}</strong>
                    <span>{item.description}</span>
                    <ChevronRight size={18} />
                  </button>
                ))}
              </div>
            )}
          </section>
          <section id="psp-about" className="psp-home-section psp-home-about">
            <small>{tr(language, 'À PROPOS', 'ABOUT')}</small>
            <h2>{tr(language, 'Une approche attentive à chaque détail', 'Care in every detail')}</h2>
            <p>
              {tr(
                language,
                `${content.name} met son savoir-faire au service de projets personnels et soignés.`,
                `At ${content.name}, thoughtful work shapes every project.`,
              )}
            </p>
            <div className="psp-about-points">
              <div>
                <strong>{tr(language, 'Écoute', 'Listening')}</strong>
                <span>{tr(language, 'Un besoin compris avant de choisir une solution.', 'Your need understood before choosing a solution.')}</span>
              </div>
              <div>
                <strong>{tr(language, 'Qualité', 'Quality')}</strong>
                <span>{tr(language, 'Un résultat soigné, clair et facile à utiliser.', 'A polished, clear and easy-to-use result.')}</span>
              </div>
              <div>
                <strong>{tr(language, 'Suivi', 'Follow-up')}</strong>
                <span>{tr(language, 'Un accompagnement après la mise en ligne.', 'Support after launch.')}</span>
              </div>
            </div>
          </section>
          <section id="psp-contact" className="psp-home-section psp-home-contact">
            <small>{tr(language, 'ÉCHANGEONS', 'GET IN TOUCH')}</small>
            <h2>{tr(language, 'Un projet en tête ?', 'Have a project in mind?')}</h2>
            <p>
              {tr(
                language,
                'Décrivez votre idée et nous reviendrons vers vous.',
                'Tell us what you have in mind.',
              )}
            </p>
            {simpleForm('contact')}
          </section>
        </>
      )
    if (currentPage === 'portfolio')
      return (
        <section className="psp-page">
          {intro(
            pageName(currentPage, language),
            tr(
              language,
              'Explorez les réalisations et ouvrez une fiche.',
              'Explore projects and open a detail page.',
            ),
          )}
          <div className="psp-gallery">
            {content.items.map((item, index) => (
              <button type="button" key={item} onClick={() => setDetail(index)}>
                {media(index)}
                <strong>{item}</strong>
                <span>{tr(language, 'Voir la réalisation', 'View project')} →</span>
              </button>
            ))}
          </div>
          {detail !== null && (
            <div className="psp-inline-detail">
              <button
                type="button"
                aria-label={tr(language, 'Fermer', 'Close')}
                onClick={() => setDetail(null)}
              >
                <X size={18} />
              </button>
              <div className="psp-gallery-open-image">{media(detail)}</div>
              <h3>{content.items[detail]}</h3>
              <p>
                {tr(
                  language,
                  'Une réalisation expliquée avec son contexte, ses choix et son résultat.',
                  'A project with its context, decisions and outcome.',
                )}
              </p>
            </div>
          )}
        </section>
      )
    if (currentPage === 'menu')
      return (
        <section className="psp-page">
          {intro(
            pageName(currentPage, language),
            tr(language, 'Découvrez notre carte avant votre visite.', 'Explore our menu before your visit.'),
          )}
          <div className="psp-category-list">
            {[tr(language, 'À la carte', 'À la carte'), tr(language, 'Formules', 'Set menus')].map(
              (item, index) => (
                <button
                  type="button"
                  key={item}
                  aria-pressed={category === index}
                  onClick={() => setCategory(index)}
                >
                  {item}
                </button>
              ),
            )}
          </div>
          <div className="psp-menu-list">
            {(category === 0
              ? content.items
              : [
                  tr(language, 'Menu découverte', 'Discovery menu'),
                  tr(language, 'Formule du moment', 'Seasonal set menu'),
                ]
            ).map((item, index) => (
              <article key={item}>
                <span>{media(index)}</span>
                <div>
                  <h3>{item}</h3>
                  <p>
                    {tr(
                      language,
                      'Une proposition préparée avec attention.',
                      'Thoughtfully prepared for you.',
                    )}
                  </p>
                </div>
                <strong>{18 + index * 7} €</strong>
              </article>
            ))}
          </div>
        </section>
      )
    if (currentPage === 'eventSignup')
      return (
        <section className="psp-page">
          {intro(
            pageName(currentPage, language),
            tr(
              language,
              'Choisissez un événement et essayez une inscription fictive.',
              'Choose an event and try a sample registration.',
            ),
          )}
          <div className="psp-event-list">
            {[
              {
                title: tr(language, 'Atelier découverte', 'Discovery workshop'),
                date: tr(language, 'Samedi prochain', 'Next Saturday'),
              },
              ...events,
            ].map((item, index) => (
              <article key={`${item.title}-${index}`}>
                <CalendarDays size={23} />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.date}</span>
                </div>
                <button
                  type="button"
                  className="psp-secondary"
                  onClick={() =>
                    setConfirmation(
                      tr(
                        language,
                        `Inscription fictive confirmée pour ${item.title}.`,
                        `Sample registration confirmed for ${item.title}.`,
                      ),
                    )
                  }
                >
                  {tr(language, 'S’inscrire fictivement', 'Try registration')}
                </button>
              </article>
            ))}
          </div>
          {confirmation && (
            <p className="psp-success" role="status">
              <Check size={18} />
              {confirmation}
            </p>
          )}
        </section>
      )
    if (['catalog', 'productDetails'].includes(currentPage))
      return (
        <section className="psp-page">
          {intro(
            pageName(currentPage, language),
            tr(
              language,
              'Un catalogue consultable sans achat en ligne.',
              'A catalogue you can browse without buying online.',
            ),
          )}
          <div className="psp-category-list">
            {[
              tr(language, 'Tout voir', 'All'),
              tr(language, 'Sélection', 'Selected'),
              tr(language, 'Sur mesure', 'Custom'),
            ].map((label, index) => (
              <button
                key={label}
                type="button"
                aria-pressed={category === index}
                onClick={() => {
                  setCategory(index)
                  setDetail(null)
                }}
              >
                {label}
              </button>
            ))}
          </div>
          {productCards()}
          {productDetail}
        </section>
      )
    if (currentPage === 'cart')
      return (
        <section className="psp-page">
          {intro(
            pageName(currentPage, language),
            tr(
              language,
              'Ajoutez des produits puis modifiez votre panier fictif.',
              'Add products, then change your sample basket.',
            ),
          )}
          <div className="psp-cart-products">
            {content.items.map((item, index) => (
              <article key={item}>
                {media(index)}
                <div>
                  <h3>{item}</h3>
                  <strong>{45 + index * 30} €</strong>
                </div>
                <button type="button" className="psp-secondary" onClick={() => addToCart(index)}>
                  {tr(language, 'Ajouter', 'Add')}
                </button>
              </article>
            ))}
          </div>
          <div className="psp-cart-page">
            <h3>{tr(language, 'Votre panier', 'Your basket')}</h3>
            {cartCount === 0 ? (
              <p>{tr(language, 'Votre panier fictif est vide.', 'Your sample basket is empty.')}</p>
            ) : (
              <>
                {Object.entries(cart).map(([key, count]) => {
                  const index = Number(key)
                  return (
                    <div className="psp-cart-line" key={key}>
                      <strong>{content.items[index]}</strong>
                      <span>{45 + index * 30} €</span>
                      <div className="psp-cart-controls">
                        <button
                          type="button"
                          aria-label={`${tr(language, 'Réduire', 'Decrease')} ${content.items[index]}`}
                          onClick={() => changeCart(index, count - 1)}
                        >
                          −
                        </button>
                        <span>{count}</span>
                        <button
                          type="button"
                          aria-label={`${tr(language, 'Augmenter', 'Increase')} ${content.items[index]}`}
                          onClick={() => changeCart(index, count + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button type="button" className="psp-secondary" onClick={() => changeCart(index, 0)}>
                        {tr(language, 'Retirer', 'Remove')}
                      </button>
                    </div>
                  )
                })}
                <p className="psp-cart-total">
                  <strong>{tr(language, 'Total fictif', 'Sample total')}</strong>
                  <strong>{cartTotal} €</strong>
                </p>
              </>
            )}
          </div>
        </section>
      )
    if (currentPage === 'booking' || currentPage === 'appointments')
      return (
        <section className="psp-page psp-booking">
          {intro(
            pageName(currentPage, language),
            tr(language, 'Essayez un choix de date et d’horaire.', 'Try choosing a date and time.'),
          )}
          {bookingView()}
        </section>
      )
    if (['enquiries', 'quote', 'fileUpload'].includes(currentPage))
      return (
        <section className="psp-page psp-form-page">
          {intro(
            pageName(currentPage, language),
            tr(
              language,
              'Remplissez le formulaire pour voir une confirmation locale.',
              'Fill in the form to see a local confirmation.',
            ),
          )}
          {simpleForm(currentPage)}
        </section>
      )
    if (currentPage === 'articles')
      return (
        <section className="psp-page">
          {intro(
            pageName(currentPage, language),
            tr(language, 'Nouveautés et conseils à parcourir.', 'News and advice to explore.'),
          )}
          <div className="psp-gallery">
            {content.items.map((item, index) => (
              <button key={item} type="button" onClick={() => setDetail(index)}>
                {media(index)}
                <strong>{item}</strong>
                <span>{tr(language, 'Lire', 'Read')} →</span>
              </button>
            ))}
          </div>
          {detail !== null && (
            <div className="psp-inline-detail">
              <button
                type="button"
                aria-label={tr(language, 'Fermer', 'Close')}
                onClick={() => setDetail(null)}
              >
                <X size={18} />
              </button>
              <h3>{content.items[detail]}</h3>
              <p>
                {tr(
                  language,
                  'Un article fictif pour montrer la lecture complète.',
                  'A sample article showing the full reading view.',
                )}
              </p>
            </div>
          )}
        </section>
      )
    if (currentPage === 'faq')
      return (
        <section className="psp-page">
          {intro(
            'FAQ',
            tr(
              language,
              'Des réponses visibles avant la prise de contact.',
              'Answers available before contacting you.',
            ),
          )}
          {[
            tr(language, 'Comment se déroule un projet ?', 'How does a project work?'),
            tr(language, 'Quels sont les délais ?', 'What are the timelines?'),
          ].map((question) => (
            <details className="psp-faq" key={question}>
              <summary>{question}</summary>
              <p>
                {tr(
                  language,
                  'Nous échangeons d’abord sur vos besoins, puis définissons les étapes ensemble.',
                  'We discuss your needs first, then agree on the next steps.',
                )}
              </p>
            </details>
          ))}
        </section>
      )
    if (currentPage === 'newsletter')
      return (
        <section className="psp-page psp-form-page">
          {intro(
            pageName(currentPage, language),
            tr(language, 'Recevez les prochaines nouvelles.', 'Receive the next updates.'),
          )}
          {confirmation ? (
            <p className="psp-success">{confirmation}</p>
          ) : (
            <form
              className="psp-demo-form"
              onSubmit={(event) =>
                localSubmit(event, tr(language, 'Inscription fictive confirmée.', 'Sample signup confirmed.'))
              }
            >
              <label>
                Email
                <input required type="email" />
              </label>
              <button className="psp-primary" type="submit">
                {tr(language, 'S’inscrire fictivement', 'Try signing up')}
              </button>
            </form>
          )}
        </section>
      )
    if (currentPage === 'payment')
      return (
        <section className="psp-page">
          {intro(
            pageName(currentPage, language),
            tr(
              language,
              'Parcours de paiement illustratif, sans transaction.',
              'Illustrative checkout with no transaction.',
            ),
          )}
          <div className="psp-explainer">
            <p>{content.items[0]} · 45 €</p>
            <button
              className="psp-primary"
              type="button"
              onClick={() =>
                setConfirmation(
                  tr(language, 'Paiement fictif confirmé localement.', 'Sample payment confirmed locally.'),
                )
              }
            >
              {tr(language, 'Simuler le règlement', 'Simulate payment')}
            </button>
            {confirmation && <p className="psp-success">{confirmation}</p>}
          </div>
        </section>
      )
    const module = modules.find((item) => item.id === currentPage)
    return (
      <section className="psp-page">
        {intro(module?.title || pageName(currentPage, language), module?.description || '')}
        <div className="psp-explainer">
          <h3>{module?.title}</h3>
          <p>
            {currentPage === 'about'
              ? tr(
                  language,
                  `${content.name} présente son histoire, sa méthode et ses valeurs.`,
                  `${content.name} shares its story, approach and values.`,
                )
              : module?.description}
          </p>
          {currentPage === 'staffProfiles' ? (
            <div className="psp-mini-list">
              {[tr(language, 'Fondatrice', 'Founder'), tr(language, 'Spécialiste', 'Specialist')].map(
                (role) => (
                  <p key={role}>
                    {role} · {content.name}
                  </p>
                ),
              )}
            </div>
          ) : currentPage === 'testimonials' ? (
            <blockquote>
              {tr(
                language,
                '« Une collaboration attentive et un résultat qui nous ressemble. »',
                '“A thoughtful collaboration and a result that feels like us.”',
              )}
            </blockquote>
          ) : currentPage === 'services' ? (
            productCards()
          ) : currentPage === 'location' ? (
            <p>
              {tr(
                language,
                'Adresse, horaires et zone d’intervention seront affichés ici.',
                'Address, hours and service area will appear here.',
              )}
            </p>
          ) : (
            <div className="psp-mini-list">
              {content.items.slice(0, 2).map((item) => (
                <p key={item}>
                  {item} · {tr(language, 'étape illustrative', 'sample step')}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>
    )
  }
  const clientContent = () => (
    <section className="psp-page psp-workspace">
      {intro(
        pageName(currentPage, language),
        tr(language, 'Un espace privé fictif à explorer.', 'Explore a sample private area.'),
      )}
      <div className="psp-workspace-nav">
        {contextModules.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-current={currentPage === item.id ? 'page' : undefined}
            onClick={() => navigate(item.id)}
          >
            {pageName(item.id, language)}
          </button>
        ))}
      </div>
      {currentPage === 'clientArea' && (
        <div className="psp-dashboard">
          <div>
            <small>{tr(language, 'DOSSIER EN COURS', 'OPEN CASE')}</small>
            <strong>{content.items[0]}</strong>
            <span>{tr(language, 'Étape actuelle : préparation', 'Current stage: preparation')}</span>
          </div>
          <div>
            <small>{tr(language, 'PROCHAINE ACTION', 'NEXT ACTION')}</small>
            <strong>{tr(language, 'Consulter les documents', 'Review documents')}</strong>
            <span>{tr(language, 'Vue personnelle de démonstration', 'Sample personal view')}</span>
          </div>
        </div>
      )}
      {currentPage === 'documents' && (
        <div className="psp-list">
          {['Présentation.pdf', 'Devis.pdf', 'Compte rendu.pdf'].map((file, index) => (
            <button key={file} type="button" onClick={() => setDetail(index)}>
              <FileText size={20} />
              {file}
              <small>{tr(language, 'Ouvrir', 'Open')}</small>
            </button>
          ))}
          {detail !== null && (
            <div className="psp-document">
              <h3>{['Présentation.pdf', 'Devis.pdf', 'Compte rendu.pdf'][detail]}</h3>
              <p>{tr(language, 'Aperçu du document fictif.', 'Sample document preview.')}</p>
            </div>
          )}
        </div>
      )}
      {currentPage === 'messages' && (
        <div className="psp-conversation">
          <p>
            <strong>{content.name}</strong>
            <span>
              {tr(language, 'Bonjour, votre dossier est bien reçu.', 'Hello, we have received your case.')}
            </span>
          </p>
          {messages.map((message, index) => (
            <p key={index} className="mine">
              <strong>{tr(language, 'Vous', 'You')}</strong>
              <span>{message}</span>
            </p>
          ))}
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const form = event.currentTarget
              const input = form.elements.namedItem('sample-message') as HTMLInputElement
              const value = input.value.trim()
              if (value) {
                setMessages((previous) => [...previous, value])
                input.value = ''
              }
            }}
          >
            <label>
              {tr(language, 'Votre réponse fictive', 'Your sample reply')}
              <input name="sample-message" required />
            </label>
            <button type="submit" className="psp-primary">
              {tr(language, 'Ajouter le message', 'Add message')}
            </button>
          </form>
        </div>
      )}
      {currentPage === 'tracking' && (
        <div className="psp-tracking">
          <h3>{content.items[0]}</h3>
          {[
            tr(language, 'Demande reçue', 'Request received'),
            tr(language, 'En préparation', 'In progress'),
            tr(language, 'Terminé', 'Completed'),
          ].map((label, index) => (
            <button
              type="button"
              key={label}
              aria-pressed={caseStep === index}
              onClick={() => setCaseStep(index)}
            >
              <span>{index <= caseStep ? <Check size={14} /> : index + 1}</span>
              {label}
            </button>
          ))}
        </div>
      )}
      {currentPage === 'history' && (
        <div className="psp-list">
          {[
            tr(language, 'Demande du mois dernier', 'Last month’s request'),
            tr(language, 'Rendez-vous précédent', 'Previous appointment'),
          ].map((item) => (
            <button type="button" key={item} onClick={() => setConfirmation(item)}>
              {item}
              <ChevronRight size={16} />
            </button>
          ))}
          {confirmation && <p className="psp-success">{confirmation}</p>}
        </div>
      )}
      {currentPage === 'notifications' && (
        <div className="psp-list">
          <button
            type="button"
            onClick={() => setConfirmation(tr(language, 'Notification consultée.', 'Notification viewed.'))}
          >
            {tr(language, 'Nouveau document disponible', 'New document available')}
            <ChevronRight size={16} />
          </button>
          {confirmation && <p className="psp-success">{confirmation}</p>}
        </div>
      )}
      {currentPage === 'orderTracking' && (
        <div className="psp-tracking">
          {[
            tr(language, 'Commande reçue', 'Order received'),
            tr(language, 'En préparation', 'Being prepared'),
            tr(language, 'Prête', 'Ready'),
          ].map((item, index) => (
            <button
              type="button"
              key={item}
              aria-pressed={caseStep === index}
              onClick={() => setCaseStep(index)}
            >
              <span>{index + 1}</span>
              {item}
            </button>
          ))}
        </div>
      )}
    </section>
  )
  const managementContent = () => (
    <section className="psp-page psp-workspace">
      {intro(
        currentPage === 'dashboard'
          ? tr(language, 'Votre outil métier', 'Your business tool')
          : pageName(currentPage, language),
        tr(
          language,
          'Une vue de gestion fictive adaptée aux modules sélectionnés.',
          'A sample management view for your selected features.',
        ),
      )}
      <div className="psp-workspace-nav">
        {contextModules.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-current={currentPage === item.id ? 'page' : undefined}
            onClick={() => navigate(item.id)}
          >
            {pageName(item.id, language)}
          </button>
        ))}
      </div>
      {(currentPage === 'dashboard' || currentPage === 'team') && (
        <div className="psp-management-grid">
          {[
            tr(language, 'Clients', 'Clients'),
            tr(language, 'Dossiers', 'Cases'),
            tr(language, 'Tâches', 'Tasks'),
            tr(language, 'Planning', 'Schedule'),
          ].map((item, index) => (
            <button type="button" key={item} onClick={() => setDetail(index)}>
              <small>0{index + 1}</small>
              <strong>{item}</strong>
              <span>{tr(language, 'Ouvrir le détail', 'Open details')}</span>
            </button>
          ))}
          {detail !== null && (
            <div className="psp-inline-detail">
              <h3>
                {
                  [
                    tr(language, 'Clients', 'Clients'),
                    tr(language, 'Dossiers', 'Cases'),
                    tr(language, 'Tâches', 'Tasks'),
                    tr(language, 'Planning', 'Schedule'),
                  ][detail]
                }
              </h3>
              <p>
                {tr(
                  language,
                  'Un aperçu local de cette partie de votre activité.',
                  'A local sample of this part of your business.',
                )}
              </p>
            </div>
          )}
        </div>
      )}
      {currentPage === 'planning' && (
        <div className="psp-week">
          {[
            tr(language, 'Lundi', 'Monday'),
            tr(language, 'Mardi', 'Tuesday'),
            tr(language, 'Mercredi', 'Wednesday'),
            tr(language, 'Jeudi', 'Thursday'),
            tr(language, 'Vendredi', 'Friday'),
          ].map((day, index) => (
            <button type="button" key={day} aria-pressed={detail === index} onClick={() => setDetail(index)}>
              <strong>{day}</strong>
              <span>
                {index % 2
                  ? tr(language, '14:00 · Rendez-vous', '14:00 · Appointment')
                  : tr(language, '10:00 · Projet client', '10:00 · Client project')}
              </span>
            </button>
          ))}
        </div>
      )}
      {currentPage === 'customerManagement' && (
        <div className="psp-customers">
          <div className="psp-mini-list">
            {[
              tr(language, 'Camille Martin', 'Camille Martin'),
              tr(language, 'Alex Bernard', 'Alex Bernard'),
              tr(language, 'Samira Laurent', 'Samira Laurent'),
            ].map((person, index) => (
              <button
                type="button"
                key={person}
                aria-pressed={clientDetail === index}
                onClick={() => setClientDetail(index)}
              >
                <Users size={17} />
                {person}
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
          {clientDetail !== null && (
            <article className="psp-customer-detail">
              <small>{tr(language, 'FICHE CLIENT FICTIVE', 'SAMPLE CUSTOMER RECORD')}</small>
              <h3>
                {
                  [
                    tr(language, 'Camille Martin', 'Camille Martin'),
                    tr(language, 'Alex Bernard', 'Alex Bernard'),
                    tr(language, 'Samira Laurent', 'Samira Laurent'),
                  ][clientDetail]
                }
              </h3>
              <p>
                {tr(
                  language,
                  'Demande en cours : accompagnement personnalisé',
                  'Current enquiry: tailored support',
                )}
              </p>
              <span>{tr(language, 'Dernier échange : il y a 3 jours', 'Last contact: 3 days ago')}</span>
            </article>
          )}
        </div>
      )}
      {currentPage === 'events' && (
        <div className="psp-events">
          <form
            className="psp-demo-form"
            onSubmit={(event) => {
              event.preventDefault()
              const form = new FormData(event.currentTarget)
              const title = String(form.get('eventTitle') || '').trim()
              const date = String(form.get('eventDate') || '')
              if (title && date) {
                setEvents((previous) => [...previous, { title, date }])
                event.currentTarget.reset()
                setConfirmation(tr(language, 'Événement fictif ajouté.', 'Sample event added.'))
              }
            }}
          >
            <h3>{tr(language, 'Ajouter un événement fictif', 'Add a sample event')}</h3>
            <label>
              {tr(language, 'Nom de l’événement', 'Event name')}
              <input
                name="eventTitle"
                required
                maxLength={80}
                placeholder={tr(language, 'Atelier découverte', 'Discovery workshop')}
              />
            </label>
            <label>
              {tr(language, 'Date', 'Date')}
              <input name="eventDate" type="date" required />
            </label>
            <button type="submit" className="psp-primary">
              {tr(language, 'Ajouter l’événement', 'Add event')}
            </button>
          </form>
          <div className="psp-event-list">
            <h3>{tr(language, 'Événements', 'Events')}</h3>
            {[
              {
                title: tr(language, 'Atelier découverte', 'Discovery workshop'),
                date: tr(language, 'Samedi prochain', 'Next Saturday'),
              },
              ...events,
            ].map((item, index) => (
              <article key={`${item.title}-${index}`}>
                <CalendarDays size={22} />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.date}</span>
                </div>
              </article>
            ))}
          </div>
          {confirmation && (
            <p className="psp-success" role="status">
              {confirmation}
            </p>
          )}
        </div>
      )}
      {currentPage === 'stock' && (
        <div className="psp-stock">
          <h3>{tr(language, 'Articles disponibles', 'Available items')}</h3>
          {content.items.map((item, index) => (
            <div key={item}>
              <strong>{item}</strong>
              <span>
                {stock[index] ?? 0} {tr(language, 'en stock', 'in stock')}
              </span>
              <button
                type="button"
                aria-label={`${tr(language, 'Retirer une unité de', 'Remove one unit of')} ${item}`}
                onClick={() =>
                  setStock((previous) => ({ ...previous, [index]: Math.max(0, (previous[index] ?? 0) - 1) }))
                }
              >
                −
              </button>
              <button
                type="button"
                aria-label={`${tr(language, 'Ajouter une unité à', 'Add one unit to')} ${item}`}
                onClick={() => setStock((previous) => ({ ...previous, [index]: (previous[index] ?? 0) + 1 }))}
              >
                +
              </button>
            </div>
          ))}
        </div>
      )}
      {currentPage === 'tasks' && (
        <div className="psp-list">
          <button type="button" aria-pressed={taskDone} onClick={() => setTaskDone(!taskDone)}>
            <Check size={18} />
            {tr(language, 'Préparer le dossier client', 'Prepare the client case')}
            <small>{taskDone ? tr(language, 'Terminée', 'Done') : tr(language, 'À faire', 'Open')}</small>
          </button>
        </div>
      )}
      {currentPage === 'automation' && (
        <div className="psp-flow">
          <div>
            <small>{tr(language, 'DÉCLENCHEUR', 'TRIGGER')}</small>
            <strong>{tr(language, 'Nouvelle demande reçue', 'New enquiry received')}</strong>
          </div>
          <ChevronRight />
          <div>
            <small>{tr(language, 'ÉTAPES', 'STEPS')}</small>
            <strong>
              {tr(language, 'Créer une tâche · prévenir l’équipe', 'Create task · notify team')}
            </strong>
          </div>
          <ChevronRight />
          <div>
            <small>{tr(language, 'RÉSULTAT', 'RESULT')}</small>
            <strong>{tr(language, 'Dossier prêt à traiter', 'Case ready for review')}</strong>
          </div>
          <button
            type="button"
            className="psp-primary"
            onClick={() =>
              setConfirmation(
                tr(language, 'Automatisation fictive exécutée localement.', 'Sample automation run locally.'),
              )
            }
          >
            {tr(language, 'Simuler le déclenchement', 'Run sample trigger')}
          </button>
          {confirmation && <p className="psp-success">{confirmation}</p>}
        </div>
      )}
      {currentPage === 'connection' && (
        <div className="psp-explainer">
          <h3>{tr(language, 'Faisabilité à vérifier', 'Feasibility to verify')}</h3>
          <p>
            {tr(
              language,
              'Les accès, données et possibilités des outils existants seront étudiés avant de confirmer une connexion.',
              'Access, data and capabilities of existing tools must be reviewed before confirming a connection.',
            )}
          </p>
          <div className="psp-process">
            <span>{tr(language, 'Outil source', 'Source tool')}</span>
            <ChevronRight />
            <span>{tr(language, 'Données à définir', 'Data to define')}</span>
            <ChevronRight />
            <span>{tr(language, 'Outil cible', 'Destination tool')}</span>
          </div>
        </div>
      )}
      {currentPage === 'metrics' && (
        <div className="psp-explainer">
          <h3>{tr(language, 'Activité du mois', 'This month’s activity')}</h3>
          <div className="psp-chart" aria-label={tr(language, 'Graphique illustratif', 'Sample chart')}>
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      )}
      {(managementPageIds as readonly string[]).includes(currentPage) && (
        <ManagementPage
          id={currentPage}
          language={language}
          description={modules.find((item) => item.id === currentPage)?.description}
        />
      )}
      {![
        'dashboard',
        'team',
        'planning',
        'tasks',
        'automation',
        'connection',
        'metrics',
        'customerManagement',
        'events',
        'stock',
        'caseManagement',
        'quotesDocuments',
        'roles',
        'statuses',
        'editTexts',
        'editImages',
        'manageOffers',
        'publishNews',
        'multilingual',
        'administrators',
      ].includes(currentPage) && (
        <div className="psp-explainer">
          <p>
            {modules.find((item) => item.id === currentPage)?.description ||
              tr(
                language,
                'Un diagnostic et des étapes de suivi seront définis ensemble.',
                'A review and follow-up steps will be defined together.',
              )}
          </p>
          <div className="psp-process">
            {[
              tr(language, 'Examiner', 'Review'),
              tr(language, 'Intervenir', 'Act'),
              tr(language, 'Vérifier', 'Verify'),
            ].map((item, index) => (
              <button
                type="button"
                key={item}
                aria-pressed={detail === index}
                onClick={() => setDetail(index)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
  return (
    <section
      className={`psp-shell ${expanded ? 'is-expanded' : ''}`}
      aria-label={tr(language, 'Aperçu interactif du projet', 'Interactive project preview')}
    >
      <div className="psp-browser">
        <div className="psp-toolbar">
          <div className="psp-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="psp-browser-actions">
            <button
              type="button"
              aria-label={tr(language, 'Page précédente', 'Previous page')}
              disabled={historyIndex === 0}
              onClick={() => moveHistory(-1)}
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              aria-label={tr(language, 'Page suivante', 'Next page')}
              disabled={historyIndex >= history.length - 1}
              onClick={() => moveHistory(1)}
            >
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              aria-label={tr(language, 'Réinitialiser la démonstration', 'Reset demo')}
              onClick={resetDemo}
            >
              <RefreshCw size={15} />
            </button>
          </div>
          <div className="psp-address">
            ⌁ &nbsp;{fakeDomain}/{currentPage}
          </div>
          <div
            className="psp-device"
            role="group"
            aria-label={tr(language, 'Format de l’aperçu', 'Preview device')}
          >
            <button type="button" aria-pressed={device === 'desktop'} aria-label={tr(language, 'Bureau', 'Desktop')} onClick={() => setDevice('desktop')}>
              <Monitor size={15} />
              <span>{tr(language, 'Bureau', 'Desktop')}</span>
            </button>
            <button type="button" aria-pressed={device === 'mobile'} aria-label="Mobile" onClick={() => setDevice('mobile')}>
              <Smartphone size={15} />
              <span>Mobile</span>
            </button>
          </div>
          <button
            type="button"
            className="psp-expand"
            onClick={() => setExpanded(!expanded)}
            aria-label={
              expanded
                ? tr(language, 'Fermer l’agrandissement', 'Close enlarged preview')
                : tr(language, 'Agrandir l’aperçu', 'Enlarge preview')
            }
          >
            {expanded ? <X size={16} /> : <Expand size={16} />}
            <span>{expanded ? tr(language, 'Fermer', 'Close') : tr(language, 'Agrandir', 'Enlarge')}</span>
          </button>
        </div>
        <div
          className="psp-contexts"
          role="group"
          aria-label={tr(language, 'Vue de l’aperçu', 'Preview context')}
        >
          {contexts.map((context) => (
            <button
              type="button"
              key={context}
              data-new={modules.some((item) => item.context === context && newIds?.includes(item.id)) || undefined}
              aria-pressed={currentContext === context}
              onClick={() => switchContext(context)}
            >
              {contextName(context, language)}
            </button>
          ))}
        </div>
        <p className="psp-permanent-note">{demoNote}</p>
        <div className={`psp-canvas device-${device}`}>
          <div className="psp-site" id="psp-site">
            <header className={`psp-site-header ${contextModules.length > 4 ? 'compact' : ''}`}>
              <button type="button" className="psp-brand" onClick={() => navigate(base)}>
                {content.name}
              </button>
              <nav
                className={menuOpen ? 'open' : ''}
                aria-label={tr(language, 'Navigation de la démonstration', 'Demo navigation')}
              >
                <button
                  type="button"
                  data-page={base}
                  aria-current={currentPage === base ? 'page' : undefined}
                  onClick={() => navigate(base)}
                >
                  {pageName(base, language)}
                </button>
                {currentContext === 'public' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        navigate('home')
                        setTimeout(
                          () =>
                            document.getElementById('psp-services')?.scrollIntoView({
                              behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                                ? 'auto'
                                : 'smooth',
                            }),
                          0,
                        )
                      }}
                    >
                      {tr(language, 'Services', 'Services')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigate('home')
                        setTimeout(
                          () =>
                            document.getElementById('psp-about')?.scrollIntoView({
                              behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                                ? 'auto'
                                : 'smooth',
                            }),
                          0,
                        )
                      }}
                    >
                      {tr(language, 'À propos', 'About')}
                    </button>
{!contextModules.some((item) => item.id === 'enquiries') && (
                    <button
                      type="button"
                      onClick={() => {
                        navigate('home')
                        setTimeout(
                          () =>
                            document.getElementById('psp-contact')?.scrollIntoView({
                              behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                                ? 'auto'
                                : 'smooth',
                            }),
                          0,
                        )
                      }}
                    >
                      {tr(language, 'Contact', 'Contact')}
                    </button>
)}
                  </>
                )}
                {contextModules.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    data-page={item.id}
                    data-new={newIds?.includes(item.id) || undefined}
                    aria-current={currentPage === item.id ? 'page' : undefined}
                    onClick={() => navigate(item.id)}
                  >
                    {pageName(item.id, language)}
                  </button>
                ))}
              </nav>
              <div className="psp-header-side">
                {enabled.has('cart') && currentContext === 'public' && (
                  <button
                    type="button"
                    aria-label={tr(language, `Panier : ${cartCount} articles`, `Basket: ${cartCount} items`)}
                    onClick={() => navigate('cart')}
                  >
                    <ShoppingBag size={19} />
                    {cartCount > 0 && <span>{cartCount}</span>}
                  </button>
                )}
                <button
                  type="button"
                  className="psp-menu-toggle"
                  aria-expanded={menuOpen}
                  aria-label={
                    menuOpen
                      ? tr(language, 'Fermer le menu', 'Close menu')
                      : tr(language, 'Ouvrir le menu', 'Open menu')
                  }
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {menuOpen ? <X size={21} /> : <Menu size={21} />}
                </button>
              </div>
            </header>
            {notice && (
              <div className="psp-notice" role="status">
                <Check size={17} />
                {notice}
              </div>
            )}
            <div className={highlight === currentPage ? 'psp-highlight' : ''}>
              {currentContext === 'public'
                ? publicContent()
                : currentContext === 'client'
                  ? clientContent()
                  : managementContent()}
            </div>
            <footer className="psp-site-footer">
              <strong>{content.name}</strong>
              <span>{tr(language, 'Exemple de démonstration', 'Sample demonstration')}</span>
            </footer>
          </div>
        </div>
      </div>
    </section>
  )
}
