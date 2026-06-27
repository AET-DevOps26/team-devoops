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
      lettersClient.post('/mail', data.html, {
        headers: { 'Content-Type': 'text/html' },
      }).then(() => undefined),
  })
}

export function useGeneratePdf() {
  return useMutation<Blob, Error, GeneratePdfRequest>({
    mutationFn: data =>
      lettersClient.post<Blob>('/pdf', data.html, {
        headers: { 'Content-Type': 'text/html' },
        responseType: 'blob',
      }).then(r => r.data),
  })
}
