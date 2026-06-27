import { useQuery } from '@tanstack/react-query'

import { getCurrentUser } from '@/features/auth/currentUser'
import { reportTextById } from '@/mocks/fixtures'
import { mockOr } from '@/mocks/mockSwitch'
import { scopeReport } from '@/mocks/scope'
import { helperClient } from './client'

export const helperKeys = {
  hello: ['helper', 'hello'] as const,
  report: (memberId: string) => ['helper', 'report', memberId] as const,
}

export function useHelperHello() {
  return useQuery<string>({
    queryKey: helperKeys.hello,
    queryFn: () => helperClient.get<string>('/hello').then(r => r.data),
  })
}

export function useMemberReport(memberId: string) {
  return useQuery<string>({
    queryKey: helperKeys.report(memberId),
    queryFn: () =>
      mockOr(
        () => {
          if (!scopeReport(memberId, getCurrentUser())) throw new Error('Report not found')
          return Promise.resolve(reportTextById[memberId] ?? '')
        },
        // NOTE: report retrieval endpoint is not shipped yet; path is a placeholder.
        () => helperClient.get<string>(`/report/${memberId}`).then(r => r.data),
      ),
    enabled: !!memberId,
  })
}
