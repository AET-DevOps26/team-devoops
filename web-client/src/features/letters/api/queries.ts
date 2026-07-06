import { useMutation, useQuery } from '@tanstack/react-query'

import { mockOr } from '@/mocks/mockSwitch'
import { lettersClient } from './client'
import type { GeneratePdfRequest, SendMailRequest } from '../types'

export const lettersKeys = {
  hello: ['letters', 'hello'] as const,
}

export function useLettersHello() {
  return useQuery<string>({
    queryKey: lettersKeys.hello,
    queryFn: () =>
      mockOr(
        () => Promise.resolve('Letters service mock'),
        () => lettersClient.get<string>('/hello').then(r => r.data),
      ),
  })
}

export function useSendMail() {
  return useMutation<void, Error, SendMailRequest>({
    mutationFn: data =>
      mockOr(
        () => Promise.resolve(),
        () =>
          lettersClient.post<void>('/mail', data, {
            headers: { 'Content-Type': 'application/json' },
          }).then(() => undefined),
      ),
  })
}

export function useGeneratePdf() {
  return useMutation<Blob, Error, GeneratePdfRequest>({
    mutationFn: data =>
      mockOr(
        () => Promise.resolve(new Blob([data.template], { type: 'application/pdf' })),
        () =>
          lettersClient.post<Blob>('/pdf', data, {
            headers: { 'Content-Type': 'application/json' },
            responseType: 'blob',
          }).then(r => r.data),
      ),
  })
}
