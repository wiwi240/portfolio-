import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { Header } from './admin-requests'
import { api, dateFr, type Settings } from './admin-api'

type Health = { database: 'connected' | 'memory' | 'error'; production: boolean; email: boolean; customSender: boolean; google: boolean; requests: number; lastRequestAt: string | null; errors: { at: string; source: string; message: string }[] }

const OK = (ok: boolean, good: string, bad: string) => <span className={`nbd-pill ${ok ? 'is-ok' : 'is-bad'}`}>{ok ? good : bad}</span>

export function SettingsPage({ settings, onSettings, onPurged }: { settings: Settings; onSettings: (settings: Settings) => void; onPurged: () => void }) {
  const [signature, setSignature] = useState(settings.signature)
  const [followUpDays, setFollowUpDays] = useState(String(settings.followUpDays))
  const [feedback, setFeedback] = useState('')
  const [health, setHealth] = useState<Health | null>(null)
  const [healthError, setHealthError] = useState('')
  const [months, setMonths] = useState('12')
  const [purge, setPurge] = useState('')

  useEffect(() => {
    api<Health>('/api/admin/health').then(setHealth).catch((e: Error) => setHealthError(e.message))
  }, [])

  const days = Number(followUpDays)
  const valid = signature.trim().length > 0 && Number.isInteger(days) && days >= 1 && days <= 60

  async function save() {
    setFeedback('Enregistrement…')
    try {
      const { settings: saved } = await api<{ settings: Settings }>('/api/admin/settings', { method: 'PUT', body: { ...settings, signature: signature.trim(), followUpDays: days } })
      onSettings(saved)
      setFeedback('Enregistré.')
    } catch (error) {
      setFeedback((error as Error).message)
    }
  }

  async function runPurge() {
    if (!window.confirm(`Supprimer définitivement les demandes archivées depuis plus de ${months} mois ?`)) return
    try {
      const { deleted } = await api<{ deleted: number }>('/api/admin/purge', { method: 'POST', body: { months: Number(months) } })
      setPurge(`${deleted} demande${deleted > 1 ? 's' : ''} supprimée${deleted > 1 ? 's' : ''}.`)
      onPurged()
    } catch (error) {
      setPurge((error as Error).message)
    }
  }

  return <>
    <Header eyebrow="Espace réservé" title="Paramètres" lead="Vos réglages, l’état du site et la gestion des données personnelles." />
    <div className="nbd-grid-2">
      <section className="nbd-card">
        <h2 className="nbd-h2">Réponses et relances</h2>
        <label className="nbd-field"><span>Signature des modèles de réponse</span><input maxLength={120} value={signature} onChange={(e) => setSignature(e.target.value)} /></label>
        <label className="nbd-field"><span>Relancer un devis sans réponse après (jours)</span><input type="number" min="1" max="60" value={followUpDays} onChange={(e) => setFollowUpDays(e.target.value)} /></label>
        <div className="nbd-actions">
          <button type="button" className="nbd-btn" disabled={!valid} onClick={save}>Enregistrer</button>
          <span role="status" className="nbd-feedback">{feedback}</span>
        </div>
      </section>

      <section className="nbd-card">
        <h2 className="nbd-h2">Santé du site</h2>
        {healthError && <p role="alert" className="nbd-alert">{healthError}</p>}
        {!health && !healthError && <p className="nbd-muted">Chargement…</p>}
        {health && <ul className="nbd-health">
          <li><span>Base de données</span>{health.database === 'connected' ? OK(true, 'Connectée', '') : health.database === 'memory' ? <span className={`nbd-pill ${health.production ? 'is-bad' : 'is-warn'}`}>Mémoire : rien n’est conservé</span> : OK(false, '', 'Erreur')}</li>
          <li><span>Mail de notification</span>{OK(health.email, 'Configuré', 'Non configuré')}</li>
          <li><span>Expéditeur personnalisé</span>{OK(health.customSender, 'Oui', 'Expéditeur de test')}</li>
          <li><span>Connexion Google</span>{OK(health.google, 'Configurée', 'Incomplète')}</li>
          <li><span>Demandes enregistrées</span><strong>{health.requests}</strong></li>
          <li><span>Dernière demande</span><strong>{health.lastRequestAt ? dateFr(health.lastRequestAt) : '—'}</strong></li>
        </ul>}
        {health && <>
          <h3 className="nbd-h3">Dernières erreurs</h3>
          {health.errors.length === 0 ? <p className="nbd-muted">Aucune erreur depuis le dernier démarrage.</p> : <ul className="nbd-history">{health.errors.map((e, i) => <li key={i}><time>{dateFr(e.at)}</time>{e.source} : {e.message}</li>)}</ul>}
        </>}
      </section>

      <section className="nbd-card">
        <h2 className="nbd-h2">Données personnelles</h2>
        <p className="nbd-lead">Exportez toutes les demandes, ou supprimez celles que vous avez archivées pour limiter la durée de conservation. Une demande d’effacement d’un visiteur se traite depuis sa fiche, avec « Supprimer ».</p>
        <div className="nbd-actions"><a className="nbd-btn nbd-btn-light" href="/api/admin/requests.csv"><Download aria-hidden="true" />Exporter en CSV</a></div>
        <div className="nbd-actions">
          <label className="nbd-select"><span className="nbd-sr">Ancienneté</span>
            <select value={months} onChange={(e) => setMonths(e.target.value)}>{[3, 6, 12, 24, 36].map((m) => <option key={m} value={m}>Archivées depuis {m}+ mois</option>)}</select>
          </label>
          <button type="button" className="nbd-btn nbd-btn-danger" onClick={runPurge}>Supprimer</button>
        </div>
        <span role="status" className="nbd-feedback">{purge}</span>
      </section>
    </div>
  </>
}
