import { Honeypot } from './honeypot'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowLeft, CalendarCheck } from 'lucide-react'
import '../neobrutalism.css'
import './booking-page.css'

type Slots = { duration: number; timeZone: string; slots: string[] }

const dayKey = (iso: string, timeZone: string) => new Date(iso).toLocaleDateString('en-CA', { timeZone })
const dayLabel = (iso: string, timeZone: string) => new Date(iso).toLocaleDateString('fr-FR', { timeZone, weekday: 'long', day: 'numeric', month: 'long' })
const dayShort = (iso: string, timeZone: string) => new Date(iso).toLocaleDateString('fr-FR', { timeZone, weekday: 'short', day: 'numeric', month: 'short' })
const timeLabel = (iso: string, timeZone: string) => new Date(iso).toLocaleTimeString('fr-FR', { timeZone, hour: '2-digit', minute: '2-digit' })

export function BookingPage() {
  const [data, setData] = useState<Slots | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [day, setDay] = useState('')
  const [slot, setSlot] = useState('')
  const [fields, setFields] = useState({ name: '', email: '', topic: '' })
  const [trap, setTrap] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Prendre rendez-vous — William Mahi'
    fetch('/api/slots').then((r) => (r.ok ? r.json() : Promise.reject(new Error('slots')))).then(setData).catch(() => setLoadError(true))
  }, [])

  const days = useMemo(() => {
    const map = new Map<string, string[]>()
    for (const iso of data?.slots ?? []) map.set(dayKey(iso, data!.timeZone), [...(map.get(dayKey(iso, data!.timeZone)) ?? []), iso])
    return [...map.entries()]
  }, [data])
  const selectedDay = days.find(([key]) => key === day) ?? days[0]

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (state === 'sending' || !slot) return
    setState('sending')
    setError('')
    try {
      const response = await fetch('/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...fields, website: trap, startsAt: slot }) })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        if (response.status === 409) {
          setSlot('')
          fetch('/api/slots').then((r) => r.json()).then(setData).catch(() => undefined)
        }
        throw new Error(result.errors?.[0] || result.message || 'Envoi impossible.')
      }
      setState('done')
    } catch (failure) {
      setError((failure as Error).message)
      setState('idle')
    }
  }

  const set = (key: keyof typeof fields) => (value: string) => setFields((current) => ({ ...current, [key]: value }))

  return <main className="booking-page">
    <a className="booking-back" href="/"><ArrowLeft aria-hidden="true" />Retour au site</a>
    <header>
      <span className="booking-eyebrow">Rendez-vous</span>
      <h1>Prendre rendez-vous</h1>
      <p>Un échange de {data?.duration ?? 30} minutes pour parler de votre projet. Choisissez un créneau : je confirme par email.</p>
    </header>

    {state === 'done' ? <section className="booking-card booking-done" role="status">
      <CalendarCheck aria-hidden="true" />
      <h2>Demande envoyée</h2>
      <p>Merci {fields.name.trim().split(/\s+/)[0]}. Je vous confirme le rendez-vous du {dayLabel(slot, data?.timeZone ?? 'Europe/Paris')} à {timeLabel(slot, data?.timeZone ?? 'Europe/Paris')} par email, à {fields.email}.</p>
      <a className="booking-btn" href="/">Retour au site</a>
    </section>
      : loadError ? <p className="booking-card" role="alert">Les créneaux sont indisponibles pour le moment. Écrivez-moi directement par email.</p>
      : !data ? <p className="booking-card">Chargement des créneaux…</p>
      : days.length === 0 ? <p className="booking-card">Aucun créneau n’est ouvert pour le moment. Écrivez-moi directement par email.</p>
      : <form className="booking-layout" onSubmit={submit}>
        <section className="booking-card">
          <h2>1. Choisissez un jour</h2>
          <div className="booking-days" role="group" aria-label="Jours disponibles">
            {days.map(([key, slots]) => <button key={key} type="button" className={`booking-day${selectedDay?.[0] === key ? ' is-selected' : ''}`} aria-pressed={selectedDay?.[0] === key} onClick={() => { setDay(key); setSlot('') }}>
              <strong>{dayShort(slots[0], data.timeZone)}</strong><span>{slots.length} créneau{slots.length > 1 ? 'x' : ''}</span>
            </button>)}
          </div>
          <h2>2. Choisissez une heure</h2>
          <div className="booking-slots" role="group" aria-label="Heures disponibles">
            {selectedDay?.[1].map((iso) => <button key={iso} type="button" className={`booking-slot${slot === iso ? ' is-selected' : ''}`} aria-pressed={slot === iso} onClick={() => setSlot(iso)}>{timeLabel(iso, data.timeZone)}</button>)}
          </div>
          <p className="booking-note">Heures de Paris.</p>
        </section>
        <section className="booking-card">
          <h2>3. Vos coordonnées</h2>
          <Honeypot value={trap} onChange={setTrap} />
          <label>Nom *<input required minLength={2} maxLength={120} autoComplete="name" value={fields.name} onChange={(e) => set('name')(e.target.value)} /></label>
          <label>Email *<input required type="email" maxLength={200} autoComplete="email" value={fields.email} onChange={(e) => set('email')(e.target.value)} /></label>
          <label>De quoi voulez-vous parler ?<textarea rows={4} maxLength={1000} value={fields.topic} onChange={(e) => set('topic')(e.target.value)} /></label>
          <button type="submit" className="booking-btn" disabled={!slot || state === 'sending'}>{state === 'sending' ? 'Envoi…' : slot ? `Réserver le ${timeLabel(slot, data.timeZone)}` : 'Choisissez un créneau'}</button>
          {error && <p role="alert" className="booking-error">{error}</p>}
          <p className="booking-note">Vos informations servent uniquement à organiser ce rendez-vous. <a href="/politique-de-confidentialite">Politique de confidentialité</a></p>
        </section>
      </form>}
  </main>
}
