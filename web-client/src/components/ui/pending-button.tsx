import * as React from "react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface PendingButtonProps extends React.ComponentProps<typeof Button> {
  isPending: boolean
  pendingLabel: string
}

function PendingButton({
  isPending,
  pendingLabel,
  disabled,
  children,
  ...props
}: PendingButtonProps) {
  return (
    <Button disabled={disabled || isPending} {...props}>
      {isPending ? <PendingButtonContent pendingLabel={pendingLabel} /> : children}
    </Button>
  )
}

function PendingButtonContent({ pendingLabel }: { pendingLabel: string }) {
  return (
    <>
      <Spinner data-icon="inline-start" />
      {pendingLabel}
    </>
  )
}

export { PendingButton, PendingButtonContent }
export type { PendingButtonProps }
