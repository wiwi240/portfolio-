import { useMemo, useState } from 'react'
import { Bell, Mail, Phone, Search } from 'lucide-react'
import { Header, type RequestsContext } from './admin-requests'
import { dateFr, dayFr, euros, reminder, statusLabel, type RequestItem } from './admin-api'

type Contact = { email: string; name: string; company: string; phone: string; audience: RequestItem['audience']; requests: RequestItem[]; last: string; followUp: string | null }

// One contact per email address, with every request they sent.
function groupByEmail(items: RequestItem[]): Contact[] {
  const map = new Map<string, RequestItem[]>()
  for (const item of items) {
    const key = item.email.toLowerCase()
    map.set(key, [...(map.get(key) ?? []), item])
  }
  return [...map.entries()].map(([email, requests]) => {
    const sorted = [...requests].sort((a, b) => b.created_at.localeCompare(a.created_at))
    const latest = sorted[0]
    const followUps = sorted.filter((r) => !r.archived && r.follow_up_at).map((r) => r.follow_up_at as string).sort()
    return {
      email,
      name: latest.name,
      company: sorted.find((r) => r.company)?.company ?? '',
      phone: sorted.find((r) => r.phone)?.phone ?? '',
      audience: latest.audience,
      requests: sorted,
      last: latest.created_at,
      followUp: followUps[0] ?? null,
    }
  }).sort((a, b) => b.last.localeCompare(a.last))
}

type Tab = 'all' | 'client' | 'recruiter'

export function Contacts({ ctx }: { ctx: RequestsContext }) {
  const { items, settings, now, onOpen } = ctx
  const [tab, setTab] = useState<Tab>('all')
  const [query, setQuery] = useState('')
  const contacts = useMemo(() => groupByEmail(items), [items])
  const needle = query.trim().toLowerCase()
  const visible = contacts
    .filter((c) => tab === 'all' || (tab === 'recruiter' ? c.audience === 'recruiter' : c.audience !== 'recruiter'))
    .filter((c) => !needle || `${c.name} ${c.email} ${c.company} ${c.phone}`.toLowerCase().includes(needle))
  const counts = { all: contacts.length, client: contacts.filter((c) => c.audience !== 'recruiter').length, recruiter: contacts.filter((c) => c.audience === 'recruiter').length }
  const tabs: { id: Tab; label: string }[] = [{ id: 'all', label: 'Tous' }, { id: 'client', label: 'Clients' }, { id: 'recruiter', label: 'Recruteurs' }]

  return <>
    <Header eyebrow="Espace réservé" title="Contacts" lead="Chaque personne apparaît une fois, avec tout l’historique de ses échanges. Les recruteurs sont séparés des clients." />
    <div className="nbd-toolbar">
      <div className="nbd-tabs" role="tablist" aria-label="Type de contact">
        {tabs.map((t) => <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={`nbd-tab${tab === t.id ? ' is-active' : ''}`} onClick={() => setTab(t.id)}>{t.label} <span>{counts[t.id]}</span></button>)}
      </div>
      <label className="nbd-search"><Search aria-hidden="true" /><span className="nbd-sr">Rechercher un contact</span><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nom, email, entreprise, téléphone…" /></label>
    </div>
    {visible.length === 0 ? <p className="nbd-empty">Aucun contact.</p> : <ul className="nbd-list">
      {visible.map((contact) => {
        const due = contact.requests.map((r) => reminder(r, now, settings.followUpDays)).find(Boolean)
        const signed = contact.requests.filter((r) => ['accepted', 'inprogress', 'delivered', 'maintenance'].includes(r.status)).reduce((t, r) => t + (r.amount ?? 0), 0)
        return <li key={contact.email} className="nbd-row nbd-contact">
          <div className="nbd-contact-head">
            <span className="nbd-avatar" aria-hidden="true">{contact.name.trim().charAt(0).toUpperCase()}</span>
            <span className="nbd-row-text">
              <strong>{contact.name}{contact.company && <em className="nbd-company"> · {contact.company}</em>}</strong>
              <span>{contact.requests.length} échange{contact.requests.length > 1 ? 's' : ''} · dernier le {dayFr(contact.last)}{signed > 0 && ` · ${euros(signed)} signés`}</span>
              {(contact.followUp || due) && <span className="nbd-reminder"><Bell aria-hidden="true" />{due ?? `Relance prévue le ${dayFr(contact.followUp as string)}`}</span>}
            </span>
            <span className="nbd-contact-links">
              <a className="nbd-btn nbd-btn-light" href={`mailto:${contact.email}`}><Mail aria-hidden="true" />{contact.email}</a>
              {contact.phone && <a className="nbd-btn nbd-btn-light" href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}><Phone aria-hidden="true" />{contact.phone}</a>}
            </span>
          </div>
          <ul className="nbd-history nbd-contact-history">
            {contact.requests.map((request) => <li key={request.id}>
              <time>{dateFr(request.created_at)}</time>
              <button type="button" className="nbd-link" onClick={() => onOpen(request.id)}>{request.insights.pathLabel ?? 'Message'}</button>
              <span className={`nbd-status nbd-status-${request.status}`}>{statusLabel(request.status)}</span>
              {request.archived && <span className="nbd-tag">Archivée</span>}
            </li>)}
          </ul>
        </li>
      })}
    </ul>}
  </>
}
