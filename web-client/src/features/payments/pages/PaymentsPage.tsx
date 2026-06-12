import { usePaymentsHello } from '../api'

export function PaymentsPage() {
  const { data: hello } = usePaymentsHello()

  return (
    <div>
      <h1 className="font-display text-display-lg uppercase tracking-wide">Payments</h1>
      {hello && <p className="mt-2 text-sm text-muted-foreground">{hello}</p>}
    </div>
  )
}
