import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ThemeProvider } from '@/app/theme/ThemeProvider'
import AuthenticatedApp from './AuthenticatedApp.tsx'
import '@/index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: (failureCount, error) => {
        if (
          error instanceof AxiosError &&
          error.response &&
          error.response.status >= 400 &&
          error.response.status < 500
        ) {
          return false
        }
        return failureCount < 2
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthenticatedApp queryClient={queryClient} />
    </ThemeProvider>
  </StrictMode>,
)
