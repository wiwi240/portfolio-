declare module '@/components/ui/dot-field' {
  import type { ComponentType } from 'react'

  export type DotFieldProps = {
    dotRadius?: number
    dotSpacing?: number
    cursorRadius?: number
    cursorForce?: number
    bulgeOnly?: boolean
    bulgeStrength?: number
    glowRadius?: number
    sparkle?: boolean
    waveAmplitude?: number
    gradientFrom?: string
    gradientTo?: string
    glowColor?: string
    className?: string
    style?: React.CSSProperties
  }

  const DotField: ComponentType<DotFieldProps>
  export default DotField
}
