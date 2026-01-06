import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { jest } from '@jest/globals'
import ProjectsSection from '../src/ui/ProjectsSection'

describe('ProjectsSection', () => {
  const mockOnProjectSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders project cards', () => {
    render(<ProjectsSection onProjectSelect={mockOnProjectSelect} />)

    // Check for the main projects via aria-label
    expect(screen.getByLabelText('View ENCOM project')).toBeInTheDocument()
    expect(screen.getByLabelText('View GRID project')).toBeInTheDocument()
    expect(screen.getByLabelText('View MYSEATMAP project')).toBeInTheDocument()
    expect(screen.getByLabelText('View CARTOGRAPH project')).toBeInTheDocument()
  })

  it('calls onProjectSelect when a project card is clicked', () => {
    render(<ProjectsSection onProjectSelect={mockOnProjectSelect} />)

    const encomCard = screen.getByLabelText('View ENCOM project')
    fireEvent.click(encomCard)
    expect(mockOnProjectSelect).toHaveBeenCalledWith('encom')
  })

  it('renders project cards as clickable buttons', () => {
    render(<ProjectsSection onProjectSelect={mockOnProjectSelect} />)

    const projectCards = screen.getAllByRole('button')
    expect(projectCards.length).toBe(4)

    // Check that each card has the correct structure
    projectCards.forEach(card => {
      expect(card).toHaveClass('card')
    })
  })

  it('has correct project IDs for selection', () => {
    render(<ProjectsSection onProjectSelect={mockOnProjectSelect} />)

    // Click each project and verify the correct ID is passed
    fireEvent.click(screen.getByLabelText('View GRID project'))
    expect(mockOnProjectSelect).toHaveBeenCalledWith('grid')

    fireEvent.click(screen.getByLabelText('View MYSEATMAP project'))
    expect(mockOnProjectSelect).toHaveBeenCalledWith('seatmap')

    fireEvent.click(screen.getByLabelText('View CARTOGRAPH project'))
    expect(mockOnProjectSelect).toHaveBeenCalledWith('cartograph')
  })
})
