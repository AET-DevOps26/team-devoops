import { type FormEvent, useMemo, useRef, useState } from 'react'
import { Code2, Download, Eye, FileText, Mail, Send, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/ui/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuth } from '@/features/auth'
import { useSportsList, useTeamsList } from '@/features/organization/api/queries'
import { serverErrorMessage } from '@/lib/server-error'
import { cn } from '@/lib/utils'
import { isTeamCoach, type Sport, type Team } from '@/types'
import { useGeneratePdf, useSendMail } from '../api'
import {
  createSampleValues,
  createTemplatePreviewSrcDoc,
  type TemplateSampleScope,
  type TemplateSampleValues,
  type TemplateToken,
} from '../model/templatePreview'

type LetterMode = 'mail' | 'pdf'
type ComposerPanel = 'edit' | 'preview'
type Audience =
  | { kind: 'coach'; teams: Team[] }
  | { kind: 'director'; sports: Sport[] }
  | { kind: 'admin' }

interface TemplateTokenOption {
  token: TemplateToken
  label: string
}

interface TemplateTokenGroup {
  name: string
  description: string
  tokens: readonly TemplateTokenOption[]
}

interface TemplateSnippet {
  label: string
  description: string
  value: string
}

const MODE_COPY = {
  mail: {
    label: 'Mail',
    submit: 'Send Mail',
    pending: 'Sending',
    success: (target: string) => `Mail sent to ${target}.`,
  },
  pdf: {
    label: 'PDF',
    submit: 'Download PDF',
    pending: 'Generating',
    success: (target: string) => `PDF generated for ${target}.`,
  },
} as const satisfies Record<
  LetterMode,
  { label: string; submit: string; pending: string; success: (target: string) => string }
>

const TEMPLATE_TOKEN_GROUPS = [
  {
    name: 'Member',
    description: 'Recipient identity and contact fields',
    tokens: [
      { token: '{{first_name}}', label: 'First name' },
      { token: '{{last_name}}', label: 'Last name' },
      { token: '{{full_name}}', label: 'Full name' },
      { token: '{{email}}', label: 'Email' },
      { token: '{{phone_number}}', label: 'Phone' },
      { token: '{{address}}', label: 'Address' },
      { token: '{{birthday}}', label: 'Birthday' },
      { token: '{{joining_date}}', label: 'Joining date' },
    ],
  },
  {
    name: 'Team',
    description: 'Role-scoped team and sport values',
    tokens: [
      { token: '{{team_name}}', label: 'Team name' },
      { token: '{{sport_name}}', label: 'Sport name' },
    ],
  },
  {
    name: 'Finance',
    description: 'Current account values',
    tokens: [{ token: '{{balance}}', label: 'Balance' }],
  },
] as const satisfies readonly TemplateTokenGroup[]

const STARTER_TEMPLATE_HINT = `<h1>Hello {{first_name}},</h1>
<p>Write your message here.</p>
<p>Your team: {{team_name}}</p>`

const TEMPLATE_SNIPPETS = [
  {
    label: 'Greeting',
    description: 'Personal opening with the member first name',
    value: '<p>Hello {{first_name}},</p>\n',
  },
  {
    label: 'Heading',
    description: 'Large title for the letter or email',
    value: '<h1>Heading</h1>\n',
  },
  {
    label: 'Paragraph',
    description: 'Standard body copy block',
    value: '<p>Write your message here.</p>\n',
  },
  {
    label: 'Line break',
    description: 'New line inside a paragraph or signature',
    value: '<br />',
  },
  {
    label: 'Divider',
    description: 'Horizontal separation between sections',
    value: '<hr />\n',
  },
  {
    label: 'Signature',
    description: 'Closing block with a line break',
    value: '<p>Kind regards,<br />Your club team</p>\n',
  },
] as const satisfies readonly TemplateSnippet[]

