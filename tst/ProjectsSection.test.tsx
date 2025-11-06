import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { jest } from '@jest/globals'
import ProjectsSection from '../src/ui/ProjectsSection'

describe('ProjectsSection', () => {
  const mockOnProjectSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the Projects section title', () => {
    render(<ProjectsSection onProjectSelect={mockOnProjectSelect} />)
    
    expect(screen.getByText('Projects')).toBeInTheDocument()
  })

  it('renders project badges', () => {
    render(<ProjectsSection onProjectSelect={mockOnProjectSelect} />)
    
    // Check for the main projects
    expect(screen.getByText('ENCOM')).toBeInTheDocument()
    expect(screen.getByText('GRID')).toBeInTheDocument()
    expect(screen.getByText('MYSEATMAP')).toBeInTheDocument()
  })

  it('calls onProjectSelect when a project badge is clicked', () => {
    render(<ProjectsSection onProjectSelect={mockOnProjectSelect} />)
    
    // ProjectBadge renders as a div with button role, not an actual button element
    const encomBadge = screen.getByText('ENCOM').closest('[role="button"]')
    expect(encomBadge).toBeInTheDocument()
    
    if (encomBadge) {
      fireEvent.click(encomBadge)
      expect(mockOnProjectSelect).toHaveBeenCalledWith('encom')
    }
  })

  it('renders project badges as clickable elements', () => {
    render(<ProjectsSection onProjectSelect={mockOnProjectSelect} />)
    
    const projectBadges = screen.getAllByRole('button')
    expect(projectBadges.length).toBeGreaterThan(0)
    
    // Check that each badge has the correct structure
    projectBadges.forEach(badge => {
      expect(badge).toHaveClass('badge')
    })
  })

  it('has correct project IDs for selection', () => {
    render(<ProjectsSection onProjectSelect={mockOnProjectSelect} />)
    
    // Click each project and verify the correct ID is passed
    const gridBadge = screen.getByText('GRID').closest('[role="button"]')
    if (gridBadge) {
      fireEvent.click(gridBadge)
      expect(mockOnProjectSelect).toHaveBeenCalledWith('grid')
    }

    const seatmapBadge = screen.getByText('MYSEATMAP').closest('[role="button"]')
    if (seatmapBadge) {
      fireEvent.click(seatmapBadge)
      expect(mockOnProjectSelect).toHaveBeenCalledWith('seatmap')
    }
  })
})