import { useQuery } from '@tanstack/react-query'

import { helperClient } from './client'

export const helperKeys = {
  report: (memberId: string) => ['helper', 'report', memberId] as const,
}

export function useMemberReport(memberId: string) {
  return useQuery<string>({
    queryKey: helperKeys.report(memberId),
    queryFn: () => helperClient.get<string>(`/report/${memberId}`).then(r => r.data),
    enabled: !!memberId,
  })
}
