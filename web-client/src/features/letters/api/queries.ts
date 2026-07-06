import { useMutation, useQuery } from '@tanstack/react-query'

import { mockOr } from '@/mocks/mockSwitch'
import { lettersClient } from './client'
import type { GeneratePdfRequest, SendMailRequest } from '../types'

const LETTER_SERVICE_LIVE_ENABLED = false

function lettersMockOr<T>(mock: () => T, live: () => T): T {
  // MOCK: Letter service is hello-world; live branch is contract-ready but unexercised.
  return LETTER_SERVICE_LIVE_ENABLED ? mockOr(mock, live) : mock()
}

export const lettersKeys = {
  hello: ['letters', 'hello'] as const,
}

export function useLettersHello() {
  return useQuery<string>({
    queryKey: lettersKeys.hello,
    queryFn: () =>
      lettersMockOr(
        () => Promise.resolve('Letters service mock'),
        () => lettersClient.get<string>('/hello').then(r => r.data),
      ),
  })
}

export function useSendMail() {
  return useMutation<void, Error, SendMailRequest>({
    mutationFn: data =>
      lettersMockOr(
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
      lettersMockOr(
        () => Promise.resolve(new Blob([data.template], { type: 'application/pdf' })),
        () =>
          lettersClient.post<Blob>('/pdf', data, {
            headers: { 'Content-Type': 'application/json' },
            responseType: 'blob',
          }).then(r => r.data),
      ),
  })
}
