import React from 'react'
import { render, screen } from '@testing-library/react'
import CompanyBadge from '../src/ui/CompanyBadge'

describe('CompanyBadge', () => {
  const defaultProps = {
    companyName: 'Test Company',
    startDate: '2020',
    endDate: '2023',
    icon: React.createElement('img', { 
      src: '/test-icon.svg', 
      alt: 'Test Company', 
      'data-testid': 'company-icon' 
    }),
    tooltipId: 'test-tooltip'
  }

  describe('Basic Rendering', () => {
    it('renders company badge with icon', () => {
      render(React.createElement(CompanyBadge, defaultProps))
      
      expect(screen.getByTestId('company-icon')).toBeInTheDocument()
      expect(screen.getByTestId('company-icon')).toHaveAttribute('src', '/test-icon.svg')
      expect(screen.getByTestId('company-icon')).toHaveAttribute('alt', 'Test Company')
    })

    it('applies correct CSS class to badge', () => {
      render(React.createElement(CompanyBadge, defaultProps))
      
      const badge = screen.getByTestId('company-icon').parentElement
      expect(badge).toHaveClass('badge')
    })

    it('renders with different icon types', () => {
      const svgIcon = React.createElement('svg', {
        'data-testid': 'svg-icon',
        width: '24',
        height: '24'
      }, React.createElement('circle', { cx: '12', cy: '12', r: '10' }))
      
      const props = {
        ...defaultProps,
        icon: svgIcon
      }
      
      render(React.createElement(CompanyBadge, props))
      
      expect(screen.getByTestId('svg-icon')).toBeInTheDocument()
    })
  })

  describe('Tooltip Configuration', () => {
    it('sets correct tooltip attributes', () => {
      render(React.createElement(CompanyBadge, defaultProps))
      
      const badge = screen.getByTestId('company-icon').parentElement
      expect(badge).toHaveAttribute('data-tooltip-id', 'test-tooltip')
      expect(badge).toHaveAttribute('data-tooltip-content', 'Test Company, 2020 - 2023')
      expect(badge).toHaveAttribute('data-tooltip-place', 'bottom')
    })

    it('formats tooltip content correctly with different date formats', () => {
      const props = {
        ...defaultProps,
        companyName: 'Amazon Web Services',
        startDate: '2018',
        endDate: '2022'
      }
      
      render(React.createElement(CompanyBadge, props))
      
      const badge = screen.getByTestId('company-icon').parentElement
      expect(badge).toHaveAttribute('data-tooltip-content', 'Amazon Web Services, 2018 - 2022')
    })

    it('works with different tooltip IDs', () => {
      const props = {
        ...defaultProps,
        tooltipId: 'unique-tooltip-id'
      }
      
      render(React.createElement(CompanyBadge, props))
      
      const badge = screen.getByTestId('company-icon').parentElement
      expect(badge).toHaveAttribute('data-tooltip-id', 'unique-tooltip-id')
    })

    it('sets tooltip placement correctly', () => {
      render(React.createElement(CompanyBadge, defaultProps))
      
      const badge = screen.getByTestId('company-icon').parentElement
      expect(badge).toHaveAttribute('data-tooltip-place', 'bottom')
    })
  })

  describe('Content Formatting', () => {
    it('handles special characters in company name', () => {
      const props = {
        ...defaultProps,
        companyName: 'Company & Co., Inc.'
      }
      
      render(React.createElement(CompanyBadge, props))
      
      const badge = screen.getByTestId('company-icon').parentElement
      expect(badge).toHaveAttribute('data-tooltip-content', 'Company & Co., Inc., 2020 - 2023')
    })

    it('handles long company names', () => {
      const props = {
        ...defaultProps,
        companyName: 'Very Long Technology Company Name International Corporation'
      }
      
      render(React.createElement(CompanyBadge, props))
      
      const badge = screen.getByTestId('company-icon').parentElement
      expect(badge).toHaveAttribute('data-tooltip-content', 'Very Long Technology Company Name International Corporation, 2020 - 2023')
    })

    it('handles numeric date formats', () => {
      const props = {
        ...defaultProps,
        startDate: '01/2020',
        endDate: '12/2023'
      }
      
      render(React.createElement(CompanyBadge, props))
      
      const badge = screen.getByTestId('company-icon').parentElement
      expect(badge).toHaveAttribute('data-tooltip-content', 'Test Company, 01/2020 - 12/2023')
    })

    it('handles present/current employment', () => {
      const props = {
        ...defaultProps,
        endDate: 'Present'
      }
      
      render(React.createElement(CompanyBadge, props))
      
      const badge = screen.getByTestId('company-icon').parentElement
      expect(badge).toHaveAttribute('data-tooltip-content', 'Test Company, 2020 - Present')
    })
  })

  describe('Edge Cases', () => {
    it('handles edge case with empty strings', () => {
      const props = {
        ...defaultProps,
        companyName: '',
        startDate: '',
        endDate: ''
      }
      
      render(React.createElement(CompanyBadge, props))
      
      const badge = screen.getByTestId('company-icon').parentElement
      expect(badge).toHaveAttribute('data-tooltip-content', ',  - ')
    })

    it('handles missing company name', () => {
      const props = {
        ...defaultProps,
        companyName: undefined as any
      }
      
      expect(() => {
        render(React.createElement(CompanyBadge, props))
      }).not.toThrow()
    })

    it('handles missing dates', () => {
      const props = {
        ...defaultProps,
        startDate: undefined as any,
        endDate: undefined as any
      }
      
      render(React.createElement(CompanyBadge, props))
      
      const badge = screen.getByTestId('company-icon').parentElement
      expect(badge).toHaveAttribute('data-tooltip-content', 'Test Company, undefined - undefined')
    })

    it('handles unicode characters in company name', () => {
      const props = {
        ...defaultProps,
        companyName: 'Société Générale™'
      }
      
      render(React.createElement(CompanyBadge, props))
      
      const badge = screen.getByTestId('company-icon').parentElement
      expect(badge).toHaveAttribute('data-tooltip-content', 'Société Générale™, 2020 - 2023')
    })
  })

  describe('Accessibility', () => {
    it('maintains accessibility with proper structure', () => {
      render(React.createElement(CompanyBadge, defaultProps))
      
      const badge = screen.getByTestId('company-icon').parentElement
      expect(badge?.tagName).toBe('DIV')
      expect(badge).toHaveAttribute('data-tooltip-content')
    })

    it('preserves icon accessibility attributes', () => {
      const accessibleIcon = React.createElement('img', {
        src: '/icon.svg',
        alt: 'Company Logo',
        'aria-label': 'Company badge',
        'data-testid': 'accessible-icon'
      })
      
      const props = {
        ...defaultProps,
        icon: accessibleIcon
      }
      
      render(React.createElement(CompanyBadge, props))
      
      const icon = screen.getByTestId('accessible-icon')
      expect(icon).toHaveAttribute('aria-label', 'Company badge')
      expect(icon).toHaveAttribute('alt', 'Company Logo')
    })

    it('provides meaningful tooltip content for screen readers', () => {
      render(React.createElement(CompanyBadge, defaultProps))
      
      const badge = screen.getByTestId('company-icon').parentElement
      const tooltipContent = badge?.getAttribute('data-tooltip-content')
      
      expect(tooltipContent).toContain('Test Company')
      expect(tooltipContent).toContain('2020')
      expect(tooltipContent).toContain('2023')
      expect(tooltipContent).toMatch(/^.+, \d+ - \d+$/) // Follows pattern: "Company, StartYear - EndYear"
    })
  })

  describe('Component Structure', () => {
    it('renders proper DOM structure', () => {
      render(React.createElement(CompanyBadge, defaultProps))
      
      // Should have a container div with the badge class
      const badge = screen.getByTestId('company-icon').parentElement
      expect(badge).toBeInTheDocument()
      expect(badge?.tagName).toBe('DIV')
      
      // Should contain the icon
      expect(screen.getByTestId('company-icon')).toBeInTheDocument()
    })

    it('renders multiple badges independently', () => {
      render(React.createElement('div', {}, [
        React.createElement(CompanyBadge, { ...defaultProps, tooltipId: 'badge-1', key: '1' }),
        React.createElement(CompanyBadge, { ...defaultProps, tooltipId: 'badge-2', key: '2' })
      ]))
      
      const badges = screen.getAllByTestId('company-icon')
      expect(badges).toHaveLength(2)
      
      // Check that each badge has correct tooltip IDs
      expect(badges[0].parentElement).toHaveAttribute('data-tooltip-id', 'badge-1')
      expect(badges[1].parentElement).toHaveAttribute('data-tooltip-id', 'badge-2')
    })
  })
})