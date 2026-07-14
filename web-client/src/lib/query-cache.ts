import { partialMatchKey, type QueryClient, type QueryKey } from '@tanstack/react-query'

/**
 * Mutation cache reconciliation.
 *
 * Two rules keep every list in this app consistent after a mutation:
 *
 * 1. The server is authoritative. We never hand-roll a row from the form input, and we never
 *    re-sort, re-scope or re-filter a cached list ourselves. Lists here are server-ordered and
 *    role-scoped (see scopeMembers / buildMembersView), so a locally spliced row can land in the
 *    wrong position, or be visible to a user the server would not have shown it to. Direct cache
 *    writes are therefore limited to the two edits that cannot change ordering or scope:
 *    replacing a row in place by id, and removing a row by id.
 *
 * 2. Everything a mutation can touch indirectly is refetched, not patched. Rows in this app are
 *    derived across resources - a member row carries its team and sport names, an organization
 *    roster embeds member refs, a balance is recomputed from transactions. A mutation on one
 *    resource silently invalidates the others, and no local edit can reproduce a server-side
 *    cascade. Declaring those dependents per mutation (see each feature's `queries.ts`) is what
 *    keeps the edge from being forgotten.
 *
 * `settleMutation` is the single entry point: it applies the safe direct edits first, so the
 * visible list is already correct on the next render, then awaits the refetch of every affected
 * query. Returning its promise from a mutation's `onSuccess` is what makes `mutateAsync` resolve
 * only once the cache is consistent - so a success toast or a dialog close can never render
 * against a stale list.
 */

/** Replaces the row carrying `id` with the server's confirmed copy. Order is preserved. */
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

/** Drops the row carrying `id`. Used only after the server confirms the delete. */
export function removeById<T extends { id: string }>(
  qc: QueryClient,
  key: QueryKey,
  id: string,
): void {
  qc.setQueryData<T[]>(key, (rows) => rows?.filter((row) => row.id !== id))
}

export interface SettleMutation<T extends { id: string } = { id: string }> {
  /** Rows to replace in place with the server-confirmed copy. */
  replace?: { key: QueryKey; id: string; next: T }[]
  /** Rows to drop by id before the refetch, so the deleted row cannot survive a render. */
  remove?: { key: QueryKey; id: string }[]
  /** Detail caches to evict outright - the record no longer exists. */
  evict?: QueryKey[]
  /**
   * Every query the mutation can have changed, directly or by cascade. Each is invalidated and
   * awaited, so the promise settles only once the visible cache matches the server.
   */
  invalidate: QueryKey[]
}

/**
 * Settles a mutation's cache effects. Await (or return) this from `onSuccess` so `mutateAsync`
 * does not resolve before the UI would render the new state.
 */
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
