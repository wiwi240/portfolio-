import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from 'react'

type MotionState = {
  y?: string | number
  opacity?: number
}

type TransitionConfig = {
  type?: string
  damping?: number
  stiffness?: number
  delay?: number
}

export interface RotatingTextProps extends HTMLAttributes<HTMLSpanElement> {
  texts: string[]
  rotationInterval?: number
  initial?: MotionState
  animate?: MotionState
  exit?: MotionState
  animatePresenceMode?: string
  animatePresenceInitial?: boolean
  staggerDuration?: number
  staggerFrom?: 'first' | 'last' | 'center' | 'random' | number
  transition?: TransitionConfig
  loop?: boolean
  auto?: boolean
  splitBy?: string
  onNext?: (index: number) => void
  mainClassName?: string
  splitLevelClassName?: string
  elementLevelClassName?: string
}

declare const RotatingText: ForwardRefExoticComponent<
  RotatingTextProps & RefAttributes<{ next: () => void; previous: () => void; jumpTo: (index: number) => void; reset: () => void }>
>

export default RotatingText
