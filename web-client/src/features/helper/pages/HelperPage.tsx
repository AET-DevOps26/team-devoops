import { useHelperHello } from '../api'

export function HelperPage() {
  const { data: hello } = useHelperHello()

  return (
    <div>
      <h1 className="font-display text-display-lg uppercase tracking-wide">GenAI Helper</h1>
      {hello && <p className="mt-2 text-sm text-muted-foreground">{hello}</p>}
    </div>
  )
}
