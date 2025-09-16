import React from 'react'
import { render, screen } from '@testing-library/react'
import CardContent from '../src/ui/CardContent'

// Mock child components
jest.mock('../src/ui/SocialLink', () => {
  return function MockSocialLink({ href, text }: any) {
    return React.createElement('a', {
      href,
      'data-testid': 'social-link'
    }, text)
  }
})

jest.mock('../src/ui/EmailLink', () => {
  return function MockEmailLink({ href, text, email }: any) {
    return React.createElement('div', {
      'data-testid': 'email-link'
    }, [
      React.createElement('a', { href, key: 'link' }, text),
      React.createElement('span', { 'data-testid': 'email-copy', key: 'email' }, email)
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

  it('renders the email link', () => {
    render(React.createElement(CardContent))
    
    const emailLink = screen.getByTestId('email-link')
    expect(emailLink).toBeInTheDocument()
    expect(screen.getByTestId('email-copy')).toHaveTextContent('nathanial@defnf.com')
  })

  it('renders all social links', () => {
    render(React.createElement(CardContent))
    
    const socialLinks = screen.getAllByTestId('social-link')
    expect(socialLinks.length).toBeGreaterThan(5) // Should have multiple social links
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
})