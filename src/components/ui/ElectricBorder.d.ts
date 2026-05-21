import type { CSSProperties, ReactNode } from 'react'

type ElectricBorderProps = {
  children?: ReactNode
  color?: string
  speed?: number
  chaos?: number
  borderRadius?: number
  className?: string
  style?: CSSProperties
}

declare function ElectricBorder(props: ElectricBorderProps): JSX.Element

export default ElectricBorder
