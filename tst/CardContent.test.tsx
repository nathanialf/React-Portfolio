import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CardContent from '../src/ui/CardContent'

// Mock child components
jest.mock('../src/ui/ProjectsSection', () => {
  return function MockProjectsSection({ onProjectSelect }: any) {
    return React.createElement('div', {
      'data-testid': 'projects-section'
    }, 'Projects Section')
  }
})

jest.mock('../src/ui/AboutButton', () => {
  return function MockAboutButton({ onClick, label }: any) {
    return React.createElement('button', {
      'data-testid': 'about-button',
      onClick
    }, label)
  }
})

describe('CardContent', () => {
  it('renders the name', () => {
    render(React.createElement(CardContent))

    expect(screen.getByText('Nathanial Fine')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(React.createElement(CardContent))

    expect(screen.getByText('Bespoke Software')).toBeInTheDocument()
  })

  it('renders projects section when onProjectSelect is provided', () => {
    const mockOnProjectSelect = jest.fn()
    render(React.createElement(CardContent, { onProjectSelect: mockOnProjectSelect }))

    expect(screen.getByTestId('projects-section')).toBeInTheDocument()
  })

  it('does not render projects section when onProjectSelect is not provided', () => {
    render(React.createElement(CardContent))

    expect(screen.queryByTestId('projects-section')).not.toBeInTheDocument()
  })

  it('renders about button when onAboutSelect is provided', () => {
    const mockOnAboutSelect = jest.fn()
    render(React.createElement(CardContent, { onAboutSelect: mockOnAboutSelect }))

    expect(screen.getByText('About & Contact')).toBeInTheDocument()
  })

  it('does not render about button when onAboutSelect is not provided', () => {
    render(React.createElement(CardContent))

    expect(screen.queryByText('About & Contact')).not.toBeInTheDocument()
  })

  it('calls onAboutSelect when about button is clicked', () => {
    const mockOnAboutSelect = jest.fn()
    render(React.createElement(CardContent, { onAboutSelect: mockOnAboutSelect }))

    fireEvent.click(screen.getByText('About & Contact'))
    expect(mockOnAboutSelect).toHaveBeenCalled()
  })

  it('renders blog button', () => {
    render(React.createElement(CardContent))

    expect(screen.getByText('Blog')).toBeInTheDocument()
  })
})
