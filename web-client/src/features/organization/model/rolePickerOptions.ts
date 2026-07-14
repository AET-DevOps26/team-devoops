// Shared by the sport-director and team-coach pickers. Both offer every member (assignments here
// are what *give* a member the role — the server derives Keycloak roles from the saved rows), so
// the ones who already hold the role are labelled and floated to the top rather than filtered in.

export interface RolePickerOption {
  id: string
  name: string
  meta?: string
}

/** Prefixes the role label onto an option's meta line, e.g. "Coach - jane@example.com". */
export function roleMeta(label: string, meta: string | undefined): string {
  return meta ? `${label} - ${meta}` : label
}

/** Sorts current role-holders first, then alphabetically by name. */
export function roleSort<TOption extends RolePickerOption>(
  roleIds: ReadonlySet<string>,
  a: TOption,
  b: TOption,
): number {
  const roleDelta = Number(roleIds.has(b.id)) - Number(roleIds.has(a.id))
  return roleDelta || a.name.localeCompare(b.name)
}
