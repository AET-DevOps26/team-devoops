import { useOrganizationHello } from '../api'

export function OrganizationPage() {
  const { data: hello } = useOrganizationHello()

  return (
    <div>
      <h1 className="font-display text-display-lg uppercase tracking-wide">Organization</h1>
      {hello && <p className="mt-2 text-sm text-muted-foreground">{hello}</p>}
    </div>
  )
}