export function LettersPage() {
  const { user } = useAuth()
  const isCoach = user.role === 'trainer'
  const isDirector = user.role === 'director'
  const isAdmin = user.role === 'admin'
  const teamsQuery = useTeamsList(isCoach)
  const sportsQuery = useSportsList(isDirector)

  const coachedTeams = useMemo(
    () => (teamsQuery.data ?? []).filter((team) => isTeamCoach(team, user.id)),
    [teamsQuery.data, user.id],
  )

  const directedSports = useMemo(
    () => (sportsQuery.data ?? []).filter((sport) => isSportDirector(sport, user.id)),
    [sportsQuery.data, user.id],
  )

  if (!isCoach && !isDirector && !isAdmin) {
    return (
      <LettersFrame>
        <EmptyState
          title="Letters are not available for this role."
          description="Letters are scoped to coaches, directors, and admins."
        />
      </LettersFrame>
    )
  }

  const scopeQuery = isCoach ? teamsQuery : isDirector ? sportsQuery : null

  if (scopeQuery?.isLoading) {
    return (
      <LettersFrame>
        <LoadingState />
      </LettersFrame>
    )
  }

  if (scopeQuery?.error) {
    return (
      <LettersFrame>
        <p className="border border-destructive/30 bg-destructive/10 px-4 py-3 text-body-sm text-destructive">
          {serverErrorMessage(scopeQuery.error)}
        </p>
      </LettersFrame>
    )
  }

  if (isCoach && coachedTeams.length === 0) {
    return (
      <LettersFrame>
        <EmptyState
          title="No coached team found."
          description="Letters are sent to your own team once a team lists you as coach."
        />
      </LettersFrame>
    )
  }

  if (isDirector && directedSports.length === 0) {
    return (
      <LettersFrame>
        <EmptyState
          title="No directed sport found."
          description="Letters are sent to your sport once a sport lists you as director."
        />
      </LettersFrame>
    )
  }

  const audience: Audience = isCoach
    ? { kind: 'coach', teams: coachedTeams }
    : isDirector
      ? { kind: 'director', sports: directedSports }
      : { kind: 'admin' }

  return (
    <LettersFrame>
      <LettersComposer audience={audience} />
    </LettersFrame>
  )
}

function LettersFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-6">
      <PageHeader
        eyebrow="My Club"
        title="Letters"
        subtitle="Compose mail and PDF templates for your audience."
      />
      {children}
    </div>
  )
}

