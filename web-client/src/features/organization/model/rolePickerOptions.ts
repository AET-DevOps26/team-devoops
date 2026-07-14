// Existing role-holders stay selectable and sort first because assignments grant the role.

export interface RolePickerOption {
  id: string
  name: string
  meta?: string
}

export function roleMeta(label: string, meta: string | undefined): string {
  return meta ? `${label} - ${meta}` : label
}

export function roleSort<TOption extends RolePickerOption>(
  roleIds: ReadonlySet<string>,
  a: TOption,
  b: TOption,
): number {
  const roleDelta = Number(roleIds.has(b.id)) - Number(roleIds.has(a.id))
  return roleDelta || a.name.localeCompare(b.name)
}
