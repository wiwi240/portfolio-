import { useEffect, useRef } from 'react'

type Dot = {
  x: number
  y: number
}

const DOT_DIAMETER = 3.00
const GRID_SPACING = 28
const BASE_ALPHA = 0.145
const INFLUENCE_RADIUS = 112
const MAX_OFFSET = 4
const MAX_SCALE = 1.15
const MAX_ALPHA = 0.3
const SETTLE_EPSILON = 0.01
const TOP_INSET = 10
const INFLUENCE_FALLOFF = 1.85

export default function HeroDotField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const hero = canvas.closest<HTMLElement>('.portfolio-hero')
    if (!hero) {
      return
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    const pointerMediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const state = {
      width: 0,
      height: 0,
      dots: [] as Dot[],
      interactive: pointerMediaQuery.matches && !reducedMotionQuery.matches,
      pointerCurrentX: 0,
      pointerCurrentY: 0,
      pointerTargetX: 0,
      pointerTargetY: 0,
      influenceCurrent: 0,
      influenceTarget: 0,
      animationActive: false,
      rafId: 0,
    }

    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

    const smoothstep = (value: number) => {
      const clamped = Math.max(0, Math.min(1, value))
      return clamped * clamped * (3 - 2 * clamped)
    }

    const rebuildDots = () => {
      const dots: Dot[] = []
      const edgeInset = Math.ceil(DOT_DIAMETER)
      const columns = Math.ceil((state.width - edgeInset * 2) / GRID_SPACING) + 1
      const rows = Math.ceil((state.height - edgeInset - TOP_INSET) / GRID_SPACING) + 1

      for (let row = 0; row < rows; row += 1) {
        const y = TOP_INSET + edgeInset + row * GRID_SPACING
        for (let column = 0; column < columns; column += 1) {
          const x = edgeInset + column * GRID_SPACING
          dots.push({
            x,
            y,
          })
        }
      }

      state.dots = dots
    }

    const resize = () => {
      const rect = hero.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      state.width = rect.width
      state.height = rect.height

      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      rebuildDots()

      if (!state.pointerCurrentX && !state.pointerCurrentY) {
        state.pointerCurrentX = rect.width * 0.72
        state.pointerCurrentY = rect.height * 0.5
        state.pointerTargetX = state.pointerCurrentX
        state.pointerTargetY = state.pointerCurrentY
      }

      draw()
    }

    const stopAnimation = () => {
      if (!state.animationActive) {
        return
      }

      state.animationActive = false
      window.cancelAnimationFrame(state.rafId)
    }

    const startAnimation = () => {
      if (!state.interactive || state.animationActive) {
        return
      }

      state.animationActive = true
      state.rafId = window.requestAnimationFrame(render)
    }

    const draw = () => {
      context.clearRect(0, 0, state.width, state.height)

      const dotColor = '102, 153, 204'

      for (const dot of state.dots) {
        const deltaX = dot.x - state.pointerCurrentX
        const deltaY = dot.y - state.pointerCurrentY
        const distance = Math.hypot(deltaX, deltaY)
        const strength =
          state.interactive && state.influenceCurrent > 0
            ? Math.pow(smoothstep(1 - Math.min(distance / INFLUENCE_RADIUS, 1)), INFLUENCE_FALLOFF) *
              state.influenceCurrent
            : 0
        const safeDistance = distance || 1
        const offset = strength * MAX_OFFSET
        const x = dot.x + (deltaX / safeDistance) * offset
        const y = dot.y + (deltaY / safeDistance) * offset
        const radius = (DOT_DIAMETER * (1 + (MAX_SCALE - 1) * strength)) / 2
        const alpha = clamp(BASE_ALPHA + strength * 0.135, BASE_ALPHA, MAX_ALPHA)

        context.beginPath()
        context.arc(x, y, radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(${dotColor}, ${alpha})`
        context.fill()
      }
    }

    const render = () => {
      state.pointerCurrentX += (state.pointerTargetX - state.pointerCurrentX) * 0.12
      state.pointerCurrentY += (state.pointerTargetY - state.pointerCurrentY) * 0.12
      state.influenceCurrent += (state.influenceTarget - state.influenceCurrent) * 0.1

      draw()

      const pointerSettled =
        Math.abs(state.pointerTargetX - state.pointerCurrentX) < SETTLE_EPSILON &&
        Math.abs(state.pointerTargetY - state.pointerCurrentY) < SETTLE_EPSILON
      const influenceSettled = Math.abs(state.influenceTarget - state.influenceCurrent) < SETTLE_EPSILON

      if (state.interactive && !(pointerSettled && influenceSettled)) {
        state.rafId = window.requestAnimationFrame(render)
        return
      }

      stopAnimation()
    }

    const updatePointer = (event: PointerEvent | MouseEvent) => {
      if (!state.interactive) {
        return
      }

      const rect = hero.getBoundingClientRect()
      state.pointerTargetX = event.clientX - rect.left
      state.pointerTargetY = event.clientY - rect.top
      state.influenceTarget = 1
      startAnimation()
    }

    const handlePointerEnter = (event: PointerEvent) => {
      updatePointer(event)
    }

    const handlePointerMove = (event: PointerEvent) => {
      updatePointer(event)
    }

    const handlePointerLeave = () => {
      state.influenceTarget = 0
      startAnimation()
    }

    const handleMediaChange = (event: MediaQueryListEvent) => {
      state.interactive = event.matches && !reducedMotionQuery.matches
      if (!state.interactive) {
        state.influenceTarget = 0
        state.influenceCurrent = 0
        stopAnimation()
        draw()
      } else {
        startAnimation()
      }
    }

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      state.interactive = pointerMediaQuery.matches && !event.matches
      if (!state.interactive) {
        state.influenceTarget = 0
        state.influenceCurrent = 0
        stopAnimation()
        draw()
      } else {
        startAnimation()
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      resize()
    })

    resize()

    resizeObserver.observe(hero)
    hero.addEventListener('pointerenter', handlePointerEnter)
    hero.addEventListener('pointermove', handlePointerMove)
    hero.addEventListener('pointerleave', handlePointerLeave)
    pointerMediaQuery.addEventListener('change', handleMediaChange)
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange)

    return () => {
      stopAnimation()
      resizeObserver.disconnect()
      hero.removeEventListener('pointerenter', handlePointerEnter)
      hero.removeEventListener('pointermove', handlePointerMove)
      hero.removeEventListener('pointerleave', handlePointerLeave)
      pointerMediaQuery.removeEventListener('change', handleMediaChange)
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange)
    }
  }, [])

  return <canvas ref={canvasRef} className="portfolio-hero-dot-field" aria-hidden="true" />
}
