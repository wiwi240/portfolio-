import { useRef, type CSSProperties, type FocusEvent, type ReactNode } from 'react'
import {
  horizontalPanelTop,
  horizontalQuery,
  isProgrammaticScroll,
  sceneFlowTop,
  useHorizontalProgress,
  useStackSceneHeight,
} from '@/lib/scroll-stack'
import { useSmoothScroll } from '@/lib/smooth-scroll'
import './scroll-stack.css'

type Tone = 'clear' | 'bg' | 'tint' | 'surface'

// Tabbing back into a scene that a later one fully covers brings it back into view.
const isCovered = (scene: Element) => {
  const next = scene.nextElementSibling
  return !!next && next.getBoundingClientRect().top <= 1
}

export function ScrollStack({ children }: { children: ReactNode }) {
  return <div className="scroll-stack">{children}</div>
}

type StackSceneProps = {
  id: string
  tone?: Tone
  labelledBy?: string
  label?: string
  className?: string
  children: ReactNode
}

export function StackScene({ id, tone = 'bg', labelledBy, label, className = '', children }: StackSceneProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollTo } = useSmoothScroll()
  useStackSceneHeight(ref)

  const revealIfCovered = () => {
    const scene = ref.current
    if (scene && isCovered(scene)) scrollTo(sceneFlowTop(scene), { immediate: true })
  }

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      aria-label={label}
      className={`stack-scene stack-scene--${tone} ${className}`.trim()}
      onFocus={revealIfCovered}
    >
      {children}
    </section>
  )
}

type HorizontalPanel = { tone: Tone; content: ReactNode }

// Panels pinned side by side: scrolling down slides them left. Below the horizontalQuery they stack vertically.
// `unlocked` is the index of the last panel the visitor may reach: the scene is only as long as the unlocked
// panels, and the others are inert, so scrolling (or Tab) cannot reveal a slide before it has been earned.
export function HorizontalScene({ id, label, panels, unlocked = panels.length - 1 }: { id: string; label: string; panels: HorizontalPanel[]; unlocked?: number }) {
  const reach = Math.min(Math.max(unlocked, 0), panels.length - 1) + 1
  const ref = useRef<HTMLElement>(null)
  const { scrollTo } = useSmoothScroll()
  useStackSceneHeight(ref)
  useHorizontalProgress(ref)

  const revealPanel = (index: number, event: FocusEvent<HTMLElement>) => {
    const scene = ref.current
    if (!scene || isProgrammaticScroll()) return
    const left = event.currentTarget.getBoundingClientRect().left
    const offscreen = window.matchMedia(horizontalQuery).matches && Math.abs(left) > 1
    if (offscreen || isCovered(scene)) scrollTo(horizontalPanelTop(scene, index), { immediate: true })
  }

  return (
    <section
      ref={ref}
      id={id}
      aria-label={label}
      data-reach={reach}
      style={{ '--panels': panels.length, '--reach': reach } as CSSProperties}
      className="stack-scene hscene"
    >
      <div className="hscene-pin">
        <div className="hscene-track">
          {panels.map((panel, index) => (
            <div
              key={index}
              className={`hscene-panel stack-scene--${panel.tone} ${index >= reach ? 'is-locked' : ''}`}
              inert={index >= reach}
              onFocus={(event) => revealPanel(index, event)}
            >
              {panel.content}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
