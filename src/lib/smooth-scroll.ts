import { createContext, useContext } from 'react'

export type ScrollToOptions = { immediate?: boolean }
export type SmoothScroll = { scrollTo: (top: number, options?: ScrollToOptions) => void }

// Our own programmatic scrolls always use 'instant' natively: the global
// `scroll-behavior: smooth` would otherwise animate them against the user's motion setting.
const nativeScrollTo: SmoothScroll['scrollTo'] = (top, options) => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top, behavior: options?.immediate || reduceMotion ? 'instant' : 'smooth' })
}

export const SmoothScrollContext = createContext<SmoothScroll>({ scrollTo: nativeScrollTo })
export const useSmoothScroll = () => useContext(SmoothScrollContext)
export { nativeScrollTo }
