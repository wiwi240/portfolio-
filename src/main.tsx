import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SmoothScrollProvider } from './components/smooth-scroll-provider'
import { initCardSpotlight } from './lib/card-spotlight'
import { initPageEffects } from './lib/page-effects'
import { AdminPage } from './components/admin-page'
import { BookingPage } from './components/booking-page'
import { AdminShortcut } from './components/admin-shortcut'
import { trackOnce } from './lib/track'

const route = window.location.pathname.replace(/\/+$/, '')
const isAdmin = route === '/admin'
const isBooking = route === '/rendez-vous'
if (!isAdmin) trackOnce('visit', 'visit')
if (!isAdmin && !isBooking) {
  initCardSpotlight()
  initPageEffects()
}

createRoot(document.getElementById('root')!).render(
  isAdmin ? <StrictMode><AdminPage /></StrictMode> : isBooking ? <StrictMode><BookingPage /><AdminShortcut /></StrictMode> : <StrictMode>
    <SmoothScrollProvider>
      <App />
    </SmoothScrollProvider>
    <AdminShortcut />
  </StrictMode>,
)
