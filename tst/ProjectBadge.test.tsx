import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { jest } from '@jest/globals'
import ProjectBadge from '../src/ui/ProjectBadge'

describe('ProjectBadge', () => {
  const mockOnClick = jest.fn()
  const testProject = {
    id: 'test',
    name: 'Test Project',
    description: 'A test project',
    icon: {
      type: 'tabler' as const,
      content: 'hexagon'
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders project name and handles click', () => {
    render(
      <ProjectBadge
        project={testProject}
        onClick={mockOnClick}
      />
    )

    expect(screen.getByText('Test Project')).toBeInTheDocument()

    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('renders with SVG icon correctly', () => {
    const svgProject = {
      id: 'grid',
      name: 'GRID',
      description: 'Grid project',
      icon: {
        type: 'svg' as const,
        content: '/images/grid-icon.svg'
      }
    }

    render(
      <ProjectBadge
        project={svgProject}
        onClick={mockOnClick}
      />
    )

    expect(screen.getByText('GRID')).toBeInTheDocument()
  })

  it('has correct button styling classes', () => {
    render(
      <ProjectBadge
        project={testProject}
        onClick={mockOnClick}
      />
    )

    const button = screen.getByRole('button')
    expect(button).toHaveClass('badge')
  })

  it('is accessible with keyboard navigation', () => {
    render(
      <ProjectBadge
        project={testProject}
        onClick={mockOnClick}
      />
    )

    const button = screen.getByRole('button')
    button.focus()
    expect(button).toHaveFocus()

    fireEvent.keyDown(button, { key: 'Enter' })
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('supports different icon types', () => {
    const tablerProject = {
      ...testProject,
      icon: { type: 'tabler' as const, content: 'hexagon' }
    }

    const { rerender } = render(
      <ProjectBadge
        project={tablerProject}
        onClick={mockOnClick}
      />
    )

    expect(screen.getByText('Test Project')).toBeInTheDocument()

    const svgProject = {
      ...testProject,
      icon: { type: 'svg' as const, content: '/test.svg' }
    }

    rerender(
      <ProjectBadge
        project={svgProject}
        onClick={mockOnClick}
      />
    )

    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })
})