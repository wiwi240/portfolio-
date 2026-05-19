import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-[transform,background-color,border-color,box-shadow,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(57,231,255,0.24)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[linear-gradient(180deg,var(--accent),var(--accent-strong))] text-[var(--bg)] shadow-[0_16px_34px_rgba(57,231,255,0.22)] hover:-translate-y-px hover:shadow-[0_22px_42px_rgba(57,231,255,0.28)]',
        destructive: 'bg-[#b63d3d] text-white hover:bg-[#9f3535]',
        outline:
          'border border-[rgba(132,168,255,0.18)] bg-[linear-gradient(180deg,rgba(57,231,255,0.06),rgba(138,99,255,0.03))] text-[var(--fg)] hover:-translate-y-px hover:bg-[linear-gradient(180deg,rgba(57,231,255,0.1),rgba(138,99,255,0.05))] hover:text-[var(--fg)]',
        secondary:
          'bg-[linear-gradient(180deg,rgba(138,99,255,0.12),rgba(57,231,255,0.05))] text-[var(--fg)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:-translate-y-px hover:bg-[linear-gradient(180deg,rgba(138,99,255,0.16),rgba(57,231,255,0.08))]',
        ghost: 'text-[var(--fg)] hover:bg-white/8 hover:text-[var(--fg)]',
        link: 'text-[var(--accent)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button }
