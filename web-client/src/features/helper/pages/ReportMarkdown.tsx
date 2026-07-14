import { Fragment, type ReactNode } from 'react'

// Safe renderer for untrusted AI report text: a tiny markdown subset (headings,
// bullets, bold/italic), everything else React-escaped. No dangerouslySetInnerHTML.
type Block =
  | { kind: 'heading'; level: 1 | 2 | 3; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'paragraph'; lines: string[] }

const headingClass: Record<1 | 2 | 3, string> = {
  1: 'mt-6 first:mt-0 text-display-sm font-display uppercase tracking-wide text-text-primary',
  2: 'mt-5 first:mt-0 text-body-lg font-semibold text-text-primary',
  3: 'mt-4 first:mt-0 text-body font-semibold text-text-primary',
}

function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const blocks: Block[] = []

  let paragraph: string[] = []
  let listItems: string[] = []

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ kind: 'paragraph', lines: paragraph })
      paragraph = []
    }
  }
  const flushList = () => {
    if (listItems.length) {
      blocks.push({ kind: 'list', items: listItems })
      listItems = []
    }
  }

  for (const raw of lines) {
    const line = raw.trimEnd()

    if (line.trim() === '') {
      flushParagraph()
      flushList()
      continue
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(line)
    if (heading) {
      flushParagraph()
      flushList()
      blocks.push({
        kind: 'heading',
        level: heading[1].length as 1 | 2 | 3,
        text: heading[2].trim(),
      })
      continue
    }

    const bullet = /^\s*[-*]\s+(.*)$/.exec(line)
    if (bullet) {
      flushParagraph()
      listItems.push(bullet[1].trim())
      continue
    }

    flushList()
    paragraph.push(line.trim())
  }

  flushParagraph()
  flushList()
  return blocks
}

// Render `**bold**` / `*italic*`; the rest stays React-escaped plain text.
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  // Order matters: match the longer `**` delimiter before `*`.
  const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let i = 0

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<Fragment key={`${keyPrefix}-t${i}`}>{text.slice(lastIndex, match.index)}</Fragment>)
    }
    if (match[1] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-b${i}`}>{match[1]}</strong>)
    } else {
      nodes.push(<em key={`${keyPrefix}-i${i}`}>{match[2]}</em>)
    }
    lastIndex = pattern.lastIndex
    i += 1
  }

  if (lastIndex < text.length) {
    nodes.push(<Fragment key={`${keyPrefix}-t${i}`}>{text.slice(lastIndex)}</Fragment>)
  }
  return nodes
}

export function ReportMarkdown({ text }: { text: string }) {
  const blocks = parseBlocks(text)

  return (
    <article className="space-y-3 text-body leading-relaxed text-text-primary">
      {blocks.map((block, index) => {
        const key = `block-${index}`
        if (block.kind === 'heading') {
          const Tag = (`h${block.level}`) as 'h1' | 'h2' | 'h3'
          return (
            <Tag key={key} className={headingClass[block.level]}>
              {renderInline(block.text, key)}
            </Tag>
          )
        }
        if (block.kind === 'list') {
          return (
            <ul key={key} className="list-disc space-y-1 pl-5 marker:text-text-tertiary">
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-i${itemIndex}`}>{renderInline(item, `${key}-i${itemIndex}`)}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={key}>
            {block.lines.map((line, lineIndex) => (
              <Fragment key={`${key}-l${lineIndex}`}>
                {lineIndex > 0 && <br />}
                {renderInline(line, `${key}-l${lineIndex}`)}
              </Fragment>
            ))}
          </p>
        )
      })}
    </article>
  )
}
