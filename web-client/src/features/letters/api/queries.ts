import { useMutation } from '@tanstack/react-query'

import { lettersClient } from './client'
import type { GeneratePdfRequest, SendMailRequest } from '../types'

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
