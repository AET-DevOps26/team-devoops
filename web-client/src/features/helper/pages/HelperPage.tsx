import { useState } from 'react'
import { BookOpenText, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

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
import { ErrorNotice } from '@/components/ui/ErrorNotice'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/ui/page-header'
import { PendingButtonContent } from '@/components/ui/pending-button'
import { RowActionButton, RowActions } from '@/components/ui/row-action-button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { notifyMutationError } from '@/lib/mutation-feedback'
import { serverErrorMessage } from '@/lib/server-error'
import { mutationFeedbackCopy } from '@/lib/mutation-feedback-copy'
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
    error,
    refetch,
    generate,
    isGenerating,
    isAwaitingReport,
    listKey,
  } = useReportViewModel()

  const openReportId = useHelperUiStore((state) => state.openReportId)
  const openReport = useHelperUiStore((state) => state.open)
  const closeReport = useHelperUiStore((state) => state.close)
  const detailView = useReportDetailView(openReportId)
  const deleteReport = useDeleteReport()

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [useLocalLlm, setUseLocalLlm] = useState(false)

  const onGenerate = async () => {
    try {
      await generate(useLocalLlm)
      toast.success('Report generation started.', {
        description: 'It will appear below when it is ready.',
      })
    } catch (error) {
      notifyMutationError(error, mutationFeedbackCopy.report.generate)
    }
  }

  const requestDelete = (reportId: string) => {
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
      notifyMutationError(deleteFailure, mutationFeedbackCopy.report.delete)
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

      <Card className="max-w-content-narrow">
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-body-sm text-text-secondary">
                Generate a fresh report{scope === 'team' ? ` for ${subjectLabel}` : ''}. Reports are
                produced in the background and appear in the list below once ready.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  id="use-local-llm"
                  checked={useLocalLlm}
                  onCheckedChange={setUseLocalLlm}
                  disabled={isGenerating || isAwaitingReport}
                />
                <Label htmlFor="use-local-llm" className="text-body-sm text-text-secondary">
                  Use local LLM
                </Label>
              </div>
              <Button onClick={onGenerate} disabled={isGenerating || isAwaitingReport}>
                {isGenerating ? 'Starting…' : isAwaitingReport ? 'Generating…' : 'Generate report'}
              </Button>
            </div>
          </div>

          <Separator />

          {isAwaitingReport && (
            <div
              className="flex items-center gap-3 border border-primary/25 bg-primary/5 px-4 py-3"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
              <div className="min-w-0">
                <p className="text-body-sm font-medium text-text-primary">
                  Generating your report…
                </p>
                <p className="text-caption text-text-tertiary">
                  This can take a moment. It will appear in the list below automatically.
                </p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-4/5" />
            </div>
          ) : isError ? (
            <ErrorNotice message={serverErrorMessage(error)} onRetry={refetch} />
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
                  <RowActions className="shrink-0">
                    <RowActionButton
                      icon={BookOpenText}
                      label={`Read report for ${row.subject}`}
                      onClick={() => openReport(row.id)}
                    />
                    <RowActionButton
                      icon={Trash2}
                      label={`Delete report for ${row.subject}`}
                      destructive
                      onClick={() => requestDelete(row.id)}
                      disabled={deleteReport.isPending}
                    />
                  </RowActions>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Sheet open={openReportId !== null} onOpenChange={(open) => !open && closeReport()}>
        <SheetContent className="roost-scroll w-full gap-0 overflow-y-auto sm:max-w-lg">
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
              {deleteReport.isPending ? (
                <PendingButtonContent pendingLabel="Deleting…" />
              ) : (
                'Delete'
              )}
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
  const { text, subject, dateLabel, isLoading, isError, error, refetch } = detailView

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
      <div className="m-8">
        <ErrorNotice message={serverErrorMessage(error)} onRetry={refetch} compact />
      </div>
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
