import { partialMatchKey, type QueryClient, type QueryKey } from '@tanstack/react-query'

// Lists are server-ordered and role-scoped, so only in-place replacement and removal are safe.
// Cross-resource effects are refetched because client patches cannot reproduce server cascades.
export function replaceById<T extends { id: string }>(
  qc: QueryClient,
  key: QueryKey,
  id: string,
  next: T,
): void {
  qc.setQueryData<T[]>(key, (rows) =>
    rows?.map((row) => (row.id === id ? next : row)),
  )
}

export function removeById<T extends { id: string }>(
  qc: QueryClient,
  key: QueryKey,
  id: string,
): void {
  qc.setQueryData<T[]>(key, (rows) => rows?.filter((row) => row.id !== id))
}

export interface SettleMutation<T extends { id: string } = { id: string }> {
  replace?: { key: QueryKey; id: string; next: T }[]
  remove?: { key: QueryKey; id: string }[]
  evict?: QueryKey[]
  invalidate: QueryKey[]
}

export async function settleMutation<T extends { id: string } = { id: string }>(
  qc: QueryClient,
  { replace = [], remove = [], evict = [], invalidate }: SettleMutation<T>,
): Promise<void> {
  for (const { key, id, next } of replace) {
    replaceById(qc, key, id, next)
  }

  for (const { key, id } of remove) {
    removeById(qc, key, id)
  }

  for (const key of evict) {
    qc.removeQueries({ queryKey: key })
  }

  // Invalidate every matching entry without starting one refetch per key. Keys deliberately
  // overlap (for example, a resource root and one detail key); launching those in parallel can
  // cancel and restart the same request. A single predicate refetches their union exactly once.
  for (const queryKey of invalidate) {
    void qc.invalidateQueries({ queryKey, refetchType: 'none' })
  }

  await qc.refetchQueries({
    type: 'all',
    predicate: (query) =>
      // A detail cache populated only from a mutation response has no query function until its
      // hook is mounted. It is already authoritative and cannot be refetched yet.
      typeof query.options.queryFn === 'function' &&
      invalidate.some((queryKey) => partialMatchKey(query.queryKey, queryKey)),
  })
}
