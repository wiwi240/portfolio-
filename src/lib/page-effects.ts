// Page-level visual effects: scroll reveal with stagger and a "scrolled" flag for the header.
// Everything is progressive: without JS, or with reduced motion, content is simply visible.
const REVEAL_SELECTOR = [
  '.page-header', '.section-heading', '.project-card', '.skill-detail', '.about-values article',
  '.contact-primary', '.contact-secondary', '.faq-page-heading', '.faq-page-list > *',
].join(', ')

export function initPageEffects() {
  const root = document.documentElement
  const cleanups: Array<() => void> = []

  // Header: stronger shadow/blur once the page has moved.
  const onScroll = () => {
    if (window.scrollY > 12) root.setAttribute('data-scrolled', '')
    else root.removeAttribute('data-scrolled')
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  cleanups.push(() => window.removeEventListener('scroll', onScroll))

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    return () => cleanups.forEach((fn) => fn())
  }

  root.classList.add('reveal-ready')
  const io = new IntersectionObserver(
    (entries) => {
      entries.filter((e) => e.isIntersecting).forEach((entry, i) => {
        const el = entry.target as HTMLElement
        io.unobserve(el)
        el.style.setProperty('--reveal-i', String(Math.min(i, 6)))
        el.setAttribute('data-reveal', 'in')
        // Drop the attribute afterwards so the element's own hover transitions come back.
        window.setTimeout(() => {
          el.removeAttribute('data-reveal')
          el.style.removeProperty('--reveal-i')
        }, 1000)
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  )

  const track = (el: HTMLElement) => {
    if (el.dataset.revealed) return
    el.dataset.revealed = '1'
    el.setAttribute('data-reveal', 'pending')
    io.observe(el)
  }
  const register = (scope: ParentNode) => {
    if (scope instanceof HTMLElement && scope.matches(REVEAL_SELECTOR)) track(scope)
    scope.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(track)
  }
  register(document)

  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) m.addedNodes.forEach((n) => { if (n instanceof HTMLElement) register(n) })
  })
  mo.observe(document.getElementById('root') ?? document.body, { childList: true, subtree: true })

  cleanups.push(() => { io.disconnect(); mo.disconnect(); root.classList.remove('reveal-ready') })
  return () => cleanups.forEach((fn) => fn())
}
