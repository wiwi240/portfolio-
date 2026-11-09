import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SmoothScrollProvider } from './components/smooth-scroll-provider'
import { initCardSpotlight } from './lib/card-spotlight'
import { initPageEffects } from './lib/page-effects'

initCardSpotlight()
initPageEffects()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SmoothScrollProvider>
      <App />
    </SmoothScrollProvider>
  </StrictMode>,
)
