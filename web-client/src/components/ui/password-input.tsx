import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// Password field with a show/hide toggle. Forwards every native input prop through to Input,
// so it stays a drop-in replacement for `<Input type="password" />`.
const PasswordInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<typeof Input>, 'type'>
>(function PasswordInput({ className, disabled, ...props }, ref) {
  const [visible, setVisible] = React.useState(false)
  const Icon = visible ? EyeOff : Eye

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        disabled={disabled}
        className={cn('pr-10', className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        disabled={disabled}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-text-tertiary transition-colors hover:text-text-primary disabled:pointer-events-none disabled:opacity-50"
      >
        <Icon className="size-4" />
      </button>
    </div>
  )
})

export { PasswordInput }
