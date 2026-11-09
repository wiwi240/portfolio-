import { useState, type FormEvent } from 'react'
import { ArrowLeft, Check, Send } from 'lucide-react'
import { guideIcon } from '@/data/guide-icons'
import { entryTitles, type GuidePanelData } from '@/data/home-guide'
import type { Language } from '@/data/portfolio-content'
import type { PathId } from '@/data/project-configurator'
import { sendProjectRequest } from '@/data/project-submit'
import { paths } from '@/site'
import './project-guide.css'

const text = {
  fr: { title: 'Votre projet en un coup d’œil', empty: 'Rien de coché : nous définirons tout ensemble.', activity: 'Quelle est votre activité ?', activityPlaceholder: 'Ex. restaurant, artisan, cabinet…', undecided: 'À définir ensemble', name: 'Votre nom', email: 'Email', message: 'Un détail à ajouter ? (facultatif)', send: 'Envoyer ma demande', sending: 'Envoi en cours…', back: 'Précédent', privacy: 'Vos réponses et coordonnées sont utilisées pour traiter votre demande.', policy: 'Politique de confidentialité', errName: 'Indiquez au moins deux caractères.', errEmail: 'Indiquez une adresse email valide.', errActivity: 'Indiquez votre activité, ou choisissez « À définir ensemble ».', errSend: 'Envoi impossible. Réessayez.', doneTitle: 'Votre demande a bien été reçue.', doneText: 'Merci, votre projet est prêt pour notre échange.', intro: 'Voici tout ce que vous avez ajouté. Précisez qui vous êtes et envoyez : nous en discutons ensemble.' },
  en: { title: 'Your project at a glance', empty: 'Nothing ticked: we will define everything together.', activity: 'What is your business activity?', activityPlaceholder: 'E.g. restaurant, craft business, practice…', undecided: 'To discuss together', name: 'Your name', email: 'Email', message: 'Anything to add? (optional)', send: 'Send my request', sending: 'Sending…', back: 'Back', privacy: 'Your answers and contact details are used to handle your request.', policy: 'Privacy policy', errName: 'Enter at least two characters.', errEmail: 'Enter a valid email address.', errActivity: 'Enter your activity, or choose “To discuss together”.', errSend: 'Could not send. Please try again.', doneTitle: 'Your request has been received.', doneText: 'Thank you. Your project is ready for our discussion.', intro: 'Here is everything you added. Tell me who you are and send it: we will discuss it together.' },
}

type GuideSummaryProps = { language: Language; path: PathId; panels: GuidePanelData[]; selected: string[]; activity: string; onActivityChange: (value: string) => void; onBack: () => void }

export function GuideSummary({ language, path, panels, selected, activity, onActivityChange, onBack }: GuideSummaryProps) {
  const t = text[language]
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle')
  const [error, setError] = useState('')
  const [sentKey, setSentKey] = useState('')
  const requestKey = `${path}:${selected.join(',')}`
  const sent = sentKey === requestKey
  const groups = panels
    .map((panel) => ({ panel, items: panel.items.filter((item) => selected.includes(item.id)) }))
    .filter((group) => group.items.length > 0)
  const set = (key: 'activity' | keyof typeof fields) => (value: string) => {
    if (key === 'activity') onActivityChange(value)
    else setFields((current) => ({ ...current, [key]: value }))
    setErrors((current) => (current[key] ? { ...current, [key]: '' } : current))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (state === 'sending') return
    const next: Record<string, string> = {}
    if (activity.trim().length < 2) next.activity = t.errActivity
    if (fields.name.trim().length < 2) next.name = t.errName
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) next.email = t.errEmail
    setErrors(next)
    const first = Object.keys(next)[0]
    if (first) {
      document.getElementById(`guide-${first}`)?.focus()
      return
    }
    setState('sending')
    try {
      await sendProjectRequest({ path, selected, activity, ...fields }, t.errSend)
      setSentKey(requestKey)
      setState('idle')
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : t.errSend)
      setState('error')
    }
  }

  const field = (key: 'activity' | keyof typeof fields, label: string, extra: { type?: string; placeholder?: string; multiline?: boolean; autoComplete?: string } = {}) => (
    <div className="guide-field">
      <label htmlFor={`guide-${key}`}>
        {label}
        {key !== 'message' && <span aria-hidden="true"> *</span>}
      </label>
      {extra.multiline ? (
        <textarea id={`guide-${key}`} rows={2} maxLength={2000} value={key === 'activity' ? activity : fields[key]} onChange={(event) => set(key)(event.target.value)} />
      ) : (
        <input
          id={`guide-${key}`}
          type={extra.type ?? 'text'}
          maxLength={key === 'activity' ? 160 : 2000}
          placeholder={extra.placeholder}
          autoComplete={extra.autoComplete}
          required={key !== 'message'}
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `guide-${key}-error` : undefined}
          value={key === 'activity' ? activity : fields[key]}
          onChange={(event) => set(key)(event.target.value)}
        />
      )}
      {!!errors[key] && (
        <small id={`guide-${key}-error`} className="guide-error">
          {errors[key]}
        </small>
      )}
    </div>
  )

  return (
    <section className="stack-scene-inner guide-final" aria-labelledby="guide-summary-title">
      <div className="guide-final-recap">
        <span className="eyebrow">{entryTitles[path]?.[language]}</span>
        <h2 id="guide-summary-title" tabIndex={-1}>
          {t.title}
        </h2>
        <p className="guide-hint">{t.intro}</p>
        {groups.length === 0 ? (
          <p className="guide-hint">{t.empty}</p>
        ) : (
          <div className="guide-summary">
            {groups.map(({ panel, items }) => (
              <div key={panel.id}>
                <h3>{panel.title[language]}</h3>
                <ul>
                  {items.map((item) => {
                    const Icon = guideIcon(item.id)
                    return (
                      <li key={item.id}>
                        <Icon size={15} strokeWidth={2} aria-hidden="true" />
                        {item.title[language]}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
        <div className="guide-nav">
          <button type="button" className="button button-outline" onClick={onBack}>
            <ArrowLeft aria-hidden="true" />
            {t.back}
          </button>
        </div>
      </div>
      <div className="guide-final-form" aria-live="polite">
        {sent ? (
          <div className="guide-success" role="status">
            <span className="guide-success-badge">
              <Check size={30} strokeWidth={3} aria-hidden="true" />
            </span>
            <strong>{t.doneTitle}</strong>
            <p>{t.doneText}</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <div className="guide-activity">
              {field('activity', t.activity, { placeholder: t.activityPlaceholder })}
              <button type="button" className="guide-undecided" onClick={() => set('activity')(t.undecided)}>
                {t.undecided}
              </button>
            </div>
            <div className="guide-row">
              {field('name', t.name, { autoComplete: 'name' })}
              {field('email', t.email, { type: 'email', autoComplete: 'email' })}
            </div>
            {field('message', t.message, { multiline: true })}
            <p className="guide-privacy">
              {t.privacy} <a href={paths[language].privacy}>{t.policy}</a>.
            </p>
            {state === 'error' && (
              <p role="alert" className="guide-error">
                {error}
              </p>
            )}
            <button className="button button-primary" type="submit" disabled={state === 'sending'} aria-busy={state === 'sending'}>
              <Send aria-hidden="true" />
              {state === 'sending' ? t.sending : t.send}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
