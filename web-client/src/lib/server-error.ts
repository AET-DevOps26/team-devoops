import { isAxiosError } from 'axios'

type ServerErrorBody = {
  message?: string
}

export function serverErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (isAxiosError<ServerErrorBody>(error)) {
    return error.response?.data?.message ?? error.message
  }

  return error instanceof Error ? error.message : fallback
}
