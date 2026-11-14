export type RequestStatus = 'new' | 'discussing' | 'quoted' | 'accepted' | 'declined' | 'inprogress' | 'delivered' | 'maintenance'
export type Audience = 'client' | 'recruiter' | 'other'
export type Size = 'small' | 'medium' | 'large'

export type Insights = {
  kind: 'project' | 'message'
  pathLabel?: string
  activity?: string
  projectName?: string
  budget?: string
  deadline?: string
  wantedCount?: number
  discussCount?: number
  score?: number
  size?: Size
  urgent?: boolean
  alerts: { id: string; label: string }[]
  questions: string[]
  wanted?: string[]
}

export type HistoryEntry = { at: string; type: 'status' | 'archived' | 'restored'; from?: RequestStatus; to?: RequestStatus }

export type RequestItem = {
  id: number | string
  name: string
  email: string
  message: string
  status: RequestStatus
  notes: string
  company: string
  phone: string
  audience: Audience
  amount: number | null
  decline_reason: string
  follow_up_at: string | null
  archived: boolean
  history: HistoryEntry[]
  created_at: string
  updated_at: string
  insights: Insights
}

export type RequestPatch = Partial<{
  status: RequestStatus
  notes: string
  amount: number | null
  declineReason: string
  followUpAt: string | null
  company: string
  phone: string
  audience: Audience
  archived: boolean
}>

export type Availability = {
  duration: number
  noticeHours: number
  horizonDays: number
  days: Record<string, { start: string; end: string }>
  blocked: string[]
}
export type Settings = { signature: string; followUpDays: number; availability: Availability }
export type Appointment = { id: number | string; name: string; email: string; topic: string; starts_at: string; status: 'pending' | 'confirmed' | 'cancelled'; created_at: string }

export const STATUSES: { id: RequestStatus; label: string }[] = [
  { id: 'new', label: 'Nouvelle' },
  { id: 'discussing', label: 'En discussion' },
  { id: 'quoted', label: 'Devis envoyé' },
  { id: 'accepted', label: 'Acceptée' },
  { id: 'inprogress', label: 'En cours' },
  { id: 'delivered', label: 'Livrée' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'declined', label: 'Refusée' },
]
export const WON: RequestStatus[] = ['accepted', 'inprogress', 'delivered', 'maintenance']
export const AUDIENCES: { id: Audience; label: string }[] = [
  { id: 'client', label: 'Client' },
  { id: 'recruiter', label: 'Recruteur' },
  { id: 'other', label: 'Autre' },
]
export const SIZES: Record<Size, string> = { small: 'Petit', medium: 'Moyen', large: 'Gros' }
export const DECLINE_REASONS = ['Budget', 'Délai', 'Pas le bon profil', 'Pas de suite', 'Autre prestataire']

export const statusLabel = (status: RequestStatus) => STATUSES.find((s) => s.id === status)?.label ?? status
export const audienceLabel = (audience: Audience) => AUDIENCES.find((a) => a.id === audience)?.label ?? audience
export const dateFr = (iso: string) => new Date(iso).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
export const dayFr = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { dateStyle: 'medium' })
export const euros = (amount: number | null | undefined) => (amount === null || amount === undefined ? '—' : `${amount.toLocaleString('fr-FR')} €`)
export const isProject = (item: RequestItem) => item.insights.kind === 'project'

const DAY = 24 * 3600 * 1000

// Why a request needs attention today, or null. Pure: `now` is passed in so the list stays predictable.
export function reminder(item: RequestItem, now: number, followUpDays: number): string | null {
  if (item.archived || item.status === 'declined' || !['new', 'discussing', 'quoted'].includes(item.status)) return null
  if (item.follow_up_at && new Date(`${item.follow_up_at}T23:59:59`).getTime() <= now) return `Relance prévue le ${dayFr(item.follow_up_at)}`
  if (item.follow_up_at) return null
  const since = (type: RequestStatus) => {
    const entry = [...item.history].reverse().find((h) => h.type === 'status' && h.to === type)
    return new Date(entry?.at ?? item.updated_at ?? item.created_at).getTime()
  }
  if (item.status === 'new' && now - new Date(item.created_at).getTime() >= 2 * DAY) return `Sans réponse depuis ${Math.floor((now - new Date(item.created_at).getTime()) / DAY)} j`
  if (item.status === 'quoted' && now - since('quoted') >= followUpDays * DAY) return `Devis envoyé il y a ${Math.floor((now - since('quoted')) / DAY)} j, à relancer`
  return null
}

export async function api<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const response = await fetch(path, {
    method: init?.method ?? 'GET',
    credentials: 'same-origin',
    headers: init?.body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: init?.body === undefined ? undefined : JSON.stringify(init.body),
  })
  if (response.status === 401) throw new Error('Session expirée : reconnectez-vous.')
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).message || 'Une erreur est survenue.')
  return (response.status === 204 ? undefined : await response.json()) as T
}

export const patchRequest = (id: RequestItem['id'], body: RequestPatch) => api<{ item: RequestItem }>(`/api/admin/requests/${id}`, { method: 'PATCH', body }).then((r) => r.item)
