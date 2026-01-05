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

    // Check for the main projects via title attribute
    expect(screen.getByTitle('ENCOM')).toBeInTheDocument()
    expect(screen.getByTitle('GRID')).toBeInTheDocument()
    expect(screen.getByTitle('MYSEATMAP')).toBeInTheDocument()
  })

  it('calls onProjectSelect when a project badge is clicked', () => {
    render(<ProjectsSection onProjectSelect={mockOnProjectSelect} />)

    const encomBadge = screen.getByTitle('ENCOM')
    expect(encomBadge).toBeInTheDocument()

    fireEvent.click(encomBadge)
    expect(mockOnProjectSelect).toHaveBeenCalledWith('encom')
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
    const gridBadge = screen.getByTitle('GRID')
    fireEvent.click(gridBadge)
    expect(mockOnProjectSelect).toHaveBeenCalledWith('grid')

    const seatmapBadge = screen.getByTitle('MYSEATMAP')
    fireEvent.click(seatmapBadge)
    expect(mockOnProjectSelect).toHaveBeenCalledWith('seatmap')
  })
})