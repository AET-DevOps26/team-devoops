import { type FormEvent, useMemo, useRef, useState } from 'react'
import { Download, FileText, Mail, Send } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/ui/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/features/auth'
import { useTeamsList } from '@/features/organization/api/queries'
import { serverErrorMessage } from '@/lib/server-error'
import { cn } from '@/lib/utils'
import { isTeamCoach, type Team } from '@/types'
import { useGeneratePdf, useSendMail } from '../api'

type LetterMode = 'mail' | 'pdf'

const TEMPLATE_TOKENS = [
  '{{first_name}}',
  '{{last_name}}',
  '{{full_name}}',
  '{{email}}',
  '{{address}}',
  '{{phone_number}}',
  '{{birthday}}',
  '{{joining_date}}',
  '{{team_name}}',
  '{{sport_name}}',
  '{{balance}}',
] as const

const MODE_COPY = {
  mail: {
    label: 'Mail',
    submit: 'Send Mail',
    pending: 'Sending',
    success: 'Mail sent to your team.',
  },
  pdf: {
    label: 'PDF',
    submit: 'Download PDF',
    pending: 'Generating',
    success: 'PDF generated for your team.',
  },
} as const satisfies Record<
  LetterMode,
  { label: string; submit: string; pending: string; success: string }
>

export function LettersPage() {
  const { user } = useAuth()
  const teamsQuery = useTeamsList(user.role === 'trainer')

  const coachedTeams = useMemo(
    () => (teamsQuery.data ?? []).filter((team) => isTeamCoach(team, user.id)),
    [teamsQuery.data, user.id],
  )

  if (user.role !== 'trainer') {
    return (
      <LettersFrame>
        <EmptyState
          title="Letters are not available for this role."
          description="Coach letters are scoped to the coach's own team."
        />
      </LettersFrame>
    )
  }

  if (teamsQuery.isLoading) {
    return (
      <LettersFrame>
        <LoadingState />
      </LettersFrame>
    )
  }

  if (teamsQuery.error) {
    return (
      <LettersFrame>
        <p className="border border-destructive/30 bg-destructive/10 px-4 py-3 text-body-sm text-destructive">
          {serverErrorMessage(teamsQuery.error)}
        </p>
      </LettersFrame>
    )
  }

  if (coachedTeams.length === 0) {
    return (
      <LettersFrame>
        <EmptyState
          title="No coached team found."
          description="Letters are sent to your own team once a team lists you as coach."
        />
      </LettersFrame>
    )
  }

  return (
    <LettersFrame>
      <LettersComposer coachedTeams={coachedTeams} />
    </LettersFrame>
  )
}

function LettersFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-6">
      <PageHeader
        eyebrow="My Club"
        title="Letters"
        subtitle="Compose mail and PDF templates for your team."
      />
      {children}
    </div>
  )
}

