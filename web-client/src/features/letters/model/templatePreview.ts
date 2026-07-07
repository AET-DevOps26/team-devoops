export const TEMPLATE_TOKENS = [
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

export type TemplateToken = (typeof TEMPLATE_TOKENS)[number]
export type TemplateSampleValues = Record<TemplateToken, string>

export interface TemplateSampleScope {
  teamName?: string
  sportName?: string
}

const DEFAULT_SAMPLE_VALUES = {
  '{{first_name}}': 'Alex',
  '{{last_name}}': 'Morgan',
  '{{full_name}}': 'Alex Morgan',
  '{{email}}': 'alex.morgan@example.com',
  '{{address}}': 'Example Street 12, 10115 Berlin',
  '{{phone_number}}': '+49 30 123456',
  '{{birthday}}': '14 May 2010',
  '{{joining_date}}': '1 September 2024',
  '{{team_name}}': 'Example Team',
  '{{sport_name}}': 'Football',
  '{{balance}}': '\u20ac0.00',
} as const satisfies TemplateSampleValues

const HTML_ESCAPE_LOOKUP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
} as const

const PREVIEW_CSP =
  "default-src 'none'; img-src data: https:; style-src 'unsafe-inline'; font-src data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; script-src 'none'"

const PREVIEW_DOCUMENT_STYLE = `
  :root {
    color-scheme: light;
    background: #ffffff;
    color: #1f2937;
    font-family: Arial, Helvetica, sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 24px;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  img,
  table {
    max-width: 100%;
  }

  img {
    height: auto;
  }

  table {
    border-collapse: collapse;
  }
`

export function createSampleValues(scope: TemplateSampleScope = {}): TemplateSampleValues {
  return {
    ...DEFAULT_SAMPLE_VALUES,
    '{{team_name}}': scope.teamName?.trim() || DEFAULT_SAMPLE_VALUES['{{team_name}}'],
    '{{sport_name}}': scope.sportName?.trim() || DEFAULT_SAMPLE_VALUES['{{sport_name}}'],
  }
}

export function substituteTemplateTokens(
  template: string,
  sampleValues: TemplateSampleValues,
): string {
  return TEMPLATE_TOKENS.reduce(
    (preview, token) => preview.split(token).join(escapeHtml(sampleValues[token])),
    template,
  )
}

export function createTemplatePreviewSrcDoc(
  template: string,
  sampleValues: TemplateSampleValues,
): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Security-Policy" content="${PREVIEW_CSP}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>${PREVIEW_DOCUMENT_STYLE}</style>
  </head>
  <body>${substituteTemplateTokens(template, sampleValues)}</body>
</html>`
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) => HTML_ESCAPE_LOOKUP[character as keyof typeof HTML_ESCAPE_LOOKUP],
  )
}
