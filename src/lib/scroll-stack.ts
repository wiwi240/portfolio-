import { useCallback, useEffect, type RefObject } from 'react'
import { useSmoothScroll, type ScrollToOptions } from './smooth-scroll'

// Keep in sync with the @media rule in scroll-stack.css: below this a horizontal scene falls back to vertical panels.
export const horizontalQuery = '(min-width: 901px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)'

// A programmatic scroll moves focus before the page has moved, which must not be mistaken for a keyboard jump.
let guardUntil = 0
export const isProgrammaticScroll = () => performance.now() < guardUntil
export const markProgrammaticScroll = () => {
  guardUntil = performance.now() + 1500
}

// A stuck scene reports its stuck position, so its resting position is rebuilt
// from the stack's top and the heights of the scenes before it.
export function sceneFlowTop(scene: HTMLElement) {
  let top = (scene.parentElement as HTMLElement).getBoundingClientRect().top + window.scrollY
  for (let sibling = scene.previousElementSibling; sibling; sibling = sibling.previousElementSibling) {
    top += sibling.getBoundingClientRect().height
  }
  return top
}

// Scroll position at which a horizontal scene shows the given panel.
export function horizontalPanelTop(scene: HTMLElement, index: number) {
  const flowTop = sceneFlowTop(scene)
  if (window.matchMedia(horizontalQuery).matches) {
    const count = Number(scene.dataset.reach)
    const travel = scene.getBoundingClientRect().height - window.innerHeight
    return flowTop + (count > 1 ? (travel * index) / (count - 1) : 0)
  }
  const panel = scene.querySelectorAll('.hscene-panel')[index]
  return flowTop + (panel ? panel.getBoundingClientRect().top - scene.getBoundingClientRect().top : 0)
}

// The sticky offset depends on the scene's own height, so a scene taller than the viewport can be read to the end.
export function useStackSceneHeight(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scene = ref.current
    if (!scene) return
    const observer = new ResizeObserver(() => {
      scene.style.setProperty('--stack-h', `${scene.getBoundingClientRect().height}px`)
    })
    observer.observe(scene)
    return () => observer.disconnect()
  }, [ref])
}

// Vertical scrolling drives the horizontal travel: 0 when the scene reaches the top, 1 when its last panel is in place.
export function useHorizontalProgress(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scene = ref.current
    if (!scene) return
    let frame = 0
    const update = () => {
      frame = 0
      const travel = scene.getBoundingClientRect().height - window.innerHeight
      const progress = travel > 0 ? Math.min(1, Math.max(0, -scene.getBoundingClientRect().top / travel)) : 0
      scene.style.setProperty('--hscene-p', progress.toFixed(4))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // Unlocking a panel lengthens the scene without any scroll: without this the slide would jump to the new progress.
    // The callback runs before the next paint, so updating right away (not through a frame) avoids a flash of the new panel.
    const observer = new ResizeObserver(update)
    observer.observe(scene)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ref])
}

export function useScrollToScene() {
  const { scrollTo } = useSmoothScroll()
  return useCallback(
    (sceneId: string, options?: ScrollToOptions & { focusId?: string; panel?: number }) => {
      const scene = document.getElementById(sceneId)
      if (!scene) return
      markProgrammaticScroll()
      // Focus moves to the target first: a focused element left in a covered scene would pull the page back up.
      if (options?.focusId) document.getElementById(options.focusId)?.focus({ preventScroll: true })
      const panel = options?.panel
      scrollTo(panel === undefined ? sceneFlowTop(scene) : horizontalPanelTop(scene, panel), options)
      // The scene may still be changing height when the target is computed (a panel was just unlocked), which leaves the
      // slide a few dozen pixels off. Once the smooth scroll is over, snap to the settled position, unless the visitor
      // has already scrolled somewhere else.
      if (panel !== undefined) {
        window.setTimeout(() => {
          const settled = horizontalPanelTop(scene, panel)
          const gap = Math.abs(settled - window.scrollY)
          if (gap > 2 && gap < 200) scrollTo(settled, { immediate: true })
        }, 1400)
      }
    },
    [scrollTo],
  )
}
