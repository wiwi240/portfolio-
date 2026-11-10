import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// Round corner badge checkbox. Colours come from the guide's own tokens (.guide-item-check), not shadcn theme variables.
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root ref={ref} className={cn('guide-item-check', className)} {...props}>
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check size={14} strokeWidth={3} aria-hidden="true" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = 'Checkbox'

export { Checkbox }
