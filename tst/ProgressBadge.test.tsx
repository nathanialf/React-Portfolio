import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import ProgressBadge from '../src/ui/ProgressBadge'
import { ICO_TARGETS, TargetProgress } from '../src/lib/ico-progress'

const [pal, ntsc] = ICO_TARGETS

const targets: TargetProgress[] = [
  {
    target: pal,
    matchedFuncs: 4053,
    totalFuncs: 5741,
    funcPct: 70.6,
    matchedBytes: 623856,
    totalBytes: 1612740,
    bytePct: 38.7,
    version: 'pal',
  },
  {
    target: ntsc,
    matchedFuncs: 1200,
    totalFuncs: 5741,
    funcPct: 20.9,
    matchedBytes: 201234,
    totalBytes: 1612740,
    bytePct: 12.5,
    version: 'us',
  },
]

const props = {
  endpoint: '/api/ico-progress',
  dashboard: 'https://nathanialf.github.io/ico/',
  accentColor: '#d9c9a3',
}

const CACHE_KEY = `progress:v2:${props.endpoint}`

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

  it('renders one badge per target with its shorthand and byte percentage', async () => {
    mockFetch(resolving({ targets }))
    render(<ProgressBadge {...props} />)

    const links = await screen.findAllByRole('link')
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveTextContent('PAL 38.7%')
    expect(links[1]).toHaveTextContent('NTSC 12.5%')
  })

  it('deep-links each badge to its target on the dashboard', async () => {
    mockFetch(resolving({ targets }))
    render(<ProgressBadge {...props} />)

    const links = await screen.findAllByRole('link')
    expect(links[0]).toHaveAttribute('href', `${props.dashboard}#pal`)
    expect(links[1]).toHaveAttribute('href', `${props.dashboard}#us`)
    links.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('keeps the function count in the tooltip, not the badge text', async () => {
    mockFetch(resolving({ targets }))
    render(<ProgressBadge {...props} />)

    const [link] = await screen.findAllByRole('link')
    expect(link.getAttribute('title')).toContain('PAL retail (SCES-50760)')
    expect(link.getAttribute('title')).toContain('4,053 / 5,741 functions (70.6%)')
    expect(link).not.toHaveTextContent('70.6')
  })

  it('caches the targets for the next visit', async () => {
    mockFetch(resolving({ targets }))
    render(<ProgressBadge {...props} />)

    await screen.findAllByRole('link')
    await waitFor(() => expect(localStorage.getItem(CACHE_KEY)).not.toBeNull())
    expect(JSON.parse(localStorage.getItem(CACHE_KEY)!)).toEqual(targets)
  })

  it('renders the cached value without waiting on the fetch', () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(targets))
    mockFetch(() => new Promise(() => {}))

    render(<ProgressBadge {...props} />)
    expect(screen.getAllByRole('link')[0]).toHaveTextContent('PAL 38.7%')
  })

  it('keeps the cached value when the fetch fails', async () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(targets))
    mockFetch(() => Promise.reject(new Error('offline')))

    render(<ProgressBadge {...props} />)
    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    expect(screen.getAllByRole('link')).toHaveLength(2)
  })

  it('ignores a single-summary cache left by the old badge', () => {
    localStorage.setItem(`progress:${props.endpoint}`, JSON.stringify(targets[0]))
    localStorage.setItem(CACHE_KEY, JSON.stringify(targets[0]))
    mockFetch(() => new Promise(() => {}))

    const { container } = render(<ProgressBadge {...props} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when the route reports no targets', async () => {
    mockFetch(resolving({ targets: [] }))
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
