import { useQuery } from '@tanstack/react-query'

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
    queryFn: () => helperClient.get<string>(`/report/${memberId}`).then(r => r.data),
    enabled: !!memberId,
  })
}
