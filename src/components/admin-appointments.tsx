import { useEffect, useState } from 'react'
import { Check, Mail, X } from 'lucide-react'
import { Header } from './admin-requests'
import { api, type Appointment, type Availability, type Settings } from './admin-api'

const DAYS: [string, string][] = [['1', 'Lundi'], ['2', 'Mardi'], ['3', 'Mercredi'], ['4', 'Jeudi'], ['5', 'Vendredi'], ['6', 'Samedi'], ['0', 'Dimanche']]
const when = (iso: string) => new Date(iso).toLocaleString('fr-FR', { timeZone: 'Europe/Paris', weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
const STATUS_LABEL = { pending: 'À confirmer', confirmed: 'Confirmé', cancelled: 'Annulé' } as const

export function Appointments({ settings, onSettings, now }: { settings: Settings; onSettings: (settings: Settings) => void; now: number }) {
  const [items, setItems] = useState<Appointment[] | null>(null)
  const [error, setError] = useState('')
  const [availability, setAvailability] = useState<Availability>(settings.availability)
  const [blockedDay, setBlockedDay] = useState('')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    api<{ items: Appointment[] }>('/api/admin/appointments').then((r) => setItems(r.items)).catch((e: Error) => setError(e.message))
  }, [])

  async function setStatus(item: Appointment, status: Appointment['status']) {
    setError('')
    try {
      const { item: updated } = await api<{ item: Appointment }>(`/api/admin/appointments/${item.id}`, { method: 'PATCH', body: { status } })
      setItems((rows) => (rows ?? []).map((row) => (row.id === updated.id ? updated : row)))
    } catch (failure) {
      setError((failure as Error).message)
    }
  }

  async function saveAvailability() {
    setFeedback('Enregistrement…')
    try {
      const { settings: saved } = await api<{ settings: Settings }>('/api/admin/settings', { method: 'PUT', body: { ...settings, availability } })
      onSettings(saved)
      setFeedback('Disponibilités enregistrées.')
    } catch (failure) {
      setFeedback((failure as Error).message)
    }
  }

  const toggleDay = (key: string, on: boolean) => setAvailability((current) => {
    const days = { ...current.days }
    if (on) days[key] = { start: '09:00', end: '17:00' }
    else delete days[key]
    return { ...current, days }
  })
  const setRange = (key: string, part: 'start' | 'end', value: string) => setAvailability((current) => ({ ...current, days: { ...current.days, [key]: { ...current.days[key], [part]: value } } }))
  const number = (key: 'duration' | 'noticeHours' | 'horizonDays') => (value: string) => setAvailability((current) => ({ ...current, [key]: Number(value) }))

  const upcoming = (items ?? []).filter((item) => item.status !== 'cancelled' && new Date(item.starts_at).getTime() >= now - 3600 * 1000).sort((a, b) => a.starts_at.localeCompare(b.starts_at))
  const past = (items ?? []).filter((item) => !upcoming.includes(item))

  const row = (item: Appointment) => <li key={item.id} className="nbd-row">
    <div className="nbd-row-text">
      <strong>{when(item.starts_at)}</strong>
      <span>{item.name} · {item.email}</span>
      {item.topic && <span className="nbd-note-hint">{item.topic}</span>}
    </div>
    <span className={`nbd-status nbd-appt-${item.status}`}>{STATUS_LABEL[item.status]}</span>
    <div className="nbd-actions nbd-actions-tight">
      <a className="nbd-btn nbd-btn-light" href={`mailto:${item.email}?subject=${encodeURIComponent('Votre rendez-vous')}`}><Mail aria-hidden="true" />Écrire</a>
      {item.status !== 'confirmed' && item.status !== 'cancelled' && <button type="button" className="nbd-btn" onClick={() => setStatus(item, 'confirmed')}><Check aria-hidden="true" />Confirmer</button>}
      {item.status !== 'cancelled' && <button type="button" className="nbd-btn nbd-btn-danger" onClick={() => setStatus(item, 'cancelled')}><X aria-hidden="true" />Annuler</button>}
    </div>
  </li>

  return <>
    <Header eyebrow="Espace réservé" title="Rendez-vous" lead="Les créneaux réservés depuis la page publique « Prendre rendez-vous », et vos disponibilités. Heures en fuseau de Paris." />
    <p className="nbd-lead nbd-inline">Page publique : <a href="/rendez-vous">/rendez-vous</a></p>
    {error && <p role="alert" className="nbd-alert">{error}</p>}
    <h2 className="nbd-h2">À venir</h2>
    {items === null ? <p className="nbd-empty">Chargement…</p> : upcoming.length === 0 ? <p className="nbd-empty">Aucun rendez-vous à venir.</p> : <ul className="nbd-list">{upcoming.map(row)}</ul>}
    {past.length > 0 && <>
      <h2 className="nbd-h2 nbd-section-gap">Passés ou annulés</h2>
      <ul className="nbd-list">{past.map(row)}</ul>
    </>}

    <section className="nbd-card nbd-section-gap">
      <h2 className="nbd-h2">Disponibilités</h2>
      <div className="nbd-days">
        {DAYS.map(([key, label]) => {
          const range = availability.days[key]
          return <div key={key} className="nbd-day">
            <label className="nbd-check"><input type="checkbox" checked={Boolean(range)} onChange={(e) => toggleDay(key, e.target.checked)} />{label}</label>
            {range ? <span className="nbd-day-range">
              <label><span className="nbd-sr">{label} début</span><input type="time" value={range.start} onChange={(e) => setRange(key, 'start', e.target.value)} /></label>
              <span aria-hidden="true">à</span>
              <label><span className="nbd-sr">{label} fin</span><input type="time" value={range.end} onChange={(e) => setRange(key, 'end', e.target.value)} /></label>
            </span> : <span className="nbd-muted">Indisponible</span>}
          </div>
        })}
      </div>
      <div className="nbd-form-grid">
        <label className="nbd-field"><span>Durée d’un rendez-vous (min)</span><select value={availability.duration} onChange={(e) => number('duration')(e.target.value)}>{[15, 20, 30, 45, 60, 90].map((d) => <option key={d} value={d}>{d} min</option>)}</select></label>
        <label className="nbd-field"><span>Délai minimum avant un rendez-vous (h)</span><input type="number" min="0" max="168" value={availability.noticeHours} onChange={(e) => number('noticeHours')(e.target.value)} /></label>
        <label className="nbd-field"><span>Réservable jusqu’à (jours)</span><input type="number" min="1" max="90" value={availability.horizonDays} onChange={(e) => number('horizonDays')(e.target.value)} /></label>
      </div>
      <div className="nbd-field">
        <span>Jours bloqués (congés, indisponibilités)</span>
        <div className="nbd-blocked">
          {availability.blocked.map((day) => <span key={day} className="nbd-tag">{new Date(`${day}T12:00:00`).toLocaleDateString('fr-FR', { dateStyle: 'medium' })}<button type="button" aria-label={`Retirer le ${day}`} onClick={() => setAvailability((c) => ({ ...c, blocked: c.blocked.filter((d) => d !== day) }))}><X aria-hidden="true" /></button></span>)}
          <input type="date" value={blockedDay} onChange={(e) => setBlockedDay(e.target.value)} aria-label="Ajouter un jour bloqué" />
          <button type="button" className="nbd-btn nbd-btn-light" disabled={!blockedDay || availability.blocked.includes(blockedDay)} onClick={() => { setAvailability((c) => ({ ...c, blocked: [...c.blocked, blockedDay].sort() })); setBlockedDay('') }}>Bloquer ce jour</button>
        </div>
      </div>
      <div className="nbd-actions">
        <button type="button" className="nbd-btn" onClick={saveAvailability}>Enregistrer les disponibilités</button>
        <span role="status" className="nbd-feedback">{feedback}</span>
      </div>
    </section>
  </>
}
