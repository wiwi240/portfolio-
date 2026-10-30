import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  FileText,
  Globe2,
  Images,
  LayoutDashboard,
  MessageCircle,
  Package,
  RotateCcw,
  Send,
  ShoppingBag,
  Sparkles,
  UserRound,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react'
import type { Language } from '@/data/portfolio-content'
import { paths } from '@/site'
import {
  changePath,
  compactCategories,
  improvementOptions,
  initialDraft,
  needs,
  needsClientAreaReview,
  pathChoiceDetails,
  pathOptions,
  removalConsequences,
  selectedChoiceIds,
  setChoice,
  suggestedNeedIds,
  supportOptions,
  toProjectPayload,
  type ChoiceState,
  type Need,
  type PathId,
  type ProjectDraft,
} from '@/data/project-configurator'
import { ProjectStylePreview } from './project-style-preview'
import './project-configurator.css'

const tr = (language: Language, fr: string, en: string) => (language === 'fr' ? fr : en)
const steps = {
  fr: ['Construisez votre projet', 'Parlons de votre projet'],
  en: ['Build your project', 'Let’s talk about your project'],
}
const materialOptions = [
  ['texts', 'Textes', 'Text'],
  ['photos', 'Photos', 'Photos'],
  ['logo', 'Logo', 'Logo'],
  ['documents', 'Documents', 'Documents'],
  ['none', 'Rien pour le moment', 'Nothing yet'],
  ['unsure', 'Je ne sais pas', 'I’m not sure'],
] as const
const iconByNeed: Record<string, LucideIcon> = {
  presentActivity: Globe2,
  portfolio: Images,
  staffProfiles: Users,
  testimonials: MessageCircle,
  enquiries: MessageCircle,
  appointments: CalendarDays,
  quote: ClipboardList,
  events: CalendarDays,
  eventSignup: UserRound,
  catalog: Package,
  cart: ShoppingBag,
  payment: ShoppingBag,
  orderTracking: Package,
  customerManagement: Users,
  planning: CalendarDays,
  stock: Package,
  team: LayoutDashboard,
  clientArea: UserRound,
  documents: FileText,
  messages: MessageCircle,
  notifications: Sparkles,
  menu: ClipboardList,
  services: ClipboardList,
  booking: CalendarDays,
}
const groupIcons: Record<string, LucideIcon> = {
  present: Globe2,
  requests: MessageCircle,
  sell: ShoppingBag,
  organize: LayoutDashboard,
  clients: UserRound,
  content: FileText,
}
const shortNames: Record<string, [string, string]> = {
  presentActivity: ['Pages de présentation', 'Presentation pages'],
  portfolio: ['Galerie photos', 'Photo gallery'],
  staffProfiles: ['Présentation de l’équipe', 'Team profiles'],
  testimonials: ['Avis clients', 'Client reviews'],
  enquiries: ['Formulaire de contact', 'Contact form'],
  appointments: ['Calendrier de réservation', 'Booking calendar'],
  quote: ['Demande de devis', 'Quote request'],
  events: ['Créer des événements', 'Create events'],
  eventSignup: ['Inscription aux événements', 'Event registration'],
  catalog: ['Catalogue de produits', 'Product catalogue'],
  orderTracking: ['Suivi des commandes', 'Order tracking'],
  customerManagement: ['Fiches clients', 'Customer records'],
  planning: ['Planning', 'Schedule'],
  stock: ['Gestion des stocks', 'Stock management'],
  team: ['Tableau de suivi', 'Dashboard'],
  clientArea: ['Compte client', 'Client account'],
  documents: ['Documents privés', 'Private documents'],
  messages: ['Messagerie', 'Messages'],
  notifications: ['Notifications', 'Notifications'],
}
const pathIcons: Record<PathId, LucideIcon> = {
  create: Globe2,
  tool: LayoutDashboard,
  improve: Sparkles,
  support: Wrench,
  unsure: CircleHelp,
}
const labelFor = (need: Need, language: Language) =>
  shortNames[need.id]?.[language === 'fr' ? 0 : 1] || need.title[language]

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  multiline = false,
  required = false,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  multiline?: boolean
  required?: boolean
}) {
  const common = {
    id,
    value,
    placeholder,
    required,
    maxLength: ['activity', 'projectName', 'budget'].includes(id) ? 160 : 2000,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${id}-error` : undefined,
  }
  return (
    <div className="pc-field">
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {multiline ? (
        <textarea {...common} rows={3} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input
          {...common}
          type={id === 'email' ? 'email' : 'text'}
          autoComplete={id === 'name' ? 'name' : id === 'email' ? 'email' : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {error && (
        <small id={`${id}-error`} className="pc-error">
          {error}
        </small>
      )}
    </div>
  )
}

function NeedTile({
  need,
  draft,
  language,
  onChoice,
  onPreview,
}: {
  need: Need
  draft: ProjectDraft
  language: Language
  onChoice: (id: string, state?: ChoiceState) => void
  onPreview: (id: string) => void
}) {
  const state = draft.choices[need.id]
  const Icon = iconByNeed[need.id] || groupIcons[need.group] || Sparkles
  return (
    <article className={`pc-feature ${state ? 'is-selected' : ''}`}>
      <div className="pc-feature-main">
        <span className="pc-feature-icon">
          <Icon size={19} aria-hidden="true" />
        </span>
        <div className="pc-feature-copy">
          <h4>{labelFor(need, language)}</h4>
          <p>{need.description[language]}</p>
        </div>
        <button
          type="button"
          className="pc-feature-check"
          aria-pressed={!!state}
          aria-label={`${state ? tr(language, 'Retirer', 'Remove') : tr(language, 'Ajouter', 'Add')} ${labelFor(need, language)}`}
          onClick={() => onChoice(need.id, state ? undefined : 'wanted')}
        >
          <Check size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="pc-feature-actions">
        <details>
          <summary>{tr(language, 'En savoir plus', 'Learn more')}</summary>
          <p>{need.example[language]}</p>
          <p>{need.materials[language]}</p>
          {['productDetails', 'cart', 'delivery', 'promotions', 'orderTracking'].includes(need.id) && (
            <p>
              {tr(
                language,
                'Le catalogue de produits sera aussi ajouté.',
                'The product catalogue will also be added.',
              )}
            </p>
          )}
          {need.id === 'connection' && (
            <p>{tr(language, 'Faisabilité à vérifier.', 'Feasibility to verify.')}</p>
          )}
          <button
            type="button"
            className="pc-discuss"
            aria-pressed={state === 'discuss'}
            onClick={() => onChoice(need.id, state === 'discuss' ? undefined : 'discuss')}
          >
            {tr(language, 'À définir ensemble', 'Discuss together')}
          </button>
        </details>
        <button type="button" className="pc-preview-link" onClick={() => onPreview(need.id)}>
          {tr(language, 'Voir l’aperçu', 'Open preview')} <ArrowRight size={13} aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}

function Summary({
  draft,
  language,
  onEdit,
}: {
  draft: ProjectDraft
  language: Language
  onEdit: (step: number) => void
}) {
  const selected = needs.filter((item) => draft.choices[item.id])
  const pathList =
    draft.path === 'improve' ? improvementOptions : draft.path === 'support' ? supportOptions : []
  const choiceNames = (state: ChoiceState) =>
    [
      ...selected.filter((item) => draft.choices[item.id] === state).map((item) => labelFor(item, language)),
      ...pathList
        .filter((item) => draft.choices[item[0]] === state)
        .map((item) => item[language === 'fr' ? 1 : 2]),
    ].join(', ')
  const materials = draft.materials
    .map((id) => materialOptions.find((row) => row[0] === id)?.[language === 'fr' ? 1 : 2] || id)
    .join(', ')
  const rows: Array<[string, string, number]> = [
    [
      tr(language, 'Projet', 'Project'),
      pathOptions.find((item) => item.id === draft.path)?.title[language] || '',
      0,
    ],
    [tr(language, 'Activité', 'Business'), draft.activity, 0],
    [
      tr(language, 'Nom', 'Name'),
      draft.namePending ? tr(language, 'À définir', 'To be decided') : draft.projectName,
      0,
    ],
    [tr(language, 'Éléments choisis', 'Selected features'), choiceNames('wanted'), 0],
    ...(choiceNames('discuss')
      ? [
          [tr(language, 'À définir ensemble', 'To discuss'), choiceNames('discuss'), 0] as [
            string,
            string,
            number,
          ],
        ]
      : []),
    ...(draft.aspiration
      ? [
          [tr(language, 'Idée particulière', 'Additional idea'), draft.aspiration, 0] as [
            string,
            string,
            number,
          ],
        ]
      : []),
    ...(draft.path === 'improve' || draft.path === 'support'
      ? [
          [tr(language, 'Projet existant', 'Existing project'), draft.existingDetails, 1] as [
            string,
            string,
            number,
          ],
        ]
      : []),
    ...(draft.importantDate
      ? [
          [tr(language, 'Délai souhaité', 'Preferred timeline'), draft.importantDate, 1] as [
            string,
            string,
            number,
          ],
        ]
      : []),
    ...(draft.budget
      ? [[tr(language, 'Budget indicatif', 'Indicative budget'), draft.budget, 1] as [string, string, number]]
      : []),
    ...(materials
      ? [
          [tr(language, 'Éléments disponibles', 'Available materials'), materials, 1] as [
            string,
            string,
            number,
          ],
        ]
      : []),
  ]
  return (
    <div className="pc-summary">
      <span className="pc-eyebrow">{tr(language, 'SYNTHÈSE', 'SUMMARY')}</span>
      <div className="pc-summary-rows">
        {rows.map(([title, value, step]) => (
          <div key={title}>
            <div>
              <strong>{title}</strong>
              <button
                type="button"
                onClick={() => onEdit(step)}
                aria-label={`${tr(language, 'Modifier', 'Edit')} : ${title}`}
              >
                {tr(language, 'Modifier', 'Edit')}
              </button>
            </div>
            <p>{value || tr(language, 'À définir ensemble', 'To discuss')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ConfirmBar({
  message,
  confirmLabel,
  language,
  onConfirm,
  onCancel,
}: {
  message: string
  confirmLabel?: string
  language: Language
  onConfirm: () => void
  onCancel: () => void
}) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const cancelHandler = useRef(onCancel)
  const messageId = useId()
  useEffect(() => {
    cancelHandler.current = onCancel
  })
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    cancelRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') cancelHandler.current()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (previous?.isConnected) previous.focus()
    }
  }, [])
  return (
    <div className="pc-confirm" role="alertdialog" aria-describedby={messageId}>
      <p id={messageId}>{message}</p>
      <div className="pc-confirm-actions">
        <button type="button" ref={cancelRef} className="button button-outline" onClick={onCancel}>
          {tr(language, 'Annuler', 'Cancel')}
        </button>
        <button type="button" className="button button-primary" onClick={onConfirm}>
          {confirmLabel ?? tr(language, 'Continuer', 'Continue')}
        </button>
      </div>
    </div>
  )
}

export function ProjectConfigurator({ language }: { language: Language }) {
  const query =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('parcours') : null
  const initialPath = pathOptions.find((option) => option.id === query)?.id || 'unsure'
  const [draft, setDraft] = useState<ProjectDraft>(() => initialDraft(initialPath))
  const [step, setStep] = useState(0)
  const [maxStep, setMaxStep] = useState(0)
  const [mobilePanel, setMobilePanel] = useState<'choices' | 'preview' | 'summary'>('choices')
  const [expandedCategory, setExpandedCategory] = useState(initialPath === 'tool' ? 'organize' : 'present')
  const [lastChanged, setLastChanged] = useState('')
  const [changeSequence, setChangeSequence] = useState(0)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitState, setSubmitState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [submitError, setSubmitError] = useState('')
  const [announce, setAnnounce] = useState('')
  const [pending, setPending] = useState<{ message: string; confirmLabel?: string; run: () => void } | null>(null)
  const busy = useRef(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const previewColumnRef = useRef<HTMLDivElement>(null)
  const summaryHandleRef = useRef<HTMLButtonElement>(null)
  const summaryCloseRef = useRef<HTMLButtonElement>(null)
  const formId = useId()
  const chosenNeeds = useMemo(() => selectedChoiceIds(draft), [draft])
  const suggestions = suggestedNeedIds(draft)
    .map((id) => needs.find((item) => item.id === id))
    .filter((item): item is Need => !!item)
  const categories =
    draft.path === 'tool'
      ? [
          compactCategories[3],
          compactCategories[4],
          compactCategories[1],
          compactCategories[0],
          compactCategories[2],
          compactCategories[5],
        ]
      : compactCategories
  const update = (patch: Partial<ProjectDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
    if (submitState === 'success') {
      setSubmitState('idle')
      setAnnounce(
        tr(
          language,
          'Vos modifications ne sont pas encore envoyées.',
          'Your changes have not been sent yet.',
        ),
      )
    }
  }
  const ask = (message: string, run: () => void, confirmLabel?: string) =>
    setPending({ message, run, confirmLabel })
  const applyPath = (path: PathId, hasSpecific: boolean) => {
    setDraft((current) => changePath(current, path, hasSpecific))
    setExpandedCategory(path === 'tool' ? 'organize' : 'present')
    setLastChanged('')
    setSubmitState('idle')
    setAnnounce(tr(language, 'Parcours modifié.', 'Path changed.'))
  }
  const choosePath = (path: PathId) => {
    if (path === draft.path) return
    const hasSpecific = Object.keys(draft.choices).length > 0 || Object.keys(draft.answers).length > 0
    if (hasSpecific) {
      ask(
        tr(
          language,
          'Changer de parcours retirera les choix propres au parcours actuel. Votre activité et vos coordonnées seront conservées.',
          'Changing path removes choices specific to the current path. Your business details and contact information will remain.',
        ),
        () => applyPath(path, true),
        tr(language, 'Changer de parcours', 'Change path'),
      )
      return
    }
    applyPath(path, false)
  }
  const onChoice = (id: string, state?: ChoiceState) => {
    const linked = !state ? removalConsequences(draft, id) : []
    const warnings: string[] = []
    if (linked.length) {
      warnings.push(
        tr(
          language,
          `Ce retrait supprimera aussi ${linked.map((item) => needs.find((need) => need.id === item)?.title.fr || item).join(', ')}.`,
          `This also removes ${linked.map((item) => needs.find((need) => need.id === item)?.title.en || item).join(', ')}.`,
        ),
      )
    }
    if (!state && id === 'clientArea' && needsClientAreaReview(draft)) {
      warnings.push(
        tr(
          language,
          'Retirer le compte client peut affecter l’accès aux documents privés et à la messagerie. Ces éléments restent sélectionnés.',
          'Removing the client account may affect access to private documents and messages. Those features stay selected.',
        ),
      )
    }
    const commit = () => {
      setDraft((previous) => setChoice(previous, id, state))
      setSubmitState((current) => (current === 'success' ? 'idle' : current))
      setLastChanged(state ? id : '')
      setChangeSequence((value) => value + 1)
      setAnnounce(
        state
          ? tr(language, 'Élément ajouté à votre projet.', 'Feature added to your project.')
          : tr(language, 'Élément retiré de votre projet.', 'Feature removed from your project.'),
      )
      if (state && window.matchMedia('(max-width: 760px)').matches) {
        setMobilePanel('preview')
        requestAnimationFrame(() =>
          previewColumnRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' }),
        )
      }
    }
    if (warnings.length) ask(warnings.join(' '), commit, tr(language, 'Retirer', 'Remove'))
    else commit()
  }
  const onPreview = (id: string) => {
    if (!draft.choices[id]) onChoice(id, 'wanted')
    else {
      setLastChanged(id)
      setChangeSequence((value) => value + 1)
    }
    if (window.matchMedia('(max-width: 760px)').matches) setMobilePanel('preview')
  }
  const go = (target: number) => {
    if (target > maxStep) return
    setStep(target)
    setErrors({})
    setMobilePanel('choices')
    requestAnimationFrame(() => headingRef.current?.focus())
  }
  const next = () => {
    if (draft.activity.trim().length < 2) {
      setErrors({
        activity: tr(
          language,
          'Indiquez votre activité, ou choisissez « À définir ensemble ».',
          'Enter your activity, or choose “To discuss together”.',
        ),
      })
      document.getElementById('activity')?.focus()
      return
    }
    setMaxStep(1)
    setStep(1)
    setErrors({})
    setMobilePanel('choices')
    requestAnimationFrame(() => headingRef.current?.focus())
  }
  const doReset = () => {
    setDraft(initialDraft(initialPath))
    setStep(0)
    setMaxStep(0)
    setExpandedCategory(initialPath === 'tool' ? 'organize' : 'present')
    setMobilePanel('choices')
    setSubmitState('idle')
    setAnnounce(tr(language, 'Réponses réinitialisées.', 'Answers reset.'))
  }
  const reset = () =>
    ask(
      tr(language, 'Réinitialiser toutes vos réponses ?', 'Reset all your answers?'),
      doReset,
      tr(language, 'Réinitialiser', 'Reset'),
    )
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy.current) return
    const nextErrors: Record<string, string> = {}
    if (draft.name.trim().length < 2)
      nextErrors.name = tr(language, 'Indiquez au moins deux caractères.', 'Enter at least two characters.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim()))
      nextErrors.email = tr(language, 'Indiquez une adresse email valide.', 'Enter a valid email address.')
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      document.getElementById(Object.keys(nextErrors)[0])?.focus()
      return
    }
    busy.current = true
    setSubmitState('sending')
    setSubmitError('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: draft.name,
          email: draft.email,
          message: draft.message,
          project: toProjectPayload(draft),
          company: draft.company,
          kind: 'project',
        }),
      })
      if (!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(
          result.message || tr(language, 'Envoi impossible. Réessayez.', 'Could not send. Please try again.'),
        )
      }
      setSubmitState('success')
      setAnnounce(tr(language, 'Votre demande a été reçue.', 'Your request was received.'))
    } catch (error) {
      setSubmitState('error')
      setSubmitError(
        error instanceof Error
          ? error.message
          : tr(language, 'Envoi impossible. Réessayez.', 'Could not send. Please try again.'),
      )
    } finally {
      busy.current = false
    }
  }
  useEffect(() => {
    if (!summaryOpen) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSummaryOpen(false)
        requestAnimationFrame(() => summaryHandleRef.current?.focus())
      } else if (event.key === 'Tab') {
        const dialog = summaryCloseRef.current?.closest('[role="dialog"]')
        const focusable = dialog?.querySelectorAll<HTMLElement>('button:not(:disabled),a[href]')
        if (!dialog || !focusable?.length) return
        const first = focusable[0],
          last = focusable[focusable.length - 1]
        if (
          event.shiftKey &&
          (document.activeElement === first || !dialog.contains(document.activeElement))
        ) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    summaryCloseRef.current?.focus()
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [summaryOpen])
  const toggleMaterial = (id: string) =>
    update({
      materials: ['none', 'unsure'].includes(id)
        ? draft.materials.includes(id)
          ? []
          : [id]
        : draft.materials.includes(id)
          ? draft.materials.filter((item) => item !== id)
          : [...draft.materials.filter((item) => !['none', 'unsure'].includes(item)), id],
    })
  const title = steps[language][step]
  return (
    <div className="pc-page">
      <header className="pc-page-header">
        <div>
          <a href={paths[language].home} className="pc-back-home">
            <ArrowLeft size={16} aria-hidden="true" />
            {tr(language, 'Retour à l’accueil', 'Back to home')}
          </a>
          <span className="pc-eyebrow">{tr(language, 'VOTRE PROJET', 'YOUR PROJECT')}</span>
          <h1>{tr(language, 'Composez votre projet, simplement.', 'Shape your project with ease.')}</h1>
          <p>
            {tr(
              language,
              'Choisissez ce qui vous est utile et essayez aussitôt le résultat dans l’aperçu.',
              'Choose what you need and try it immediately in the preview.',
            )}
          </p>
        </div>
        <button type="button" className="pc-reset" onClick={reset}>
          <RotateCcw size={16} aria-hidden="true" />
          {tr(language, 'Réinitialiser', 'Reset')}
        </button>
      </header>
      <nav className="pc-stepper" aria-label={tr(language, 'Étapes du configurateur', 'Configurator steps')}>
        {steps[language].map((item, index) => (
          <button
            type="button"
            key={item}
            disabled={index > maxStep}
            className={step === index ? 'active' : ''}
            aria-current={step === index ? 'step' : undefined}
            onClick={() => go(index)}
          >
            <span>{index + 1}</span>
            {item}
          </button>
        ))}
      </nav>
      <div
        className="pc-mobile-tabs"
        role="group"
        aria-label={tr(language, 'Zone affichée', 'Displayed area')}
      >
        {(['choices', 'preview', 'summary'] as const).map((panel) => (
          <button
            type="button"
            key={panel}
            className={mobilePanel === panel ? 'active' : ''}
            aria-pressed={mobilePanel === panel}
            onClick={() => setMobilePanel(panel)}
          >
            {panel === 'choices'
              ? tr(language, 'Configurer', 'Configure')
              : panel === 'preview'
                ? tr(language, 'Aperçu', 'Preview')
                : tr(language, 'Synthèse', 'Summary')}
          </button>
        ))}
      </div>
      <p className="pc-live" role="status" aria-live="polite">
        {announce}
      </p>
      <div className={'pc-layout pc-layout-' + mobilePanel + (step === 1 ? ' pc-layout-contact' : '')}>
        <div className={'pc-controls pc-panel-' + mobilePanel}>
          <h2 ref={headingRef} tabIndex={-1}>
            {title}
          </h2>
          {step === 0 ? (
            <div key="choose" className="pc-form-stack">
              <fieldset className="pc-paths">
                <legend>
                  {tr(language, 'Que souhaitez-vous réaliser ?', 'What would you like to create?')}
                </legend>
                {pathOptions.map((option) => {
                  const Icon = pathIcons[option.id]
                  return (
                    <label key={option.id} className={draft.path === option.id ? 'active' : ''}>
                      <input
                        type="radio"
                        name={`${formId}-path`}
                        checked={draft.path === option.id}
                        onChange={() => choosePath(option.id)}
                      />
                      <span className="pc-path-icon">
                        <Icon size={19} aria-hidden="true" />
                      </span>
                      <span>
                        <strong>{option.title[language]}</strong>
                        <small>{option.description[language]}</small>
                      </span>
                      <span className="pc-radio-mark" aria-hidden="true">
                        {draft.path === option.id && <Check size={16} />}
                      </span>
                    </label>
                  )
                })}
              </fieldset>
              <Field
                id="activity"
                label={tr(language, 'Quelle est votre activité ?', 'What is your business activity?')}
                value={draft.activity}
                onChange={(value) => update({ activity: value })}
                placeholder={tr(
                  language,
                  'Ex. restaurant, artisan, cabinet…',
                  'E.g. restaurant, craft business, practice…',
                )}
                required
                error={errors.activity}
              />
              <button
                type="button"
                className="pc-unknown"
                onClick={() =>
                  update({ activity: tr(language, 'À définir ensemble', 'To discuss together') })
                }
              >
                {tr(language, 'Je ne sais pas encore', 'I’m not sure yet')}
              </button>
              <Field
                id="projectName"
                label={tr(
                  language,
                  'Nom de votre entreprise ou projet (facultatif)',
                  'Business or project name (optional)',
                )}
                value={draft.projectName}
                onChange={(value) => update({ projectName: value, namePending: false })}
                placeholder={tr(language, 'Ex. Atelier Sillage', 'E.g. Atelier Sillage')}
              />
              <label className="pc-pending">
                <input
                  type="checkbox"
                  checked={draft.namePending}
                  onChange={(event) =>
                    update({
                      namePending: event.target.checked,
                      projectName: event.target.checked ? '' : draft.projectName,
                    })
                  }
                />
                {tr(language, 'Le nom n’est pas encore défini', 'The name is not decided yet')}
              </label>
              {(draft.path === 'improve' || draft.path === 'support') && (
                <fieldset className="pc-existing">
                  <legend>
                    {tr(
                      language,
                      'Avez-vous déjà un site ou un outil ?',
                      'Do you already have a website or tool?',
                    )}
                  </legend>
                  <div>
                    {(
                      [
                        ['yes', 'Oui', 'Yes'],
                        ['no', 'Non', 'No'],
                        ['unsure', 'Je ne sais pas', 'I’m not sure'],
                      ] as const
                    ).map(([id, fr, en]) => (
                      <button
                        type="button"
                        key={id}
                        aria-pressed={draft.existing === id}
                        onClick={() =>
                          update({ existing: id, existingDetails: id === 'yes' ? draft.existingDetails : '' })
                        }
                      >
                        {language === 'fr' ? fr : en}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}
              {draft.path === 'improve' && (
                <div className="pc-path-details">
                  <h3>{tr(language, 'Que souhaitez-vous améliorer ?', 'What would you like to improve?')}</h3>
                  {improvementOptions.map(([id, fr, en]) => (
                    <button
                      type="button"
                      key={id}
                      aria-pressed={!!draft.choices[id]}
                      onClick={() => onChoice(id, draft.choices[id] ? undefined : 'wanted')}
                    >
                      <Sparkles size={16} aria-hidden="true" />
                      <span>
                        <strong>{language === 'fr' ? fr : en}</strong>
                        <small>{pathChoiceDetails[id].description[language]}</small>
                      </span>
                      <Check size={16} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              )}
              {draft.path === 'support' ? (
                <div className="pc-path-details">
                  <h3>{tr(language, 'Quel suivi souhaitez-vous ?', 'What kind of support do you need?')}</h3>
                  {supportOptions.map(([id, fr, en]) => (
                    <button
                      type="button"
                      key={id}
                      aria-pressed={!!draft.choices[id]}
                      onClick={() => onChoice(id, draft.choices[id] ? undefined : 'wanted')}
                    >
                      <Wrench size={16} aria-hidden="true" />
                      <span>
                        <strong>{language === 'fr' ? fr : en}</strong>
                        <small>{pathChoiceDetails[id].description[language]}</small>
                      </span>
                      <Check size={16} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <div className="pc-suggestions">
                    <div className="pc-section-heading">
                      <Sparkles size={17} aria-hidden="true" />
                      <h3>{tr(language, 'Suggestions pour votre projet', 'Suggestions for your project')}</h3>
                    </div>
                    <p>
                      {tr(
                        language,
                        'Des pistes selon votre activité. Vous gardez le choix.',
                        'Ideas based on your activity. You remain free to choose.',
                      )}
                    </p>
                    <div>
                      {suggestions.map((need) => {
                        const Icon = iconByNeed[need.id] || groupIcons[need.group]
                        return (
                          <button
                            type="button"
                            key={need.id}
                            aria-pressed={!!draft.choices[need.id]}
                            onClick={() => onChoice(need.id, draft.choices[need.id] ? undefined : 'wanted')}
                          >
                            <Icon size={16} aria-hidden="true" />
                            <span>{labelFor(need, language)}</span>
                            <Check size={15} aria-hidden="true" />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="pc-catalog">
                    <h3>{tr(language, 'Choisissez vos éléments', 'Choose your features')}</h3>
                    {categories.map((group) => {
                      const list =
                        group.id === 'all'
                          ? needs
                          : group.ids
                              .map((id) => needs.find((need) => need.id === id))
                              .filter((need): need is Need => !!need)
                      return (
                        <section key={group.id} className="pc-group">
                          <button
                            type="button"
                            className="pc-group-toggle"
                            aria-expanded={expandedCategory === group.id}
                            onClick={() => setExpandedCategory(expandedCategory === group.id ? '' : group.id)}
                          >
                            {group.title[language]}
                            <span>{group.id === 'all' ? needs.length : list.length}</span>
                            <ChevronDown size={18} aria-hidden="true" />
                          </button>
                          {expandedCategory === group.id && (
                            <div className="pc-compact-grid">
                              {list.map((need) => (
                                <NeedTile
                                  key={need.id}
                                  need={need}
                                  draft={draft}
                                  language={language}
                                  onChoice={onChoice}
                                  onPreview={onPreview}
                                />
                              ))}
                            </div>
                          )}
                        </section>
                      )
                    })}
                  </div>
                </>
              )}
              <Field
                id="aspiration"
                label={tr(
                  language,
                  'Une idée particulière à nous expliquer ? (facultatif)',
                  'Any other idea to share? (optional)',
                )}
                value={draft.aspiration}
                onChange={(value) => update({ aspiration: value })}
                multiline
                placeholder={tr(language, 'Décrivez-la avec vos mots.', 'Describe it in your own words.')}
              />
            </div>
          ) : (
            <div key="contact" className="pc-form-stack">
              <p className="pc-step-intro">
                {tr(
                  language,
                  'Vos choix serviront de base à notre échange. Aucun prix n’est calculé automatiquement.',
                  'Your choices will guide our discussion. No price is calculated automatically.',
                )}
              </p>
              <div className="pc-final-summary">
                <Summary draft={draft} language={language} onEdit={go} />
              </div>
              {submitState === 'success' ? (
                <div className="pc-success" role="status">
                  <Check size={24} />
                  <h3>
                    {tr(language, 'Votre demande a bien été reçue.', 'Your request has been received.')}
                  </h3>
                  <p>
                    {tr(
                      language,
                      'Merci, votre projet est prêt pour notre échange.',
                      'Thank you. Your project is ready for our discussion.',
                    )}
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <Field
                    id="name"
                    label={tr(language, 'Votre nom', 'Your name')}
                    value={draft.name}
                    onChange={(value) => update({ name: value })}
                    required
                    error={errors.name}
                  />
                  <Field
                    id="email"
                    label="Email"
                    value={draft.email}
                    onChange={(value) => update({ email: value })}
                    required
                    error={errors.email}
                  />
                  {(draft.path === 'improve' || draft.path === 'support') && draft.existing === 'yes' && (
                    <Field
                      id="existingDetails"
                      label={tr(
                        language,
                        'Adresse du site ou de l’outil existant (facultatif)',
                        'Existing website or tool address (optional)',
                      )}
                      value={draft.existingDetails}
                      onChange={(value) => update({ existingDetails: value })}
                      placeholder="https://"
                    />
                  )}
                  <div className="pc-optional-field">
                    <Field
                      id="importantDate"
                      label={tr(language, 'Délai souhaité (facultatif)', 'Preferred timeline (optional)')}
                      value={draft.importantDate}
                      onChange={(value) => update({ importantDate: value })}
                      placeholder={tr(language, 'Ex. avant septembre', 'E.g. before September')}
                    />
                    <button
                      type="button"
                      className="pc-unknown"
                      onClick={() =>
                        update({ importantDate: tr(language, 'À définir ensemble', 'To discuss together') })
                      }
                    >
                      {tr(language, 'À définir ensemble', 'To discuss together')}
                    </button>
                  </div>
                  <div className="pc-optional-field">
                    <Field
                      id="budget"
                      label={tr(language, 'Budget indicatif (facultatif)', 'Indicative budget (optional)')}
                      value={draft.budget}
                      onChange={(value) => update({ budget: value })}
                      placeholder={tr(language, 'Si vous avez déjà une idée', 'If you already have a range')}
                    />
                    <button
                      type="button"
                      className="pc-unknown"
                      onClick={() =>
                        update({ budget: tr(language, 'À définir ensemble', 'To discuss together') })
                      }
                    >
                      {tr(language, 'Je ne sais pas', 'I’m not sure')}
                    </button>
                  </div>
                  {draft.path !== 'support' && (
                    <fieldset className="pc-materials">
                      <legend>
                        {tr(
                          language,
                          'Quels éléments avez-vous déjà ? (facultatif)',
                          'What do you already have? (optional)',
                        )}
                      </legend>
                      <div>
                        {materialOptions.map(([id, fr, en]) => (
                          <button
                            type="button"
                            key={id}
                            aria-pressed={draft.materials.includes(id)}
                            onClick={() => toggleMaterial(id)}
                          >
                            {language === 'fr' ? fr : en}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  )}
                  {(draft.path === 'tool' || draft.path === 'improve') && (
                    <Field
                      id="dataToMove"
                      label={tr(language, 'Données à reprendre (facultatif)', 'Data to move (optional)')}
                      value={draft.dataToMove}
                      onChange={(value) => update({ dataToMove: value })}
                      placeholder={tr(
                        language,
                        'Ex. liste de clients, documents…',
                        'E.g. client list, documents…',
                      )}
                    />
                  )}
                  <Field
                    id="message"
                    label={tr(
                      language,
                      'Informations complémentaires (facultatif)',
                      'Additional information (optional)',
                    )}
                    value={draft.message}
                    onChange={(value) => update({ message: value })}
                    multiline
                  />
                  <p className="pc-privacy">
                    {tr(
                      language,
                      'Vos réponses et coordonnées sont utilisées pour traiter votre demande.',
                      'Your answers and contact details are used to handle your request.',
                    )}{' '}
                    <a href={paths[language].privacy}>
                      {tr(language, 'Politique de confidentialité', 'Privacy policy')}
                    </a>
                    .
                  </p>
                  {submitState === 'error' && (
                    <p role="alert" className="pc-submit-error">
                      {submitError}
                    </p>
                  )}
                  <button className="button button-primary pc-submit" type="submit" disabled={submitState === 'sending'} aria-busy={submitState === 'sending'}>
                    {submitState === 'sending' ? <span className="pc-spinner" aria-hidden="true" /> : <Send size={17} aria-hidden="true" />}
                    {submitState === 'sending'
                      ? tr(language, 'Envoi en cours…', 'Sending…')
                      : tr(language, 'Envoyer ma demande', 'Send my request')}
                  </button>
                </form>
              )}
            </div>
          )}
          <div className="pc-step-actions">
            {step > 0 && (
              <button type="button" className="button button-outline" onClick={() => go(0)}>
                <ArrowLeft size={16} aria-hidden="true" />
                {tr(language, 'Retour au projet', 'Back to project')}
              </button>
            )}
            {step === 0 && (
              <button type="button" className="button button-primary pc-next" onClick={next}>
                {tr(language, 'Parlons de votre projet', 'Let’s talk about your project')}
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
        <div ref={previewColumnRef} className={'pc-preview-column pc-panel-' + mobilePanel}>
          <ProjectStylePreview
            draft={draft}
            language={language}
            lastChanged={lastChanged}
            changeSequence={changeSequence}
          />
          <button
            type="button"
            className="pc-summary-handle"
            ref={summaryHandleRef}
            onClick={() => setSummaryOpen(true)}
          >
            {tr(language, 'Synthèse', 'Summary')} <span>{chosenNeeds.length}</span>
          </button>
        </div>
        <aside className={'pc-summary-column pc-panel-' + mobilePanel}>
          <Summary draft={draft} language={language} onEdit={go} />
        </aside>
        {summaryOpen && (
          <div
            className="pc-drawer-backdrop"
            onClick={() => {
              setSummaryOpen(false)
              requestAnimationFrame(() => summaryHandleRef.current?.focus())
            }}
          >
            <aside
              className="pc-summary-drawer"
              role="dialog"
              aria-modal="true"
              aria-label={tr(language, 'Synthèse', 'Summary')}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="pc-drawer-header">
                <h2>{tr(language, 'Synthèse', 'Summary')}</h2>
                <button
                  type="button"
                  ref={summaryCloseRef}
                  onClick={() => {
                    setSummaryOpen(false)
                    summaryHandleRef.current?.focus()
                  }}
                  aria-label={tr(language, 'Fermer la synthèse', 'Close summary')}
                >
                  <X size={20} />
                </button>
              </div>
              <Summary
                draft={draft}
                language={language}
                onEdit={(target) => {
                  setSummaryOpen(false)
                  go(target)
                }}
              />
            </aside>
          </div>
        )}
      </div>
      {pending && (
        <ConfirmBar
          message={pending.message}
          confirmLabel={pending.confirmLabel}
          language={language}
          onCancel={() => setPending(null)}
          onConfirm={() => {
            const run = pending.run
            setPending(null)
            run()
          }}
        />
      )}
    </div>
  )
}