function LettersComposer({ audience }: { audience: Audience }) {
  const sendMail = useSendMail()
  const generatePdf = useGeneratePdf()
  const templateRef = useRef<HTMLTextAreaElement>(null)
  const [mode, setMode] = useState<LetterMode>('mail')
  const [activePanel, setActivePanel] = useState<ComposerPanel>('edit')
  const [subject, setSubject] = useState('')
  const [template, setTemplate] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const isPending = sendMail.isPending || generatePdf.isPending
  const hasTemplate = template.trim().length > 0
  const sampleValues = useMemo(
    () => createSampleValues(audienceSampleScope(audience)),
    [audience],
  )
  const previewSrcDoc = useMemo(
    () => createTemplatePreviewSrcDoc(template, sampleValues),
    [sampleValues, template],
  )

  const setModeSafely = (nextMode: LetterMode) => {
    setMode(nextMode)
    setFormError(null)
    setNotice(null)
  }

  const insertTemplateText = (text: string, fallbackSeparator = '') => {
    const textarea = templateRef.current

    if (!textarea) {
      setTemplate((current) => `${current}${current.length > 0 ? fallbackSeparator : ''}${text}`)
      return
    }

    let nextCursor = 0

    setTemplate((current) => {
      const start = textarea.selectionStart ?? current.length
      const end = textarea.selectionEnd ?? current.length
      const next = `${current.slice(0, start)}${text}${current.slice(end)}`
      nextCursor = start + text.length
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
        downloadBlob(pdf, pdfFileName(audience))
      }

      setNotice(MODE_COPY[mode].success(audienceTarget(audience)))
    } catch (error) {
      setFormError(serverErrorMessage(error))
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Card className="gap-0 overflow-hidden p-0">
        <CardContent className="space-y-5 p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[11rem_minmax(0,1fr)_auto] lg:items-end">
            <div className="space-y-2">
              <p className="text-caption font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                Format
              </p>
              <div
                className="inline-flex h-10 w-full border bg-background p-0.5 sm:w-auto"
                role="group"
                aria-label="Letter type"
              >
                <ModeButton mode="mail" activeMode={mode} onSelect={setModeSafely} />
                <ModeButton mode="pdf" activeMode={mode} onSelect={setModeSafely} />
              </div>
            </div>

            {mode === 'mail' && (
              <div className="min-w-0 space-y-2">
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

            {mode === 'pdf' && <div className="hidden lg:block" aria-hidden="true" />}

            <Button
              type="submit"
              disabled={isPending}
              className="h-10 w-full lg:w-auto"
            >
              {mode === 'mail' ? <Send /> : <Download />}
              {isPending ? MODE_COPY[mode].pending : MODE_COPY[mode].submit}
            </Button>
          </div>

          <AudienceSummary audience={audience} />
        </CardContent>
      </Card>

      {notice && (
        <ComposerAlert role="status" tone="success">
          {notice}
        </ComposerAlert>
      )}

      {formError && (
        <ComposerAlert role="alert" tone="error">
          {formError}
        </ComposerAlert>
      )}

      <div
        className="grid grid-cols-2 border bg-card p-1 lg:hidden"
        role="tablist"
        aria-label="Composer panels"
      >
        <PanelTabButton panel="edit" activePanel={activePanel} onSelect={setActivePanel} />
        <PanelTabButton panel="preview" activePanel={activePanel} onSelect={setActivePanel} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[19rem_minmax(0,1fr)]">
        <div className={cn(activePanel !== 'edit' && 'hidden xl:block')}>
          <TokenPalette
            disabled={isPending}
            sampleValues={sampleValues}
            onInsertSnippet={(snippet) => insertTemplateText(snippet, '\n\n')}
            onInsertToken={(token) => insertTemplateText(token, ' ')}
          />
        </div>

        <EditorPreviewPane
          activePanel={activePanel}
          formError={formError}
          hasTemplate={hasTemplate}
          isPending={isPending}
          mode={mode}
          previewSrcDoc={previewSrcDoc}
          template={template}
          templateRef={templateRef}
          onTemplateChange={setTemplate}
        />
      </div>
    </form>
  )
}

function AudienceSummary({ audience }: { audience: Audience }) {
  return (
    <div className="border-t pt-5">
      <div className="flex min-w-0 items-start gap-2.5">
        <Users className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-caption font-semibold uppercase tracking-[0.12em] text-primary">
              Audience
            </p>
            <Badge tone="accent" size="sm" className="justify-start">
              {audienceLabel(audience)}
            </Badge>
          </div>
          <p className="text-caption text-text-secondary sm:text-body-sm">
            {audienceSentence(audience)}
          </p>
        </div>
      </div>
    </div>
  )
}

function ComposerAlert({
  role,
  tone,
  children,
}: {
  role: 'alert' | 'status'
  tone: 'error' | 'success'
  children: React.ReactNode
}) {
  return (
    <p
      role={role}
      className={cn(
        'border px-4 py-3 text-body-sm',
        tone === 'error'
          ? 'border-destructive/30 bg-destructive/10 text-destructive'
          : 'border-primary/25 bg-primary/8 text-text-primary',
      )}
    >
      {children}
    </p>
  )
}

function PanelTabButton({
  panel,
  activePanel,
  onSelect,
}: {
  panel: ComposerPanel
  activePanel: ComposerPanel
  onSelect: (panel: ComposerPanel) => void
}) {
  const active = panel === activePanel
  const Icon = panel === 'edit' ? Code2 : Eye
  const label = panel === 'edit' ? 'Edit' : 'Preview'

  return (
    <button
      id={`letters-${panel}-tab`}
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls={`letters-${panel}-panel`}
      onClick={() => onSelect(panel)}
      className={cn(
        'inline-flex h-9 items-center justify-center gap-1.5 px-3 text-xs font-semibold uppercase tracking-widest transition-colors focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-text-secondary hover:bg-muted hover:text-text-primary',
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </button>
  )
}

function TokenPalette({
  disabled,
  sampleValues,
  onInsertSnippet,
  onInsertToken,
}: {
  disabled: boolean
  sampleValues: TemplateSampleValues
  onInsertSnippet: (snippet: string) => void
  onInsertToken: (token: TemplateToken) => void
}) {
  return (
    <TooltipProvider>
      <Card className="gap-0 overflow-hidden p-0 xl:sticky xl:top-4">
        <CardHeader className="border-b p-4">
          <div className="min-w-0">
            <h2 className="text-body font-semibold text-text-primary">Insert library</h2>
            <p className="mt-1 text-caption text-text-tertiary">
              Add common structure or personalized member fields at the cursor.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-4">
          <section className="space-y-3">
            <div>
              <h2 className="text-caption font-semibold uppercase tracking-[0.12em] text-text-primary">
                Content blocks
              </h2>
              <p className="mt-1 text-caption text-text-tertiary">
                Headings, line breaks, and reusable letter sections.
              </p>
            </div>

            <div className="-mx-4 roost-scroll overflow-x-auto px-4 pb-1 sm:mx-0 sm:overflow-visible sm:px-0">
              <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
                {TEMPLATE_SNIPPETS.map((snippet) => (
                  <Tooltip key={snippet.label}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        disabled={disabled}
                        aria-label={`Insert ${snippet.label} block`}
                        onClick={() => onInsertSnippet(snippet.value)}
                        className="border bg-background px-3 py-2 text-caption font-medium text-text-secondary transition-colors hover:border-primary/50 hover:bg-primary/8 hover:text-text-primary focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                      >
                        {snippet.label}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={6} className="flex-col items-start">
                      <span>{snippet.description}</span>
                      <span className="font-mono text-background/70">{snippet.value.trim()}</span>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-caption font-semibold uppercase tracking-[0.12em] text-text-primary">
                Data placeholders
              </h2>
              <p className="mt-1 text-caption text-text-tertiary">
                Member, team, and finance values resolved per recipient.
              </p>
            </div>

            <div className="space-y-4">
              {TEMPLATE_TOKEN_GROUPS.map((group) => (
                <div key={group.name} className="space-y-2">
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                    <h3 className="text-caption font-semibold uppercase tracking-[0.12em] text-text-secondary">
                      {group.name}
                    </h3>
                    <p className="hidden text-caption text-text-tertiary sm:block">
                      {group.description}
                    </p>
                  </div>

                  <div className="-mx-4 roost-scroll overflow-x-auto px-4 pb-1 sm:mx-0 sm:overflow-visible sm:px-0">
                    <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
                      {group.tokens.map((item) => (
                        <Tooltip key={item.token}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              disabled={disabled}
                              aria-label={`Insert ${item.label} placeholder ${item.token}`}
                              onClick={() => onInsertToken(item.token)}
                              className="border bg-background px-3 py-2 text-caption font-medium text-text-secondary transition-colors hover:border-primary/50 hover:bg-primary/8 hover:text-text-primary focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                            >
                              {item.label}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent sideOffset={6} className="flex-col items-start">
                            <span className="font-mono">{item.token}</span>
                            <span className="text-background/70">
                              Sample: {sampleValues[item.token]}
                            </span>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

function EditorPreviewPane({
  activePanel,
  formError,
  hasTemplate,
  isPending,
  mode,
  previewSrcDoc,
  template,
  templateRef,
  onTemplateChange,
}: {
  activePanel: ComposerPanel
  formError: string | null
  hasTemplate: boolean
  isPending: boolean
  mode: LetterMode
  previewSrcDoc: string
  template: string
  templateRef: React.RefObject<HTMLTextAreaElement | null>
  onTemplateChange: (template: string) => void
}) {
  return (
    <Card className="h-full gap-0 overflow-hidden p-0">
      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        <section
          id="letters-edit-panel"
          role="tabpanel"
          aria-labelledby="letters-edit-tab"
          className={cn('min-w-0', activePanel !== 'edit' && 'hidden lg:block')}
        >
          <div className="flex h-full min-h-0 flex-col">
            <div className="border-b p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-body font-semibold text-text-primary">Template source</h2>
                  <p className="mt-1 text-caption text-text-tertiary">
                    Write the HTML body and add reusable blocks or member fields.
                  </p>
                </div>
                <Badge tone="accent" size="sm">
                  HTML
                </Badge>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
              <Label htmlFor="letter-template">Template</Label>
              <Textarea
                ref={templateRef}
                id="letter-template"
                value={template}
                onChange={(event) => onTemplateChange(event.target.value)}
                placeholder={STARTER_TEMPLATE_HINT}
                disabled={isPending}
                required
                aria-describedby="letter-template-help"
                aria-invalid={formError !== null && template.trim() === ''}
                className="h-[22rem] resize-y font-mono text-sm leading-relaxed sm:h-[28rem] lg:h-[34rem]"
              />
              <p id="letter-template-help" className="text-caption text-text-tertiary">
                Use the insert library for structure and personalized data.
              </p>
            </div>
          </div>
        </section>

        <section
          id="letters-preview-panel"
          role="tabpanel"
          aria-labelledby="letters-preview-tab"
          className={cn(
            'min-w-0 border-t lg:border-t-0 lg:border-l',
            activePanel !== 'preview' && 'hidden lg:block',
          )}
        >
          <div className="flex h-full min-h-0 flex-col">
            <div className="border-b p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-body font-semibold text-text-primary">Live preview</h2>
                  <p className="mt-1 text-caption text-text-tertiary">
                    Rendered with sample recipient data.
                  </p>
                </div>
                <CardAction className="flex shrink-0 flex-wrap gap-2">
                  <Badge tone="accent" size="sm">
                    Sample data
                  </Badge>
                  <Badge size="sm">{mode === 'mail' ? 'Email' : 'PDF body'}</Badge>
                </CardAction>
              </div>
            </div>

            <div className="flex-1 bg-surface-sunken p-4 sm:p-5">
              <div className="mx-auto w-full max-w-[44rem] overflow-hidden border bg-white shadow-sm dark:border-white/10">
                <div className="border-b bg-slate-50 px-3 py-2 text-caption text-slate-500">
                  {mode === 'mail' ? 'Message preview' : 'Document preview'}
                </div>

                {hasTemplate ? (
                  <iframe
                    title="Letter template sample preview"
                    srcDoc={previewSrcDoc}
                    sandbox=""
                    referrerPolicy="no-referrer"
                    className="h-[26rem] w-full border-0 bg-white sm:h-[32rem] lg:h-[34rem]"
                  />
                ) : (
                  <div className="flex h-[26rem] items-center justify-center bg-white px-6 text-center text-body-sm text-slate-500 sm:h-[32rem] lg:h-[34rem]">
                    Start with a blank template or insert placeholders from the editor.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Card>
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
    <div className="space-y-5">
      <div className="space-y-5 border bg-card p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[11rem_minmax(0,1fr)_auto] lg:items-end">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="flex items-start gap-2.5 border-t pt-5">
          <Skeleton className="h-4 w-4" />
          <div className="w-full space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[19rem_minmax(0,1fr)]">
        <div className="space-y-4 border bg-card p-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div className="grid grid-cols-1 border bg-card lg:grid-cols-2">
          <div className="space-y-4 p-4 sm:p-5">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-[22rem] w-full sm:h-[28rem] lg:h-[34rem]" />
          </div>
          <div className="space-y-4 border-t p-4 sm:p-5 lg:border-t-0 lg:border-l">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-[26rem] w-full sm:h-[32rem] lg:h-[34rem]" />
          </div>
        </div>
      </div>
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

function isSportDirector(sport: Sport, userId: string): boolean {
  return sport.directors.some((director) => director.id === userId)
}

function audienceSentence(audience: Audience) {
  if (audience.kind === 'admin') {
    return 'This will go to all members.'
  }

  if (audience.kind === 'director') {
    const { sports } = audience

    if (sports.length === 1) {
      return `This will go to everyone in ${sports[0].name}.`
    }

    return `This will go to everyone in your directed sports: ${sports.map((sport) => sport.name).join(', ')}.`
  }

  const { teams } = audience

  if (teams.length === 1) {
    return `This will go to everyone on ${teams[0].name}.`
  }

  return `This will go to everyone on your coached teams: ${teams.map((team) => team.name).join(', ')}.`
}

function audienceLabel(audience: Audience) {
  if (audience.kind === 'admin') return 'All members'

  if (audience.kind === 'director') {
    const { sports } = audience
    if (sports.length === 1) return sports[0].name
    return `${sports.length} sports`
  }

  const { teams } = audience
  if (teams.length === 1) return teams[0].name
  return `${teams.length} teams`
}

function audienceSampleScope(audience: Audience): TemplateSampleScope {
  if (audience.kind === 'coach') {
    const team = audience.teams[0]

    return {
      teamName: team?.name,
      sportName: team?.sport.name,
    }
  }

  if (audience.kind === 'director') {
    return {
      sportName: audience.sports[0]?.name,
    }
  }

  return {}
}

function audienceTarget(audience: Audience) {
  if (audience.kind === 'admin') return 'all members'

  if (audience.kind === 'director') {
    const { sports } = audience
    return sports.length === 1 ? sports[0].name : 'your directed sports'
  }

  const { teams } = audience
  return teams.length === 1 ? teams[0].name : 'your coached teams'
}

function pdfFileName(audience: Audience) {
  const base =
    audience.kind === 'admin'
      ? 'all-members'
      : audience.kind === 'director'
        ? audience.sports.length === 1
          ? audience.sports[0].name
          : 'sport-letter'
        : audience.teams.length === 1
          ? audience.teams[0].name
          : 'team-letter'

  const safeBase = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return `${safeBase || 'letter'}.pdf`
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
