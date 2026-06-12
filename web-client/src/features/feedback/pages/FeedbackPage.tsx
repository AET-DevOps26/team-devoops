import { useFeedbackHello } from '../api'

export function FeedbackPage() {
  const { data: hello } = useFeedbackHello()

  return (
    <div>
      <h1 className="font-display text-display-lg uppercase tracking-wide">Feedback</h1>
      {hello && <p className="mt-2 text-sm text-muted-foreground">{hello}</p>}
    </div>
  )
}
