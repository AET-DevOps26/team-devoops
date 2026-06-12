import { useLettersHello } from '../api'

export function LettersPage() {
  const { data: hello } = useLettersHello()

  return (
    <div>
      <h1 className="font-display text-display-lg uppercase tracking-wide">Letters</h1>
      {hello && <p className="mt-2 text-sm text-muted-foreground">{hello}</p>}
    </div>
  )
}
