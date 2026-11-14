import { useEffect, useState } from 'react'
import { Header } from './admin-requests'
import { api, euros } from './admin-api'

type Counted = { label: string; count: number }
type Stats = {
  funnel: { visits: number; guideStarts: number; requestsSent: number; startRate: number; sendRate: number }
  audiences: { client: number; recruiter: number; unknown: number }
  steps: { step: number; count: number }[]
  perWeek: { week: string; count: number }[]
  paths: Counted[]
  features: Counted[]
  budgets: Counted[]
  declineReasons: Counted[]
  revenue: { signed: number; pipeline: number; wonCount: number; declinedCount: number; winRate: number | null }
  averageResponseHours: number | null
}

const pct = (value: number) => `${Math.round(value * 100)} %`

function Bars({ rows, empty = 'Pas encore de données.' }: { rows: Counted[]; empty?: string }) {
  const max = Math.max(1, ...rows.map((row) => row.count))
  if (rows.length === 0) return <p className="nbd-muted">{empty}</p>
  return <ul className="nbd-bars">{rows.map((row) => <li key={row.label}>
    <span className="nbd-bar-label">{row.label}</span>
    <span className="nbd-bar-track"><span className="nbd-bar-fill" style={{ width: `${(row.count / max) * 100}%` }} /></span>
    <span className="nbd-bar-value">{row.count}</span>
  </li>)}</ul>
}

export function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    api<{ stats: Stats }>('/api/admin/stats').then((r) => setStats(r.stats)).catch((e: Error) => setError(e.message))
  }, [])

  if (error) return <><Header eyebrow="Espace réservé" title="Statistiques" /><p role="alert" className="nbd-alert">{error}</p></>
  if (!stats) return <><Header eyebrow="Espace réservé" title="Statistiques" /><p className="nbd-empty">Chargement…</p></>

  const { funnel, revenue } = stats
  const cards: [string, string][] = [
    ['Chiffre signé', euros(revenue.signed)],
    ['Devis en attente', euros(revenue.pipeline)],
    ['Taux de réussite', revenue.winRate === null ? '—' : pct(revenue.winRate)],
    ['Délai de 1re réponse', stats.averageResponseHours === null ? '—' : stats.averageResponseHours < 48 ? `${Math.round(stats.averageResponseHours)} h` : `${Math.round(stats.averageResponseHours / 24)} j`],
  ]

  return <>
    <Header eyebrow="Espace réservé" title="Statistiques" lead="Visites et conversion sur les 30 derniers jours, puis ce que vos demandes racontent. Les visites sont comptées sans cookie ni identifiant." />
    <div className="nbd-stats">{cards.map(([name, value]) => <div key={name} className="nbd-card nbd-stat"><span>{name}</span><strong>{value}</strong></div>)}</div>
    <div className="nbd-grid-2">
      <section className="nbd-card">
        <h2 className="nbd-h2">Entonnoir de conversion (30 jours)</h2>
        <Bars rows={[{ label: 'Visites', count: funnel.visits }, { label: 'Guide ouvert', count: funnel.guideStarts }, { label: 'Demandes envoyées', count: funnel.requestsSent }]} />
        <p className="nbd-muted">{funnel.visits ? `${pct(funnel.startRate)} des visiteurs ouvrent le guide` : 'Aucune visite enregistrée.'}{funnel.guideStarts ? `, ${pct(funnel.sendRate)} de ceux-là envoient une demande.` : ''}</p>
      </section>
      <section className="nbd-card">
        <h2 className="nbd-h2">Profil des visiteurs</h2>
        <Bars rows={[{ label: 'Clients', count: stats.audiences.client }, { label: 'Recruteurs', count: stats.audiences.recruiter }, { label: 'Sans choix', count: stats.audiences.unknown }]} />
        <h3 className="nbd-h3">Dernière étape du guide atteinte</h3>
        <Bars rows={stats.steps.map((s) => ({ label: `Étape ${s.step}`, count: s.count }))} empty="Personne n’a encore ouvert le guide." />
      </section>
      <section className="nbd-card">
        <h2 className="nbd-h2">Demandes par semaine</h2>
        <Bars rows={stats.perWeek.map((w) => ({ label: `Sem. du ${new Date(`${w.week}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`, count: w.count }))} />
      </section>
      <section className="nbd-card">
        <h2 className="nbd-h2">Parcours choisis</h2>
        <Bars rows={stats.paths} />
      </section>
      <section className="nbd-card">
        <h2 className="nbd-h2">Fonctionnalités les plus demandées</h2>
        <Bars rows={stats.features} />
      </section>
      <section className="nbd-card">
        <h2 className="nbd-h2">Budgets annoncés</h2>
        <Bars rows={stats.budgets} />
      </section>
      <section className="nbd-card">
        <h2 className="nbd-h2">Motifs de refus</h2>
        <Bars rows={stats.declineReasons} empty="Aucun refus renseigné." />
      </section>
    </div>
  </>
}
