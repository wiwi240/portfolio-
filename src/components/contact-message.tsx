import { useState, type FormEvent } from 'react'
import { CalendarCheck, Send } from 'lucide-react'
import type { Language } from '@/data/portfolio-content'
import { getAudience } from '@/lib/track'
import { Honeypot } from './honeypot'
import './contact-message.css'

const text = {
  fr: {
    eyebrow: 'Message rapide', title: 'Une question, une opportunité ?', lead: 'Pour un recrutement, une mission ou une simple question. Pour un projet à chiffrer, le guide « Décrire mon projet » est plus complet.',
    name: 'Nom', email: 'Email', company: 'Entreprise (facultatif)', phone: 'Téléphone (facultatif)', message: 'Message', who: 'Vous êtes', recruiter: 'Recruteur', client: 'Client', other: 'Autre',
    send: 'Envoyer', sending: 'Envoi…', sent: 'Message envoyé. Je vous réponds rapidement.', error: 'Envoi impossible pour le moment.', privacy: 'Ces informations servent uniquement à vous répondre.',
    booking: 'Prendre rendez-vous', bookingText: 'Préférez-vous échanger de vive voix ? Réservez un créneau.',
  },
  en: {
    eyebrow: 'Quick message', title: 'A question, an opportunity?', lead: 'For recruitment, a mission or a simple question. For a project to quote, the “Describe my project” guide is more complete.',
    name: 'Name', email: 'Email', company: 'Company (optional)', phone: 'Phone (optional)', message: 'Message', who: 'You are', recruiter: 'Recruiter', client: 'Client', other: 'Other',
    send: 'Send', sending: 'Sending…', sent: 'Message sent. I will reply shortly.', error: 'Could not send right now.', privacy: 'This information is only used to reply to you.',
    booking: 'Book a call', bookingText: 'Prefer to talk? Book a time slot.',
  },
} as const

export function ContactMessage({ language }: { language: Language }) {
  const t = text[language]
  const [fields, setFields] = useState({ name: '', email: '', company: '', phone: '', message: '', audience: getAudience() === 'client' ? 'client' : 'recruiter' })
  const [trap, setTrap] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')
  const set = (key: keyof typeof fields) => (value: string) => setFields((current) => ({ ...current, [key]: value }))

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (state === 'sending') return
    setState('sending')
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...fields, website: trap, kind: 'message' }) })
      if (!response.ok) throw new Error((await response.json().catch(() => ({}))).errors?.[0] || t.error)
      setState('sent')
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : t.error)
      setState('error')
    }
  }

  return <div className="contact-message">
    <form onSubmit={submit} className="contact-message-form">
      <span className="eyebrow">{t.eyebrow}</span>
      <h2>{t.title}</h2>
      <p>{t.lead}</p>
      {state === 'sent' ? <p role="status" className="contact-message-ok">{t.sent}</p> : <>
        <Honeypot value={trap} onChange={setTrap} />
        <div className="contact-message-grid">
          <label>{t.name} *<input required minLength={2} maxLength={120} autoComplete="name" value={fields.name} onChange={(e) => set('name')(e.target.value)} /></label>
          <label>{t.email} *<input required type="email" autoComplete="email" value={fields.email} onChange={(e) => set('email')(e.target.value)} /></label>
          <label>{t.company}<input maxLength={160} autoComplete="organization" value={fields.company} onChange={(e) => set('company')(e.target.value)} /></label>
          <label>{t.phone}<input type="tel" maxLength={30} autoComplete="tel" value={fields.phone} onChange={(e) => set('phone')(e.target.value)} /></label>
          <label>{t.who}<select value={fields.audience} onChange={(e) => set('audience')(e.target.value)}><option value="recruiter">{t.recruiter}</option><option value="client">{t.client}</option><option value="other">{t.other}</option></select></label>
        </div>
        <label>{t.message} *<textarea required minLength={10} maxLength={2000} rows={5} value={fields.message} onChange={(e) => set('message')(e.target.value)} /></label>
        <button type="submit" className="button button-primary" disabled={state === 'sending'}>{state === 'sending' ? t.sending : t.send}<Send aria-hidden="true" /></button>
        {state === 'error' && <p role="alert" className="contact-message-error">{error}</p>}
        <small>{t.privacy}</small>
      </>}
    </form>
    <aside className="contact-message-booking">
      <CalendarCheck aria-hidden="true" />
      <p>{t.bookingText}</p>
      <a className="button button-outline" href="/rendez-vous">{t.booking}</a>
    </aside>
  </div>
}
