// Feeds --mx / --my to the hovered card so its CSS spotlight follows the pointer.
// One delegated listener, no per-card state, no React re-render.
const CARD_SELECTOR = '.service-card, .project-card, .project-entry-card, .guide-items label, .guide-final-form'

export function initCardSpotlight() {
  if (window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return () => {}

  let frame = 0
  const onMove = (event: PointerEvent) => {
    const card = (event.target as Element | null)?.closest<HTMLElement>(CARD_SELECTOR)
    if (!card) return
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`)
      card.style.setProperty('--my', `${event.clientY - rect.top}px`)
    })
  }

  document.addEventListener('pointermove', onMove, { passive: true })
  return () => {
    cancelAnimationFrame(frame)
    document.removeEventListener('pointermove', onMove)
  }
}
