import React from 'react'
import { render, screen } from '@testing-library/react'
import CardContent from '../src/ui/CardContent'

// Mock child components
jest.mock('../src/ui/LinkBadge', () => {
  return function MockLinkBadge({ href, text, copyText }: any) {
    return React.createElement('div', {
      'data-testid': 'link-badge'
    }, [
      React.createElement('a', { href, key: 'link' }, text),
      copyText && React.createElement('span', { 'data-testid': 'copy-text', key: 'copy' }, copyText)
    ])
  }
})

jest.mock('../src/ui/CompanyBadge', () => {
  return function MockCompanyBadge({ companyName, startDate, endDate }: any) {
    return React.createElement('div', {
      'data-testid': 'company-badge'
    }, `${companyName} (${startDate} - ${endDate})`)
  }
})

jest.mock('../src/ui/ProjectsSection', () => {
  return function MockProjectsSection({ onProjectSelect }: any) {
    return React.createElement('div', {
      'data-testid': 'projects-section'
    }, 'Projects Section')
  }
})

jest.mock('../src/ui/DEFNFImage', () => {
  return function MockDEFNFImage() {
    return React.createElement('div', {
      'data-testid': 'defnf-image'
    }, 'DEFNF Image')
  }
})

describe('CardContent', () => {
  it('renders the main name section', () => {
    render(React.createElement(CardContent))
    
    expect(screen.getByText('Nathanial Fine')).toBeInTheDocument()
    expect(screen.getByTestId('defnf-image')).toBeInTheDocument()
  })

  it('renders all title sections', () => {
    render(React.createElement(CardContent))
    
    expect(screen.getByText('San Francisco Bay Area')).toBeInTheDocument()
    expect(screen.getByText('DevOps | TPM')).toBeInTheDocument()
    expect(screen.getByText('Husband')).toBeInTheDocument()
  })

  it('renders the contact links', () => {
    render(React.createElement(CardContent))
    
    const linkBadges = screen.getAllByTestId('link-badge')
    expect(linkBadges.length).toBeGreaterThan(0) // Should have contact links
    
    // Check for email copy functionality
    expect(screen.getByTestId('copy-text')).toHaveTextContent('nathanial@defnf.com')
  })

  it('renders the Contact section', () => {
    render(React.createElement(CardContent))
    
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('renders the Previously section', () => {
    render(React.createElement(CardContent))
    
    expect(screen.getByText('Previously')).toBeInTheDocument()
  })

  it('renders all company badges', () => {
    render(React.createElement(CardContent))
    
    const companyBadges = screen.getAllByTestId('company-badge')
    expect(companyBadges).toHaveLength(3)
    
    expect(screen.getByText('Amazon.com (2023 - 2025)')).toBeInTheDocument()
    expect(screen.getByText('AWS (2020 - 2023)')).toBeInTheDocument()
    expect(screen.getByText('Infosys (2017 - 2020)')).toBeInTheDocument()
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
})