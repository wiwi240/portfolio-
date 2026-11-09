import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { nativeScrollTo, SmoothScrollContext, type SmoothScroll } from '@/lib/smooth-scroll'
import './smooth-scroll-provider.css'

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      if (query.matches) {
        lenisRef.current?.destroy()
        lenisRef.current = null
      } else if (!lenisRef.current) {
        lenisRef.current = new Lenis({
          autoRaf: true,
          lerp: 0.1,
          duration: 1.1,
          allowNestedScroll: true,
          prevent: (node) => !!node.closest('[role="dialog"], [role="alertdialog"]'),
        })
      }
    }
    sync()
    query.addEventListener('change', sync)
    return () => {
      query.removeEventListener('change', sync)
      lenisRef.current?.destroy()
      lenisRef.current = null
    }
  }, [])

  const value = useMemo<SmoothScroll>(
    () => ({
      scrollTo: (top, options) => {
        const lenis = lenisRef.current
        if (lenis) {
          // Lenis caches the scroll limit; a panel unlocked a moment ago has made the page longer, and the old limit
          // would clamp the target short.
          lenis.resize()
          lenis.scrollTo(top, { immediate: options?.immediate })
        } else nativeScrollTo(top, options)
      },
    }),
    [],
  )

  return <SmoothScrollContext value={value}>{children}</SmoothScrollContext>
}
