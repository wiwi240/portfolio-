import { useState } from 'react'
import { Header, type RequestsContext } from './admin-requests'
import { SIZES, STATUSES, WON, euros, patchRequest, reminder, type RequestItem, type RequestStatus } from './admin-api'

const sum = (rows: RequestItem[]) => rows.reduce((total, item) => total + (item.amount ?? 0), 0)

// Columns by status. Cards move with the select (keyboard friendly) or by drag and drop.
export function Pipeline({ ctx }: { ctx: RequestsContext }) {
  const { items, settings, now, onOpen, onChange } = ctx
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState<string | null>(null)
  const [over, setOver] = useState<RequestStatus | null>(null)
  const projects = items.filter((item) => item.insights.kind === 'project' && !item.archived)
  const won = projects.filter((item) => WON.includes(item.status))
  const declined = projects.filter((item) => item.status === 'declined')

  async function move(item: RequestItem, status: RequestStatus) {
    if (item.status === status) return
    setError('')
    const body: Parameters<typeof patchRequest>[1] = { status }
    if (status === 'declined') {
      const reason = window.prompt('Motif du refus (budget, délai, pas le bon profil…) ?', item.decline_reason)
      if (reason === null) return
      body.declineReason = reason.trim().slice(0, 500)
    }
    if (status === 'accepted' && item.amount === null) {
      const raw = window.prompt('Montant signé en € (laisser vide si inconnu) ?', '')
      if (raw === null) return
      const amount = Number(raw.replace(/\s/g, '').replace(',', '.'))
      if (raw.trim() && Number.isInteger(amount) && amount >= 0) body.amount = amount
      else if (raw.trim()) { setError('Montant invalide : entier en euros attendu.'); return }
    }
    try {
      onChange(await patchRequest(item.id, body))
    } catch (failure) {
      setError((failure as Error).message)
    }
  }

  const stats: [string, string][] = [
    ['Chiffre signé', euros(sum(won))],
    ['Devis en attente', euros(sum(projects.filter((item) => item.status === 'quoted')))],
    ['Projets gagnés', String(won.length)],
    ['Taux de réussite', won.length + declined.length ? `${Math.round((won.length / (won.length + declined.length)) * 100)} %` : '—'],
  ]

  return <>
    <Header eyebrow="Espace réservé" title="Pipeline" lead="Déplacez chaque demande d’une colonne à l’autre. Les montants et motifs de refus alimentent vos statistiques." />
    <div className="nbd-stats">{stats.map(([name, value]) => <div key={name} className="nbd-card nbd-stat"><span>{name}</span><strong>{value}</strong></div>)}</div>
    {error && <p role="alert" className="nbd-alert">{error}</p>}
    <div className="nbd-board">
      {STATUSES.map((column) => {
        const cards = projects.filter((item) => item.status === column.id)
        return <section
          key={column.id}
          className={`nbd-column${over === column.id ? ' is-over' : ''}`}
          aria-label={column.label}
          onDragOver={(event) => { event.preventDefault(); setOver(column.id) }}
          onDragLeave={() => setOver((current) => (current === column.id ? null : current))}
          onDrop={(event) => {
            event.preventDefault()
            setOver(null)
            const item = projects.find((row) => String(row.id) === dragging)
            setDragging(null)
            if (item) void move(item, column.id)
          }}
        >
          <header className="nbd-column-head">
            <span className={`nbd-status nbd-status-${column.id}`}>{column.label}</span>
            <span className="nbd-column-count">{cards.length}{sum(cards) > 0 && ` · ${euros(sum(cards))}`}</span>
          </header>
          <ul className="nbd-cards">
            {cards.length === 0 && <li className="nbd-column-empty">Vide</li>}
            {cards.map((item) => {
              const why = reminder(item, now, settings.followUpDays)
              return <li key={item.id} className="nbd-pcard" draggable onDragStart={() => setDragging(String(item.id))} onDragEnd={() => { setDragging(null); setOver(null) }}>
                <button type="button" className="nbd-row-open" onClick={() => onOpen(item.id)}>
                  <strong>{item.name}</strong>
                  <span>{item.insights.projectName || item.insights.activity}</span>
                  <span className="nbd-tags">
                    {item.insights.size && <span className={`nbd-tag nbd-size-${item.insights.size}`}>{SIZES[item.insights.size]}</span>}
                    {item.insights.urgent && <span className="nbd-tag nbd-tag-alert">Urgent</span>}
                    {item.amount !== null && <span className="nbd-tag">{euros(item.amount)}</span>}
                  </span>
                  {why && <span className="nbd-reminder">{why}</span>}
                  {item.status === 'declined' && item.decline_reason && <span className="nbd-note-hint">{item.decline_reason}</span>}
                </button>
                <label className="nbd-pcard-move"><span className="nbd-sr">Déplacer {item.name}</span>
                  <select value={item.status} onChange={(e) => void move(item, e.target.value as RequestStatus)}>{STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
                </label>
              </li>
            })}
          </ul>
        </section>
      })}
    </div>
  </>
}
