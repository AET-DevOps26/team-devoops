import { useAuth } from '@/features/auth'
import { useMemberReport } from '../api/queries'

export function useReportViewModel(memberId?: string) {
  const { user } = useAuth()
  const resolvedMemberId = memberId ?? user.id
  const reportQuery = useMemberReport(resolvedMemberId)

  return {
    text: reportQuery.data ?? '',
    isLoading: reportQuery.isLoading,
    isError: reportQuery.isError,
  }
}
