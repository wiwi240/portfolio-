import { useEffect, useState } from 'react'
import { AlertTriangle, Archive, ArchiveRestore, ArrowLeft, Bell, Copy, Download, FileDown, Mail, Search, Trash2 } from 'lucide-react'
import { ThemeSwitch } from '@/components/ui/theme-switch'
import {
  AUDIENCES, DECLINE_REASONS, SIZES, STATUSES, api, audienceLabel, dateFr, dayFr, euros, isProject, patchRequest, reminder, statusLabel,
  type Audience, type RequestItem, type RequestPatch, type RequestStatus, type Settings, type Size,
} from './admin-api'

export type RequestsContext = {
  items: RequestItem[]
  settings: Settings
  now: number
  onOpen: (id: RequestItem['id']) => void
  onChange: (item: RequestItem) => void
  onDelete: (id: RequestItem['id']) => void
}

export function Header({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return <header className="nbd-header">
    <div>
      <span className="nbd-eyebrow">{eyebrow}</span>
      <h1 className="nbd-title">{title}</h1>
      {lead && <p className="nbd-lead">{lead}</p>}
    </div>
    <ThemeSwitch className="nbd-theme" />
  </header>
}

type SortKey = 'recent' | 'oldest' | 'urgent' | 'size' | 'name'
const SORTS: { id: SortKey; label: string }[] = [
  { id: 'recent', label: 'Plus récentes' },
  { id: 'oldest', label: 'Plus anciennes' },
  { id: 'urgent', label: 'À traiter d’abord' },
  { id: 'size', label: 'Plus gros projets' },
  { id: 'name', label: 'Nom' },
]

export function RequestsList({ kind, ctx }: { kind: 'project' | 'message'; ctx: RequestsContext }) {
  const { items, settings, now, onOpen } = ctx
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | RequestStatus>('all')
  const [path, setPath] = useState('all')
  const [size, setSize] = useState<'all' | Size>('all')
  const [budget, setBudget] = useState<'all' | 'with' | 'without'>('all')
  const [urgentOnly, setUrgentOnly] = useState(false)
  const [archived, setArchived] = useState(false)
  const [sort, setSort] = useState<SortKey>('recent')

  const ofKind = items.filter((item) => (kind === 'project') === isProject(item))
  const active = ofKind.filter((item) => !item.archived)
  const pending = active.filter((item) => reminder(item, now, settings.followUpDays)).length
  const lastWeek = active.filter((item) => now - new Date(item.created_at).getTime() < 7 * 24 * 3600 * 1000).length
  const paths = [...new Set(active.map((item) => item.insights.pathLabel).filter((label): label is string => Boolean(label)))]
  const needle = query.trim().toLowerCase()

  const visible = (() => {
    const rank = (item: RequestItem) => (item.status === 'new' ? 4 : 0) + (item.insights.urgent ? 3 : 0) + (reminder(item, now, settings.followUpDays) ? 2 : 0)
    return ofKind
      .filter((item) => item.archived === archived)
      .filter((item) => status === 'all' || item.status === status)
      .filter((item) => path === 'all' || item.insights.pathLabel === path)
      .filter((item) => size === 'all' || item.insights.size === size)
      .filter((item) => budget === 'all' || (budget === 'with') === Boolean(item.insights.budget))
      .filter((item) => !urgentOnly || item.insights.urgent)
      .filter((item) => !needle || `${item.name} ${item.email} ${item.company} ${item.message}`.toLowerCase().includes(needle))
      .sort((a, b) => {
        if (sort === 'oldest') return a.created_at.localeCompare(b.created_at)
        if (sort === 'name') return a.name.localeCompare(b.name, 'fr')
        if (sort === 'size') return (b.insights.score ?? 0) - (a.insights.score ?? 0)
        if (sort === 'urgent') return rank(b) - rank(a) || b.created_at.localeCompare(a.created_at)
        return b.created_at.localeCompare(a.created_at)
      })
  })()

  const title = kind === 'project' ? 'Demandes de projet' : 'Messages'
  const stats: [string, number][] = [['Total', active.length], ['Nouvelles', active.filter((i) => i.status === 'new').length], ['À relancer', pending], ['7 derniers jours', lastWeek]]

  return <>
    <Header
      eyebrow="Espace réservé"
      title={title}
      lead={kind === 'project' ? 'Les demandes reçues depuis le configurateur, triées par ce qui mérite votre attention.' : 'Les messages simples, sans projet à chiffrer : recruteurs, questions, prises de contact.'}
    />
    <div className="nbd-stats">
      {stats.map(([name, value]) => <div key={name} className="nbd-card nbd-stat"><span>{name}</span><strong>{value}</strong></div>)}
    </div>
    <div className="nbd-toolbar">
      <label className="nbd-search"><Search aria-hidden="true" /><span className="nbd-sr">Rechercher</span><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un nom, un email, un besoin…" /></label>
      <Select label="Statut" value={status} onChange={(v) => setStatus(v as typeof status)} options={[['all', 'Tous les statuts'], ...STATUSES.map((s) => [s.id, s.label] as [string, string])]} />
      {kind === 'project' && <>
        <Select label="Parcours" value={path} onChange={setPath} options={[['all', 'Tous les parcours'], ...paths.map((p) => [p, p] as [string, string])]} />
        <Select label="Taille" value={size} onChange={(v) => setSize(v as typeof size)} options={[['all', 'Toutes tailles'], ...Object.entries(SIZES)]} />
        <Select label="Budget" value={budget} onChange={(v) => setBudget(v as typeof budget)} options={[['all', 'Tous budgets'], ['with', 'Budget indiqué'], ['without', 'Sans budget']]} />
      </>}
      <Select label="Tri" value={sort} onChange={(v) => setSort(v as SortKey)} options={SORTS.map((s) => [s.id, s.label])} />
    </div>
    <div className="nbd-toolbar nbd-toolbar-flags">
      {kind === 'project' && <label className="nbd-check"><input type="checkbox" checked={urgentOnly} onChange={(e) => setUrgentOnly(e.target.checked)} />Urgentes seulement</label>}
      <label className="nbd-check"><input type="checkbox" checked={archived} onChange={(e) => setArchived(e.target.checked)} />Voir les archivées</label>
      <a className="nbd-btn nbd-btn-light nbd-push" href="/api/admin/requests.csv"><Download aria-hidden="true" />Exporter en CSV</a>
    </div>
    {ofKind.length === 0 ? <p className="nbd-empty">{kind === 'project' ? 'Aucune demande pour le moment.' : 'Aucun message pour le moment.'}</p>
      : visible.length === 0 ? <p className="nbd-empty">Rien ne correspond à ces filtres.</p>
      : <ul className="nbd-list">
        {visible.map((item) => {
          const why = reminder(item, now, settings.followUpDays)
          return <li key={item.id} className="nbd-row">
            <button type="button" className="nbd-row-main nbd-row-open" onClick={() => onOpen(item.id)} aria-label={`Ouvrir la demande de ${item.name}`}>
              <span className="nbd-avatar" aria-hidden="true">{item.name.trim().charAt(0).toUpperCase()}</span>
              <span className="nbd-row-text">
                <strong>{item.name}{item.company && <em className="nbd-company"> · {item.company}</em>}</strong>
                <span>{item.email} · {dateFr(item.created_at)}</span>
                <Tags item={item} />
                {why && <span className="nbd-reminder"><Bell aria-hidden="true" />{why}</span>}
                {item.notes && <span className="nbd-note-hint">Note : {item.notes}</span>}
              </span>
            </button>
            <span className={`nbd-status nbd-status-${item.status}`}>{statusLabel(item.status)}</span>
            {isProject(item) && <a className="nbd-btn" href={`/api/admin/requests/${item.id}/pdf`}><FileDown aria-hidden="true" />PDF</a>}
          </li>
        })}
      </ul>}
  </>
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) {
  return <label className="nbd-select"><span className="nbd-sr">{label}</span>
    <select value={value} onChange={(e) => onChange(e.target.value)}>{options.map(([id, text]) => <option key={id} value={id}>{text}</option>)}</select>
  </label>
}

function Tags({ item }: { item: RequestItem }) {
  const { insights } = item
  const attention = insights.alerts.filter((a) => a.id !== 'urgent').length
  return <span className="nbd-tags">
    {item.audience !== 'client' && <span className="nbd-tag">{audienceLabel(item.audience)}</span>}
    {insights.pathLabel && <span className="nbd-tag">{insights.pathLabel}</span>}
    {insights.size && <span className={`nbd-tag nbd-size-${insights.size}`}>{SIZES[insights.size]} projet</span>}
    {insights.budget && <span className="nbd-tag">{insights.budget}</span>}
    {insights.urgent && <span className="nbd-tag nbd-tag-alert">Urgent</span>}
    {attention > 0 && <span className="nbd-tag nbd-tag-warn" title={insights.alerts.map((a) => a.label).join('\n')}><AlertTriangle aria-hidden="true" />{attention} point{attention > 1 ? 's' : ''} d’attention</span>}
    {item.amount !== null && <span className="nbd-tag">{euros(item.amount)}</span>}
  </span>
}

const mailto = (email: string, subject: string, body = '') => `mailto:${email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`

type Draft = { templates: { id: string; label: string; subject: string; body: string }[]; proposal: string }

export function RequestDetail({ item, ctx, onBack }: { item: RequestItem; ctx: RequestsContext; onBack: () => void }) {
  const { items, settings, now, onChange, onDelete, onOpen } = ctx
  const [form, setForm] = useState({ amount: item.amount === null ? '' : String(item.amount), declineReason: item.decline_reason, followUpAt: item.follow_up_at ?? '', company: item.company, phone: item.phone, notes: item.notes })
  const [feedback, setFeedback] = useState('')
  const [draft, setDraft] = useState<Draft | null>(null)
  const [templateId, setTemplateId] = useState('ack')
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState('')

  useEffect(() => {
    let cancelled = false
    api<Draft>(`/api/admin/requests/${item.id}/draft`).then((result) => { if (!cancelled) setDraft(result) }).catch(() => undefined)
    return () => { cancelled = true }
  }, [item.id, settings.signature])

  const project = isProject(item)
  const why = reminder(item, now, settings.followUpDays)
  const others = items.filter((row) => row.id !== item.id && row.email.toLowerCase() === item.email.toLowerCase())
  const amountValue = form.amount.trim() === '' ? null : Number(form.amount)
  const amountValid = amountValue === null || (Number.isInteger(amountValue) && amountValue >= 0)
  const changes: RequestPatch = {}
  if (amountValid && amountValue !== item.amount) changes.amount = amountValue
  if (form.declineReason !== item.decline_reason) changes.declineReason = form.declineReason
  if ((form.followUpAt || null) !== item.follow_up_at) changes.followUpAt = form.followUpAt || null
  if (form.company !== item.company) changes.company = form.company
  if (form.phone !== item.phone) changes.phone = form.phone
  if (form.notes !== item.notes) changes.notes = form.notes
  const dirty = Object.keys(changes).length > 0

  async function save(body: RequestPatch) {
    setFeedback('Enregistrement…')
    try {
      onChange(await patchRequest(item.id, body))
      setFeedback('Enregistré.')
    } catch (error) {
      setFeedback((error as Error).message)
    }
  }

  async function remove() {
    if (!window.confirm(`Supprimer définitivement la demande de ${item.name} ? Cette action est irréversible.`)) return
    try {
      await api(`/api/admin/requests/${item.id}`, { method: 'DELETE' })
      onDelete(item.id)
      onBack()
    } catch (error) {
      setFeedback((error as Error).message)
    }
  }

  async function copy(key: string, text: string) {
    try { await navigator.clipboard.writeText(text); setCopied(key) } catch { setCopied('') }
    window.setTimeout(() => setCopied(''), 1500)
  }

  const template = draft?.templates.find((t) => t.id === templateId)
  const templateBody = template ? edits[`t-${template.id}`] ?? template.body : ''
  const proposal = edits.proposal ?? draft?.proposal ?? ''
  const field = (key: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [key]: value }))

  return <>
    <button type="button" className="nbd-btn nbd-btn-light nbd-back" onClick={onBack}><ArrowLeft aria-hidden="true" />Retour</button>
    <header className="nbd-header nbd-detail-header">
      <div>
        <span className={`nbd-status nbd-status-${item.status}`}>{statusLabel(item.status)}</span>
        <h1 className="nbd-title">{item.name}</h1>
        <p className="nbd-lead"><a href={mailto(item.email, 'Votre projet')}>{item.email}</a>{item.phone && <> · {item.phone}</>}{item.company && <> · {item.company}</>} · reçue le {dateFr(item.created_at)}</p>
        <Tags item={item} />
        {why && <p className="nbd-reminder nbd-reminder-big"><Bell aria-hidden="true" />{why}</p>}
      </div>
      <ThemeSwitch className="nbd-theme" />
    </header>
    <div className="nbd-actions">
      <a className="nbd-btn" href={mailto(item.email, template?.subject ?? 'Votre projet', templateBody)}><Mail aria-hidden="true" />Répondre</a>
      {project && <a className="nbd-btn" href={`/api/admin/requests/${item.id}/pdf`}><FileDown aria-hidden="true" />Télécharger le PDF</a>}
      <button type="button" className="nbd-btn nbd-btn-light" onClick={() => save({ archived: !item.archived })}>{item.archived ? <><ArchiveRestore aria-hidden="true" />Restaurer</> : <><Archive aria-hidden="true" />Archiver</>}</button>
      <button type="button" className="nbd-btn nbd-btn-danger" onClick={remove}><Trash2 aria-hidden="true" />Supprimer</button>
    </div>

    <div className="nbd-detail">
      <div className="nbd-stack">
        <section className="nbd-card">
          <h2 className="nbd-h2">Demande</h2>
          <pre className="nbd-pre">{item.message}</pre>
        </section>

        {project && (item.insights.alerts.length > 0 || item.insights.questions.length > 0) && <section className="nbd-card">
          <h2 className="nbd-h2">À regarder avant de répondre</h2>
          {item.insights.alerts.length > 0 && <ul className="nbd-alerts">{item.insights.alerts.map((a) => <li key={a.id}><AlertTriangle aria-hidden="true" />{a.label}</li>)}</ul>}
          {item.insights.questions.length > 0 && <>
            <h3 className="nbd-h3">Questions à poser</h3>
            <ul className="nbd-questions">{item.insights.questions.map((q) => <li key={q}>{q}</li>)}</ul>
            <button type="button" className="nbd-btn nbd-btn-light" onClick={() => copy('questions', item.insights.questions.map((q) => `- ${q}`).join('\n'))}><Copy aria-hidden="true" />{copied === 'questions' ? 'Copié' : 'Copier les questions'}</button>
          </>}
        </section>}

        <section className="nbd-card">
          <h2 className="nbd-h2">Modèle de réponse</h2>
          {!draft ? <p className="nbd-lead">Chargement…</p> : <>
            <label className="nbd-field"><span>Modèle</span>
              <select value={templateId} onChange={(e) => setTemplateId(e.target.value)}>{draft.templates.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</select>
            </label>
            <label className="nbd-field"><span>Message (modifiable avant envoi)</span>
              <textarea rows={10} value={templateBody} onChange={(e) => template && setEdits((c) => ({ ...c, [`t-${template.id}`]: e.target.value }))} />
            </label>
            <div className="nbd-actions">
              <a className="nbd-btn" href={mailto(item.email, template?.subject ?? '', templateBody)}><Mail aria-hidden="true" />Ouvrir dans ma messagerie</a>
              <button type="button" className="nbd-btn nbd-btn-light" onClick={() => copy('template', templateBody)}><Copy aria-hidden="true" />{copied === 'template' ? 'Copié' : 'Copier'}</button>
            </div>
          </>}
        </section>

        {project && draft?.proposal && <section className="nbd-card">
          <h2 className="nbd-h2">Brouillon de proposition</h2>
          <p className="nbd-lead">Périmètre en deux phases tiré du configurateur. Les prix restent à compléter par vos soins.</p>
          <label className="nbd-field"><span className="nbd-sr">Proposition</span>
            <textarea rows={18} value={proposal} onChange={(e) => setEdits((c) => ({ ...c, proposal: e.target.value }))} />
          </label>
          <div className="nbd-actions">
            <a className="nbd-btn" href={mailto(item.email, `Proposition pour ${item.insights.projectName || item.insights.activity || 'votre projet'}`, proposal)}><Mail aria-hidden="true" />Envoyer par mail</a>
            <button type="button" className="nbd-btn nbd-btn-light" onClick={() => copy('proposal', proposal)}><Copy aria-hidden="true" />{copied === 'proposal' ? 'Copié' : 'Copier'}</button>
          </div>
        </section>}
      </div>

      <div className="nbd-stack">
        <section className="nbd-card">
          <h2 className="nbd-h2">Suivi</h2>
          <label className="nbd-field"><span>Statut</span>
            <select value={item.status} onChange={(e) => save({ status: e.target.value as RequestStatus })}>{STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
          </label>
          <label className="nbd-field"><span>Profil</span>
            <select value={item.audience} onChange={(e) => save({ audience: e.target.value as Audience })}>{AUDIENCES.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}</select>
          </label>
          {item.status === 'declined' && <label className="nbd-field"><span>Motif du refus</span>
            <input list="decline-reasons" maxLength={500} value={form.declineReason} onChange={(e) => field('declineReason')(e.target.value)} placeholder="Budget, délai, pas le bon profil…" />
            <datalist id="decline-reasons">{DECLINE_REASONS.map((r) => <option key={r} value={r} />)}</datalist>
          </label>}
          <label className="nbd-field"><span>Montant (€) {WON_HINT[item.status] && <small>{WON_HINT[item.status]}</small>}</span>
            <input type="number" min="0" step="1" inputMode="numeric" value={form.amount} onChange={(e) => field('amount')(e.target.value)} aria-invalid={!amountValid} />
          </label>
          <label className="nbd-field"><span>Relance prévue le</span>
            <input type="date" value={form.followUpAt} onChange={(e) => field('followUpAt')(e.target.value)} />
          </label>
          <label className="nbd-field"><span>Entreprise</span><input maxLength={160} value={form.company} onChange={(e) => field('company')(e.target.value)} /></label>
          <label className="nbd-field"><span>Téléphone</span><input type="tel" maxLength={30} value={form.phone} onChange={(e) => field('phone')(e.target.value)} /></label>
          <label className="nbd-field"><span>Notes privées</span>
            <textarea rows={6} maxLength={5000} value={form.notes} onChange={(e) => field('notes')(e.target.value)} placeholder="Ce que vous vous êtes dit, relance à prévoir…" />
          </label>
          <div className="nbd-actions">
            <button type="button" className="nbd-btn" disabled={!dirty || !amountValid} onClick={() => save(changes)}>Enregistrer</button>
            <span role="status" className="nbd-feedback">{feedback}</span>
          </div>
        </section>

        <section className="nbd-card">
          <h2 className="nbd-h2">Historique</h2>
          <ul className="nbd-history">
            <li><time>{dateFr(item.created_at)}</time>Demande reçue</li>
            {item.history.map((entry, index) => <li key={index}><time>{dateFr(entry.at)}</time>{entry.type === 'status' ? `${statusLabel(entry.from as RequestStatus)} → ${statusLabel(entry.to as RequestStatus)}` : entry.type === 'archived' ? 'Archivée' : 'Restaurée'}</li>)}
          </ul>
        </section>

        {others.length > 0 && <section className="nbd-card">
          <h2 className="nbd-h2">Autres demandes de cette personne</h2>
          <ul className="nbd-history">{others.map((row) => <li key={row.id}><button type="button" className="nbd-link" onClick={() => onOpen(row.id)}>{dayFr(row.created_at)} · {statusLabel(row.status)}</button></li>)}</ul>
        </section>}
      </div>
    </div>
  </>
}

const WON_HINT: Partial<Record<RequestStatus, string>> = { quoted: '(montant du devis)', accepted: '(montant signé)', inprogress: '(montant signé)', delivered: '(montant signé)', maintenance: '(montant mensuel ou annuel)' }
