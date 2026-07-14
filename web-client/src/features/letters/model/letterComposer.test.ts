import { describe, expect, it } from 'vitest'

import { validateLetterComposerForm } from './letterComposer'

describe('letter composer validation', () => {
  it('accepts valid mail and PDF forms', () => {
    expect(
      validateLetterComposerForm({
        mode: 'mail',
        subject: 'Newsletter',
        template: '<p>Hello {{first_name}}</p>',
      }),
    ).toBeNull()
    expect(
      validateLetterComposerForm({
        mode: 'pdf',
        subject: '',
        template: '<p>Hello {{first_name}}</p>',
      }),
    ).toBeNull()
  })

  it('requires a mail subject', () => {
    expect(
      validateLetterComposerForm({
        mode: 'mail',
        subject: ' ',
        template: '<p>Hello</p>',
      }),
    ).toEqual({ subject: 'Subject is required.' })
  })

  it('requires a template for every mode', () => {
    expect(
      validateLetterComposerForm({
        mode: 'pdf',
        subject: '',
        template: ' ',
      }),
    ).toEqual({ template: 'Template is required.' })
  })
})
