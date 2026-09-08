import React from 'react'
import { jest } from '@jest/globals'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProjectDetail from '../src/ui/ProjectDetail'
import { projects } from '../src/data/projects'

describe('ProjectDetail progress badge', () => {
  const icoProject = projects.find(p => p.id === 'ico-decomp')!
  const noProgressProject = projects.find(p => p.id === 'encom')!

  afterEach(() => {
    localStorage.clear()
    // @ts-expect-error - clearing the mock installed per test
    delete global.fetch
  })

  it('renders the badge for a project that declares progress', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          progress: {
            matchedFuncs: 4053, totalFuncs: 5741, funcPct: 70.6,
            matchedBytes: 623856, totalBytes: 1612740, bytePct: 38.7,
            version: 'pal',
          },
        }),
      })
    ) as unknown as typeof fetch

    render(<ProjectDetail project={icoProject} onBack={jest.fn()} />)

    const badge = await screen.findByText('38.7%')
    expect(badge).toHaveAttribute('href', icoProject.progress!.dashboard)
  })

  it('does not fetch for a project without progress', async () => {
    global.fetch = jest.fn() as unknown as typeof fetch

    render(<ProjectDetail project={noProgressProject} onBack={jest.fn()} />)

    await waitFor(() => expect(screen.getByText(noProgressProject.name)).toBeInTheDocument())
    expect(global.fetch).not.toHaveBeenCalled()
    expect(screen.queryByText(/%$/)).not.toBeInTheDocument()
  })
})

describe('ProjectDetail', () => {
  const mockOnBack = jest.fn()
  const testProject = projects.find(p => p.id === 'encom')!

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders project details correctly', () => {
    render(<ProjectDetail project={testProject} onBack={mockOnBack} />)
    
    expect(screen.getByText(testProject.name)).toBeInTheDocument()
    expect(screen.getByText(testProject.description)).toBeInTheDocument()
  })

  it('renders back button with correct text', () => {
    render(<ProjectDetail project={testProject} onBack={mockOnBack} />)
    
    const backButton = screen.getByText('Back to Home').closest('button')
    expect(backButton).toBeInTheDocument()
  })

  it('calls onBack when back button is clicked', () => {
    render(<ProjectDetail project={testProject} onBack={mockOnBack} />)
    
    const backButton = screen.getByText('Back to Home').closest('button')
    if (backButton) {
      fireEvent.click(backButton)
      expect(mockOnBack).toHaveBeenCalledTimes(1)
    }
  })

  it('renders project links when available', () => {
    render(<ProjectDetail project={testProject} onBack={mockOnBack} />)
    
    if (testProject.links && testProject.links.length > 0) {
      // Just check that links are present with correct URLs
      const allLinks = screen.getAllByRole('link')
      const projectLinks = allLinks.filter(link => {
        const href = link.getAttribute('href')
        return testProject.links?.some(projectLink => projectLink.url === href)
      })
      
      const visibleLinks = testProject.links.filter(l => !l.hidden)
      expect(projectLinks.length).toBe(visibleLinks.length)
    }
  })

  it('renders different projects correctly', () => {
    const gridProject = projects.find(p => p.id === 'grid')!

    render(<ProjectDetail project={gridProject} onBack={mockOnBack} />)

    expect(screen.getByText(gridProject.name)).toBeInTheDocument()
    // Use partial match for descriptions with newlines
    expect(screen.getByText(/beautifully crafted Android file manager/)).toBeInTheDocument()
  })

  it('has correct animation container', () => {
    const { container } = render(<ProjectDetail project={testProject} onBack={mockOnBack} />)
    
    const animationContainer = container.firstChild
    expect(animationContainer).toHaveClass('container')
  })

  it('renders links section when project has links', () => {
    const projectWithLinks = projects.find(p => p.links && p.links.length > 0)
    
    if (projectWithLinks) {
      render(<ProjectDetail project={projectWithLinks} onBack={mockOnBack} />)
      
      // Should have links section
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(1) // At least one project link plus back button
    }
  })
})