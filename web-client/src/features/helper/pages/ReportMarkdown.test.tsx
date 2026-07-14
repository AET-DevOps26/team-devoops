import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ReportMarkdown } from './ReportMarkdown'

describe('ReportMarkdown', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>'
    container = document.getElementById('root') as HTMLDivElement
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => {
      root.unmount()
    })
    document.body.innerHTML = ''
  })

  async function render(text: string) {
    await act(async () => {
      root.render(<ReportMarkdown text={text} />)
    })
  }

  it('renders headings at the right level', async () => {
    await render('# Title\n\n## Section')

    expect(container.querySelector('h1')?.textContent).toBe('Title')
    expect(container.querySelector('h2')?.textContent).toBe('Section')
  })

  it('renders bullet lists', async () => {
    await render('- first\n- second\n* third')

    const items = container.querySelectorAll('li')
    expect(items.length).toBe(3)
    expect(items[0].textContent).toBe('first')
    expect(items[2].textContent).toBe('third')
  })

  it('renders bold and italic inline emphasis', async () => {
    await render('Plain **bold** and *italic* text')

    expect(container.querySelector('strong')?.textContent).toBe('bold')
    expect(container.querySelector('em')?.textContent).toBe('italic')
  })

  it('splits paragraphs on blank lines', async () => {
    await render('First para.\n\nSecond para.')

    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs.length).toBe(2)
    expect(paragraphs[0].textContent).toBe('First para.')
    expect(paragraphs[1].textContent).toBe('Second para.')
  })

  it('renders plain prose without headings or lists as paragraphs', async () => {
    await render('Just a line of prose with no markup at all.')

    expect(container.querySelector('h1')).toBeNull()
    expect(container.querySelector('ul')).toBeNull()
    expect(container.querySelector('p')?.textContent).toBe(
      'Just a line of prose with no markup at all.',
    )
  })

  it('does not inject raw HTML from the report text', async () => {
    await render('<img src=x onerror="alert(1)"> & <script>bad()</script>')

    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('script')).toBeNull()
    expect(container.textContent).toContain('<img src=x onerror="alert(1)">')
  })
})
