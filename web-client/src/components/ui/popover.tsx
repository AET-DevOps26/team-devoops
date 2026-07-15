import * as React from 'react'
import { Popover as PopoverPrimitive } from 'radix-ui'

import { useDialogContentContainer } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

function Popover({
  modal,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  const dialogContainer = useDialogContentContainer()

  return (
    <PopoverPrimitive.Root
      data-slot="popover"
      modal={modal ?? dialogContainer !== null}
      {...props}
    />
  )
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = 'start',
  sideOffset = 4,
  container,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & {
  container?: HTMLElement | null
}) {
  return (
    <PopoverPrimitive.Portal container={container ?? undefined}>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-[60] w-80 bg-popover p-4 text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverContent, PopoverTrigger }
