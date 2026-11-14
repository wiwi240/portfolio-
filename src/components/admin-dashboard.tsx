import { useState } from 'react'
import { CalendarDays, ChartColumn, Columns3, ExternalLink, Inbox, LogOut, MessageSquare, Settings as SettingsIcon, Users } from 'lucide-react'
import { DashboardWithCollapsibleSidebar } from '@/components/ui/dashboard-with-collapsible-sidebar'
import { Appointments } from './admin-appointments'
import { Contacts } from './admin-contacts'
import { Pipeline } from './admin-pipeline'
import { RequestDetail, RequestsList, type RequestsContext } from './admin-requests'
import { SettingsPage } from './admin-settings'
import { StatsPage } from './admin-stats'
import { isProject, type RequestItem, type Settings } from './admin-api'

type Section = 'requests' | 'pipeline' | 'contacts' | 'messages' | 'appointments' | 'stats' | 'settings'

type Props = {
  items: RequestItem[]
  settings: Settings
  onSettings: (settings: Settings) => void
  onChange: (item: RequestItem) => void
  onDelete: (id: RequestItem['id']) => void
  onReload: () => void
  onLogout: () => void
}

export function AdminDashboard({ items, settings, onSettings, onChange, onDelete, onReload, onLogout }: Props) {
  const [now] = useState(() => Date.now())
  const [section, setSection] = useState<Section>('requests')
  const [openId, setOpenId] = useState<string | null>(null)

  const ctx: RequestsContext = { items, settings, now, onChange, onDelete, onOpen: (id) => setOpenId(String(id)) }
  const current = items.find((item) => String(item.id) === openId) ?? null
  const fresh = (project: boolean) => items.filter((item) => item.status === 'new' && !item.archived && isProject(item) === project).length

  return <DashboardWithCollapsibleSidebar
    brand="William Mahi"
    subtitle="Espace réservé"
    selected={section}
    onSelect={(id) => { setSection(id as Section); setOpenId(null) }}
    items={[
      { id: 'requests', label: 'Demandes', Icon: Inbox, badge: fresh(true) },
      { id: 'pipeline', label: 'Pipeline', Icon: Columns3 },
      { id: 'contacts', label: 'Contacts', Icon: Users },
      { id: 'messages', label: 'Messages', Icon: MessageSquare, badge: fresh(false) },
      { id: 'appointments', label: 'Rendez-vous', Icon: CalendarDays },
      { id: 'stats', label: 'Statistiques', Icon: ChartColumn },
      { id: 'settings', label: 'Paramètres', Icon: SettingsIcon },
      { id: 'site', label: 'Voir le site', Icon: ExternalLink, href: '/' },
    ]}
    footerItems={[{ id: 'logout', label: 'Se déconnecter', Icon: LogOut, onClick: onLogout }]}
  >
    {current ? <RequestDetail key={current.id} item={current} ctx={ctx} onBack={() => setOpenId(null)} />
      : section === 'requests' ? <RequestsList kind="project" ctx={ctx} />
      : section === 'messages' ? <RequestsList kind="message" ctx={ctx} />
      : section === 'pipeline' ? <Pipeline ctx={ctx} />
      : section === 'contacts' ? <Contacts ctx={ctx} />
      : section === 'appointments' ? <Appointments settings={settings} onSettings={onSettings} now={now} />
      : section === 'stats' ? <StatsPage />
      : <SettingsPage settings={settings} onSettings={onSettings} onPurged={onReload} />}
  </DashboardWithCollapsibleSidebar>
}
