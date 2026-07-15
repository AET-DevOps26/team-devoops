import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'

import { settleMutation } from './query-cache'

describe('settleMutation', () => {
  it('applies safe list edits before refetching', async () => {
    const qc = new QueryClient()
    const listKey = ['members'] as const
    const detailKey = ['members', 'deleted'] as const

    qc.setQueryData(listKey, [
      { id: 'updated', name: 'Old name' },
      { id: 'deleted', name: 'Delete me' },
    ])
    qc.setQueryData(detailKey, { id: 'deleted', name: 'Delete me' })

    await settleMutation(qc, {
      replace: [{ key: listKey, id: 'updated', next: { id: 'updated', name: 'New name' } }],
      remove: [{ key: listKey, id: 'deleted' }],
      evict: [detailKey],
      invalidate: [],
    })

    expect(qc.getQueryData(listKey)).toEqual([{ id: 'updated', name: 'New name' }])
    expect(qc.getQueryState(detailKey)).toBeUndefined()
  })

  it('awaits inactive dependent queries and refetches overlapping keys once', async () => {
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const key = ['organization', 'teams'] as const
    let finishRefetch: ((rows: { id: string }[]) => void) | undefined
    const queryFn = vi
      .fn<() => Promise<{ id: string }[]>>()
      .mockResolvedValueOnce([{ id: 'stale' }])
      .mockImplementationOnce(
        () => new Promise((resolve) => {
          finishRefetch = resolve
        }),
      )

    await qc.prefetchQuery({ queryKey: key, queryFn })

    let settled = false
    const settling = settleMutation(qc, {
      invalidate: [['organization'], key],
    }).then(() => {
      settled = true
    })

    await vi.waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2))
    expect(settled).toBe(false)

    finishRefetch?.([{ id: 'fresh' }])
    await settling

    expect(qc.getQueryData(key)).toEqual([{ id: 'fresh' }])
    expect(queryFn).toHaveBeenCalledTimes(2)
  })

  it('keeps authoritative mutation-only caches fetchable later', async () => {
    const qc = new QueryClient()
    const detailKey = ['members', 'created'] as const
    const created = { id: 'created', name: 'Server copy' }

    qc.setQueryData(detailKey, created)

    await settleMutation(qc, { invalidate: [['members']] })

    expect(qc.getQueryData(detailKey)).toEqual(created)
    expect(qc.getQueryState(detailKey)).toMatchObject({
      isInvalidated: true,
      status: 'success',
    })
  })
})
