import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useReportViewModel } from '../model/useReportViewModel'
import { ReportMarkdown } from './ReportMarkdown'

export function HelperPage() {
  const { text, isLoading, isError } = useReportViewModel()

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="My Club"
        title="Development"
        subtitle="Your progress report from the coaching staff."
      />

      <Card className="max-w-content-narrow">
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ) : isError ? (
            <p className="text-body-sm text-text-tertiary">
              We couldn’t load your development report. Please try again later.
            </p>
          ) : text.trim() ? (
            <ReportMarkdown text={text} />
          ) : (
            <p className="text-body-sm text-text-tertiary">
              No development report is available yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
