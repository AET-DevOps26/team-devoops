import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

// The spinner is only ever shown beside a visible label (e.g. "Saving…") that already announces
// state, so it's decorative here — hiding it from a11y avoids a second, competing status region.
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      data-slot="spinner"
      aria-hidden="true"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
