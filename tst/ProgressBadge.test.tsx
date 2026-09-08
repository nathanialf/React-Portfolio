import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import ProgressBadge from '../src/ui/ProgressBadge'
import { ProgressSummary } from '../src/lib/ico-progress'

const summary: ProgressSummary = {
  matchedFuncs: 4053,
  totalFuncs: 5741,
  funcPct: 70.6,
  matchedBytes: 623856,
  totalBytes: 1612740,
  bytePct: 38.7,
  version: 'pal',
}

const props = {
  endpoint: '/api/ico-progress',
  dashboard: 'https://nathanialf.github.io/ico/',
  accentColor: '#d9c9a3',
}

const CACHE_KEY = `progress:${props.endpoint}`

describe('ProgressBadge', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.restoreAllMocks()
  })

  const mockFetch = (impl: () => Promise<unknown>) => {
    global.fetch = jest.fn(impl) as unknown as typeof fetch
  }

  const resolving = (body: unknown) => () =>
    Promise.resolve({ json: () => Promise.resolve(body) })

  it('renders nothing until the fetch resolves', () => {
    mockFetch(() => new Promise(() => {}))
    const { container } = render(<ProgressBadge {...props} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('leads with the byte percentage and links to the dashboard', async () => {
    mockFetch(resolving({ progress: summary }))
    render(<ProgressBadge {...props} />)

    const link = await screen.findByRole('link')
    expect(link).toHaveTextContent('38.7%')
    expect(link).toHaveAttribute('href', props.dashboard)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('keeps the function count in the tooltip, not the badge text', async () => {
    mockFetch(resolving({ progress: summary }))
    render(<ProgressBadge {...props} />)

    const link = await screen.findByRole('link')
    expect(link.getAttribute('title')).toContain('4,053 / 5,741 functions (70.6%)')
    expect(link).not.toHaveTextContent('70.6')
  })

  it('caches the summary for the next visit', async () => {
    mockFetch(resolving({ progress: summary }))
    render(<ProgressBadge {...props} />)

    await screen.findByRole('link')
    await waitFor(() => expect(localStorage.getItem(CACHE_KEY)).not.toBeNull())
    expect(JSON.parse(localStorage.getItem(CACHE_KEY)!)).toEqual(summary)
  })

  it('renders the cached value without waiting on the fetch', () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(summary))
    mockFetch(() => new Promise(() => {}))

    render(<ProgressBadge {...props} />)
    expect(screen.getByRole('link')).toHaveTextContent('38.7%')
  })

  it('keeps the cached value when the fetch fails', async () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(summary))
    mockFetch(() => Promise.reject(new Error('offline')))

    render(<ProgressBadge {...props} />)
    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    expect(screen.getByRole('link')).toHaveTextContent('38.7%')
  })

  it('renders nothing when the route reports no progress', async () => {
    mockFetch(resolving({ progress: null }))
    const { container } = render(<ProgressBadge {...props} />)

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when the fetch rejects and there is no cache', async () => {
    mockFetch(() => Promise.reject(new Error('offline')))
    const { container } = render(<ProgressBadge {...props} />)

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    expect(container).toBeEmptyDOMElement()
  })
})
