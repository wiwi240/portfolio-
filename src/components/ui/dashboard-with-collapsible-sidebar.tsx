'use client'

import { useState, type ComponentType, type ReactNode } from 'react'
import { ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import './dashboard-with-collapsible-sidebar.css'

export type SidebarItem = {
  id: string
  label: string
  Icon: ComponentType<{ className?: string }>
  badge?: number
  href?: string
  onClick?: () => void
}

type DashboardProps = {
  brand: string
  subtitle: string
  items: SidebarItem[]
  footerItems?: SidebarItem[]
  selected: string
  onSelect?: (id: string) => void
  children: ReactNode
}

// Neobrutalist shell: colours, borders and shadows come from the site tokens (tokens.css + neobrutalism.css), so it follows the light/dark theme.
export function DashboardWithCollapsibleSidebar({ brand, subtitle, items, footerItems = [], selected, onSelect, children }: DashboardProps) {
  return (
    <div className="nbd-shell">
      <Sidebar brand={brand} subtitle={subtitle} items={items} footerItems={footerItems} selected={selected} onSelect={onSelect} />
      <div className="nbd-content">{children}</div>
    </div>
  )
}

function Sidebar({ brand, subtitle, items, footerItems, selected, onSelect }: Omit<DashboardProps, 'children'> & { footerItems: SidebarItem[] }) {
  const [open, setOpen] = useState(() => typeof window === 'undefined' || window.innerWidth >= 768)

  return (
    <nav aria-label="Navigation de l’espace réservé" className={cn('nbd-sidebar', open ? 'is-open' : 'is-closed')}>
      <div className="nbd-brand">
        <div className="nbd-logo" aria-hidden="true">WM</div>
        {open && <div className="nbd-brand-text"><strong>{brand}</strong><span>{subtitle}</span></div>}
      </div>

      <div className="nbd-group">
        {items.map((item) => <Option key={item.id} item={item} selected={selected} onSelect={onSelect} open={open} />)}
      </div>

      {footerItems.length > 0 && (
        <div className="nbd-group nbd-group-footer">
          {footerItems.map((item) => <Option key={item.id} item={item} selected={selected} onSelect={onSelect} open={open} />)}
        </div>
      )}

      <button type="button" className="nbd-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Réduire le menu' : 'Agrandir le menu'} aria-expanded={open}>
        <span className="nbd-icon"><ChevronsRight className={cn('nbd-chevron', open && 'is-flipped')} aria-hidden="true" /></span>
        {open && <span className="nbd-label">Réduire</span>}
      </button>
    </nav>
  )
}

function Option({ item, selected, onSelect, open }: { item: SidebarItem; selected: string; onSelect?: (id: string) => void; open: boolean }) {
  const isSelected = selected === item.id
  const className = cn('nbd-option', isSelected && 'is-selected')
  const content = (
    <>
      <span className="nbd-icon"><item.Icon className="nbd-svg" aria-hidden="true" /></span>
      {open && <span className="nbd-label">{item.label}</span>}
      {item.badge !== undefined && open && <span className="nbd-badge">{item.badge}</span>}
    </>
  )

  if (item.href) return <a href={item.href} className={className} title={item.label} aria-label={item.label}>{content}</a>
  return (
    <button type="button" className={className} title={item.label} aria-label={item.label} aria-current={isSelected ? 'page' : undefined} onClick={() => { onSelect?.(item.id); item.onClick?.() }}>
      {content}
    </button>
  )
}
