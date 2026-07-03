import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { serverErrorMessage } from '@/lib/server-error'
import { useHelperUiStore } from '../model/helperUiStore'
import {
  useDeleteReport,
  useReportDetailView,
  useReportViewModel,
} from '../model/useReportViewModel'
import { ReportMarkdown } from './ReportMarkdown'

export function HelperPage() {
  const {
    scope,
    subjectLabel,
    rows,
    isLoading,
    isError,
    generate,
    isGenerating,
    generateError,
    listKey,
  } = useReportViewModel()

  const openReportId = useHelperUiStore((state) => state.openReportId)
  const openReport = useHelperUiStore((state) => state.open)
  const closeReport = useHelperUiStore((state) => state.close)
  const detailView = useReportDetailView(openReportId)
  const deleteReport = useDeleteReport()

  const [generated, setGenerated] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const onGenerate = () => {
    setGenerated(false)
    generate()
    // The result is async (the POST returns 202 with no body); confirm we kicked it off.
    setGenerated(true)
  }

  const requestDelete = (reportId: string) => {
    setDeleteError(null)
    setDeleteTargetId(reportId)
  }

  const confirmDelete = async () => {
    if (!deleteTargetId) return
    const reportId = deleteTargetId

    try {
      await deleteReport.mutateAsync({ reportId, listKey })
      if (reportId === openReportId) closeReport()
      setDeleteTargetId(null)
    } catch (deleteFailure) {
      setDeleteError(serverErrorMessage(deleteFailure))
      setDeleteTargetId(null)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="My Club"
        title="Development"
        subtitle={
          scope === 'team'
            ? `Development reports for ${subjectLabel}.`
            : 'Your progress reports from the coaching staff.'
        }
      />

      {deleteError && (
        <p className="border border-destructive/30 bg-destructive/10 px-4 py-3 text-body-sm text-destructive">
          {deleteError}
        </p>
      )}

      <Card className="max-w-content-narrow">
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-body-sm text-text-secondary">
                Generate a fresh report{scope === 'team' ? ` for ${subjectLabel}` : ''}. Reports are
                produced in the background and appear in the list below once ready.
              </p>
              {generated && !generateError && (
                <p className="text-body-sm text-text-tertiary">
                  Report generation started — refresh in a moment to see it.
                </p>
              )}
              {generateError && (
                <p className="text-body-sm text-destructive">{generateError.message}</p>
              )}
            </div>
            <Button onClick={onGenerate} disabled={isGenerating}>
              {isGenerating ? 'Starting…' : 'Generate report'}
            </Button>
          </div>

          <Separator />

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-4/5" />
            </div>
          ) : isError ? (
            <p className="text-body-sm text-destructive">
              We couldn’t load your development reports. Please try again later.
            </p>
          ) : rows.length === 0 ? (
            <p className="text-body-sm text-text-tertiary">
              No reports yet — generate one to get started.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {rows.map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-body font-medium text-text-primary">
                      {row.subject}
                    </p>
                    <p className="text-body-sm text-text-tertiary">{row.dateLabel}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="link"
                      className="h-auto p-0"
                      onClick={() => openReport(row.id)}
                    >
                      Read
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-text-tertiary hover:text-destructive"
                      onClick={() => requestDelete(row.id)}
                      disabled={deleteReport.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Sheet open={openReportId !== null} onOpenChange={(open) => !open && closeReport()}>
        <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-lg">
          <ReportDetailSheet detailView={detailView} />
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete report</AlertDialogTitle>
            <AlertDialogDescription>
              Delete {rows.find((row) => row.id === deleteTargetId)?.subject ?? 'this report'}?
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteReport.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={deleteReport.isPending} onClick={confirmDelete}>
              {deleteReport.isPending ? 'Deleting' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function ReportDetailSheet({
  detailView,
}: {
  detailView: ReturnType<typeof useReportDetailView>
}) {
  const { text, subject, dateLabel, isLoading, isError } = detailView

  if (isLoading) {
    return (
      <div className="space-y-6 p-8">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <p className="m-8 border bg-card px-4 py-3 text-body-sm text-destructive">
        We couldn’t load this report. Please try again later.
      </p>
    )
  }

  return (
    <>
      <SheetHeader>
        <p className="text-caption font-semibold uppercase tracking-[0.2em] text-text-tertiary">
          {dateLabel}
        </p>
        <SheetTitle className="font-display text-h2 uppercase tracking-wide">
          {subject}
        </SheetTitle>
      </SheetHeader>

      <div className="px-4 py-2">
        <ReportMarkdown text={text} />
      </div>
    </>
  )
}
