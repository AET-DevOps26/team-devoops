import { useMembersHello } from '../api'

export function MembersPage() {
  const { data: hello } = useMembersHello()

  return (
    <div>
      <h1 className="font-display text-display-lg uppercase tracking-wide">Members</h1>
      {hello && <p className="mt-2 text-sm text-muted-foreground">{hello}</p>}
    </div>
  )
}
