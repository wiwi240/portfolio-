import { forgetAdmin, rememberAdmin } from '@/lib/admin-hint'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AdminDashboard } from '@/components/admin-dashboard'
import { api, type RequestItem, type Settings } from '@/components/admin-api'
import '../neobrutalism.css'
import './admin-page.css'

type GoogleId = { initialize: (o: { client_id: string; nonce?: string; callback: (r: { credential: string }) => void }) => void; renderButton: (el: HTMLElement, o: Record<string, string>) => void }
declare global { interface Window { google?: { accounts: { id: GoogleId } } } }

const GIS = 'https://accounts.google.com/gsi/client'

function loadGoogle() {
  return new Promise<void>((resolve, reject) => {
    if (window.google) return resolve()
    const script = document.createElement('script')
    script.src = GIS
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Google indisponible'))
    document.head.appendChild(script)
  })
}

export function AdminPage() {
  const [state, setState] = useState<'loading' | 'out' | 'in' | 'unconfigured'>('loading')
  const [items, setItems] = useState<RequestItem[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [error, setError] = useState('')
  const buttonRef = useRef<HTMLDivElement>(null)

  // Requests and settings load together: the dashboard needs both (reminders depend on the follow-up delay).
  const fetchAll = useCallback(async () => {
    const response = await fetch('/api/admin/requests', { credentials: 'same-origin' })
    if (response.status === 401) return null
    const loaded = (await response.json()).items as RequestItem[]
    const stored = await api<{ settings: Settings }>('/api/admin/settings')
    return { items: loaded, settings: stored.settings }
  }, [])
  const loadRequests = useCallback(() => fetchAll().then((data) => {
    if (!data) return setState('out')
    setItems(data.items)
    setSettings(data.settings)
    setState('in')
  }), [fetchAll])

  useEffect(() => {
    if (state === 'in') rememberAdmin()
    else if (state === 'out') forgetAdmin()
  }, [state])

  useEffect(() => {
    document.title = 'Admin'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    fetchAll().then((data) => {
      if (!data) return setState('out')
      setItems(data.items)
      setSettings(data.settings)
      setState('in')
    }).catch(() => setState('out'))
    return () => { meta.remove() }
  }, [fetchAll])

  useEffect(() => {
    if (state !== 'out') return
    let cancelled = false
    ;(async () => {
      const { clientId, nonce } = await (await fetch('/api/auth/config')).json()
      if (!clientId) { setState('unconfigured'); return }
      await loadGoogle()
      if (cancelled || !buttonRef.current || !window.google) return
      window.google.accounts.id.initialize({
        client_id: clientId,
        nonce,
        callback: async ({ credential }) => {
          const response = await fetch('/api/auth/google', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential, nonce }) })
          if (!response.ok) { setError('Ce compte Google n’a pas accès à cet espace.'); return }
          setError('')
          await loadRequests()
        },
      })
      window.google.accounts.id.renderButton(buttonRef.current, { theme: 'outline', size: 'large', locale: 'fr' })
    })().catch((e: Error) => setError(e.message))
    return () => { cancelled = true }
  }, [state, loadRequests])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setItems([])
    setState('out')
  }

  if (state !== 'in' || !settings) {
    return <main className="admin-page">
      <h1>Espace réservé</h1>
      {state === 'loading' && <p>Chargement…</p>}
      {state === 'unconfigured' && <p>Connexion non configurée (GOOGLE_CLIENT_ID, SESSION_SECRET, ADMIN_EMAIL).</p>}
      {state === 'out' && <><p>Connexion réservée au propriétaire du site.</p><div ref={buttonRef} />{error && <p role="alert">{error}</p>}</>}
    </main>
  }

  return <AdminDashboard
    items={items}
    settings={settings}
    onSettings={setSettings}
    onLogout={logout}
    onReload={() => { loadRequests().catch(() => setState('out')) }}
    onChange={(item) => setItems((all) => all.map((row) => (row.id === item.id ? item : row)))}
    onDelete={(id) => setItems((all) => all.filter((row) => row.id !== id))}
  />
}
