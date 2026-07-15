import * as React from 'react'
import RPNInput, { type Country, type Value } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  id?: string
  disabled?: boolean
  required?: boolean
  defaultCountry?: Country
  'aria-invalid'?: boolean
  'aria-label'?: string
  className?: string
}

// Phone field with a country-flag + dial-code selector and as-you-type formatting
// (react-phone-number-input). Stores the value in E.164 (e.g. +491701234567), which the
// member service accepts. The national number is rendered through our themed Input so the
// field matches every other text field; the country column is styled in index.css.
function PhoneInput({
  value,
  onChange,
  disabled,
  defaultCountry = 'DE',
  className,
  ...props
}: PhoneInputProps) {
  return (
    <RPNInput
      international
      defaultCountry={defaultCountry}
      disabled={disabled}
      value={(value || undefined) as Value | undefined}
      // The library emits `undefined` when the field is cleared; normalise to '' for form state.
      onChange={(next) => onChange(next ?? '')}
      inputComponent={PhoneNumberField}
      className={cn('roost-phone-input flex items-center gap-2', className)}
      numberInputProps={{ 'aria-invalid': props['aria-invalid'] }}
      {...props}
    />
  )
}

// react-phone-number-input passes the national-number input props here; forward them to Input.
const PhoneNumberField = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(function PhoneNumberField(props, ref) {
  return <Input ref={ref} {...props} />
})

export { PhoneInput }
