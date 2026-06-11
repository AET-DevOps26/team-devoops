import { useSportEventsHello } from '../api'

export function SportEventsPage() {
  const { data: hello } = useSportEventsHello()

  return (
    <div>
      <h1 className="font-display text-display-lg uppercase tracking-wide">Events</h1>
      {hello && <p className="mt-2 text-sm text-muted-foreground">{hello}</p>}
    </div>
  )
}
