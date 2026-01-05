import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { jest } from '@jest/globals'
import ProjectDetail from '../src/ui/ProjectDetail'
import { projects } from '../src/data/projects'

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
      
      expect(projectLinks.length).toBe(testProject.links.length)
    }
  })

  it('renders different projects correctly', () => {
    const gridProject = projects.find(p => p.id === 'grid')!

    render(<ProjectDetail project={gridProject} onBack={mockOnBack} />)

    expect(screen.getByText(gridProject.name)).toBeInTheDocument()
    // Use partial match for descriptions with newlines
    expect(screen.getByText(/I wanted a simple way to manage files/)).toBeInTheDocument()
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