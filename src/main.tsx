import { lazy, StrictMode, Suspense } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SmoothScrollProvider } from './components/smooth-scroll-provider'
import { initCardSpotlight } from './lib/card-spotlight'
import { initPageEffects } from './lib/page-effects'
import { AdminShortcut } from './components/admin-shortcut'
import { trackOnce } from './lib/track'

// Owner-only screens live in their own chunks so public visitors never download them.
// (main.tsx is the entry point, not a hot-reloaded module: the fast-refresh rule does not apply here.)
/* eslint-disable react-refresh/only-export-components */
const AdminPage = lazy(() => import('./components/admin-page').then((m) => ({ default: m.AdminPage })))
const BookingPage = lazy(() => import('./components/booking-page').then((m) => ({ default: m.BookingPage })))
/* eslint-enable react-refresh/only-export-components */

const route = window.location.pathname.replace(/\/+$/, '')
const isAdmin = route === '/admin'
const isBooking = route === '/rendez-vous'
if (!isAdmin) trackOnce('visit', 'visit')
if (!isAdmin && !isBooking) {
  initCardSpotlight()
  initPageEffects()
}

const container = document.getElementById('root')!

if (isAdmin || isBooking) {
  createRoot(container).render(<StrictMode>
    <Suspense fallback={null}>{isAdmin ? <AdminPage /> : <BookingPage />}</Suspense>
    {isBooking && <AdminShortcut />}
  </StrictMode>)
} else {
  // Public pages ship pre-rendered at build time (scripts/prerender.mjs): attach to that markup instead of redrawing it.
  // Same tree as src/entry-server.tsx.
  const tree = <StrictMode>
    <SmoothScrollProvider>
      <App />
    </SmoothScrollProvider>
    <AdminShortcut />
  </StrictMode>
  if (container.hasChildNodes()) hydrateRoot(container, tree)
  else createRoot(container).render(tree)
}
