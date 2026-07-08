import { describe, expect, it } from 'vitest'

import {
  createSampleValues,
  createTemplatePreviewSrcDoc,
  substituteTemplateTokens,
} from './templatePreview'

describe('letter template preview helpers', () => {
  it('replaces supported tokens with sample values', () => {
    const sampleValues = createSampleValues({
      teamName: 'U10 <Stars>',
      sportName: 'Track & Field',
    })

    expect(
      substituteTemplateTokens(
        '<p>{{full_name}} plays for {{team_name}} in {{sport_name}}. Balance: {{balance}}</p>',
        sampleValues,
      ),
    ).toBe(
      '<p>Alex Morgan plays for U10 &lt;Stars&gt; in Track &amp; Field. Balance: \u20ac0.00</p>',
    )
  })

  it('leaves unsupported tokens untouched', () => {
    const sampleValues = createSampleValues()

    expect(substituteTemplateTokens('{{unknown_token}} {{email}}', sampleValues)).toBe(
      '{{unknown_token}} alex.morgan@example.com',
    )
  })

  it('creates a sandbox-friendly srcdoc with scripts blocked by policy', () => {
    const sampleValues = createSampleValues()
    const srcDoc = createTemplatePreviewSrcDoc(
      '<h1>Hello {{first_name}}</h1><script>bad()</script>',
      sampleValues,
    )

    expect(srcDoc).toContain("script-src 'none'")
    expect(srcDoc).toContain('<h1>Hello Alex</h1>')
    expect(srcDoc).toContain('<script>bad()</script>')
  })
})
