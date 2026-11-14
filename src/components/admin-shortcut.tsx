import { useEffect, useState } from 'react'
import { forgetAdmin, hasAdminHint } from '@/lib/admin-hint'
import './admin-shortcut.css'

// Floating link to the owner area, shown only while the owner has a valid admin session.
export function AdminShortcut() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!hasAdminHint()) return
    let cancelled = false
    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then((response) => {
        if (cancelled) return
        if (response.ok) setVisible(true)
        else forgetAdmin()
      })
      .catch(() => undefined)
    return () => { cancelled = true }
  }, [])

  return visible ? <a className="admin-shortcut" href="/admin">Admin</a> : null
}