function LettersComposer({ coachedTeams }: { coachedTeams: Team[] }) {
  const sendMail = useSendMail()
  const generatePdf = useGeneratePdf()
  const templateRef = useRef<HTMLTextAreaElement>(null)
  const [mode, setMode] = useState<LetterMode>('mail')
  const [subject, setSubject] = useState('')
  const [template, setTemplate] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const isPending = sendMail.isPending || generatePdf.isPending

  const setModeSafely = (nextMode: LetterMode) => {
    setMode(nextMode)
    setFormError(null)
    setNotice(null)
  }

  const insertTemplateToken = (token: string) => {
    const textarea = templateRef.current

    if (!textarea) {
      setTemplate((current) => `${current}${current.length > 0 ? ' ' : ''}${token}`)
      return
    }

    let nextCursor = 0

    setTemplate((current) => {
      const start = textarea.selectionStart ?? current.length
      const end = textarea.selectionEnd ?? current.length
      const next = `${current.slice(0, start)}${token}${current.slice(end)}`
      nextCursor = start + token.length
      return next
    })

    window.requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(nextCursor, nextCursor)
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (mode === 'mail' && subject.trim() === '') {
      setFormError('Subject is required.')
      setNotice(null)
      return
    }

    if (template.trim() === '') {
      setFormError('Template is required.')
      setNotice(null)
      return
    }

    setFormError(null)
    setNotice(null)

    try {
      if (mode === 'mail') {
        await sendMail.mutateAsync({ subject: subject.trim(), template })
      } else {
        const pdf = await generatePdf.mutateAsync({ template })
        downloadBlob(pdf, pdfFileName(coachedTeams))
      }

      setNotice(MODE_COPY[mode].success)
    } catch (error) {
      setFormError(serverErrorMessage(error))
    }
  }

  return (
    <>
      <section className="border border-primary/30 bg-primary/4 px-4 py-3">
        <p className="text-caption font-semibold uppercase tracking-[0.12em] text-primary">
          Audience
        </p>
        <p className="mt-1 text-body-sm text-text-primary">
          {audienceSentence(coachedTeams)}
        </p>
      </section>

      {notice && (
        <p
          role="status"
          className="border border-primary/25 bg-primary/8 px-4 py-3 text-body-sm text-text-primary"
        >
          {notice}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <form className="space-y-5 border bg-card p-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div
              className="inline-flex w-full border bg-background p-1 sm:w-auto"
              role="group"
              aria-label="Letter type"
            >
              <ModeButton mode="mail" activeMode={mode} onSelect={setModeSafely} />
              <ModeButton mode="pdf" activeMode={mode} onSelect={setModeSafely} />
            </div>

            <Badge tone="accent" className="justify-start sm:justify-center">
              {teamLabel(coachedTeams)}
            </Badge>
          </div>

          {mode === 'mail' && (
            <div className="space-y-1.5">
              <Label htmlFor="letter-subject">Subject</Label>
              <Input
                id="letter-subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                required
                disabled={isPending}
                aria-invalid={formError !== null && subject.trim() === ''}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="letter-template">Template</Label>
            <Textarea
              ref={templateRef}
              id="letter-template"
              value={template}
              onChange={(event) => setTemplate(event.target.value)}
              required
              disabled={isPending}
              aria-invalid={formError !== null && template.trim() === ''}
              className="min-h-72 font-mono text-sm leading-relaxed"
            />
          </div>

          {formError && (
            <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
              {formError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="submit" disabled={isPending}>
              {mode === 'mail' ? <Send /> : <Download />}
              {isPending ? MODE_COPY[mode].pending : MODE_COPY[mode].submit}
            </Button>
          </div>
        </form>

        <aside className="space-y-3 border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-caption font-semibold uppercase tracking-[0.12em] text-text-tertiary">
              Placeholders
            </h2>
            <Badge size="sm">{TEMPLATE_TOKENS.length}</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {TEMPLATE_TOKENS.map((token) => (
              <button
                key={token}
                type="button"
                disabled={isPending}
                onClick={() => insertTemplateToken(token)}
                className="border bg-background px-2 py-1 font-mono text-caption text-text-secondary transition-colors hover:border-primary/50 hover:text-text-primary disabled:pointer-events-none disabled:opacity-50"
              >
                {token}
              </button>
            ))}
          </div>

          <div className="border-t pt-3">
            <p className="text-caption font-semibold uppercase tracking-[0.12em] text-text-tertiary">
              Template text
            </p>
            <pre className="mt-2 max-h-52 overflow-auto border bg-background p-3 font-mono text-caption leading-relaxed text-text-secondary whitespace-pre-wrap">
              {template || ' '}
            </pre>
          </div>
        </aside>
      </div>
    </>
  )
}

function ModeButton({
  mode,
  activeMode,
  onSelect,
}: {
  mode: LetterMode
  activeMode: LetterMode
  onSelect: (mode: LetterMode) => void
}) {
  const active = mode === activeMode
  const Icon = mode === 'mail' ? Mail : FileText

  return (
    <Button
      type="button"
      variant={active ? 'default' : 'ghost'}
      size="sm"
      aria-pressed={active}
      onClick={() => onSelect(mode)}
      className={cn('flex-1 sm:flex-none', !active && 'text-text-secondary')}
    >
      <Icon />
      {MODE_COPY[mode].label}
    </Button>
  )
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-4 border bg-card p-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="ml-auto h-10 w-32" />
      </div>
      <Skeleton className="h-80 border" />
    </div>
  )
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="border bg-card px-4 py-8 text-center">
      <p className="text-body-sm font-medium text-text-primary">{title}</p>
      <p className="mt-1 text-caption text-text-tertiary">{description}</p>
    </div>
  )
}

function audienceSentence(teams: Team[]) {
  if (teams.length === 1) {
    return `This will go to everyone on ${teams[0].name}.`
  }

  return `This will go to everyone on your coached teams: ${teams.map((team) => team.name).join(', ')}.`
}

function teamLabel(teams: Team[]) {
  if (teams.length === 1) return teams[0].name
  return `${teams.length} teams`
}

function pdfFileName(teams: Team[]) {
  const base = teams.length === 1 ? teams[0].name : 'team-letter'
  const safeBase = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return `${safeBase || 'team-letter'}.pdf`
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}
