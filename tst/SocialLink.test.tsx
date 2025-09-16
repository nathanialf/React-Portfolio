import React from 'react'
import { render, screen } from '@testing-library/react'
import SocialLink from '../src/ui/SocialLink'
import { IconBrandLinkedin } from '@tabler/icons-react'

describe('SocialLink', () => {
  const defaultProps = {
    href: 'https://linkedin.com/in/test',
    icon: React.createElement(IconBrandLinkedin, { 'data-testid': 'linkedin-icon' }),
    text: 'test-user',
    encoded: false
  }

  describe('Basic Rendering', () => {
    it('renders link with icon and text', () => {
      render(React.createElement(SocialLink, defaultProps))
      
      expect(screen.getByRole('link')).toHaveAttribute('href', 'https://linkedin.com/in/test')
      expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument()
      expect(screen.getByText('test-user')).toBeInTheDocument()
    })

    it('renders with different icon types', () => {
      const svgIcon = React.createElement('svg', {
        'data-testid': 'custom-icon',
        width: '24',
        height: '24'
      }, React.createElement('path', { d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' }))
      
      const props = {
        ...defaultProps,
        icon: svgIcon
      }
      
      render(React.createElement(SocialLink, props))
      
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })

    it('applies correct CSS classes', () => {
      render(React.createElement(SocialLink, defaultProps))
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass('link')
    })

    it('renders without icon', () => {
      const props = {
        ...defaultProps,
        icon: null
      }
      
      expect(() => {
        render(React.createElement(SocialLink, props))
      }).not.toThrow()
      
      expect(screen.getByRole('link')).toBeInTheDocument()
      expect(screen.getByText('test-user')).toBeInTheDocument()
    })
  })

  describe('Link Behavior', () => {
    it('handles external links correctly', () => {
      const props = {
        ...defaultProps,
        href: 'https://external-site.com/profile'
      }
      
      render(React.createElement(SocialLink, props))
      
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', 'https://external-site.com/profile')
    })

    it('handles mailto links', () => {
      const props = {
        ...defaultProps,
        href: 'mailto:test@example.com'
      }
      
      render(React.createElement(SocialLink, props))
      
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', 'mailto:test@example.com')
    })

    it('handles empty href', () => {
      const props = {
        ...defaultProps,
        href: ''
      }
      
      render(React.createElement(SocialLink, props))
      
      // Empty href makes the link inaccessible, so we need to query differently
      const link = document.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '')
    })

    it('handles props validation', () => {
      // The component has a simple undefined check that we can test
      const propsWithUndefinedFields = {
        href: undefined,
        icon: defaultProps.icon,
        text: defaultProps.text,
        encoded: defaultProps.encoded
      }
      
      // This should not crash the app due to the undefined check in SocialLink
      expect(() => {
        render(React.createElement(SocialLink, propsWithUndefinedFields))
      }).toThrow() // Next.js Link requires href, so this should throw
    })
  })

  describe('Text Content', () => {
    it('handles long text content', () => {
      const props = {
        ...defaultProps,
        text: 'very-long-username-that-might-cause-layout-issues'
      }
      
      render(React.createElement(SocialLink, props))
      
      expect(screen.getByText('very-long-username-that-might-cause-layout-issues')).toBeInTheDocument()
    })

    it('handles special characters in text', () => {
      const props = {
        ...defaultProps,
        text: 'user@name_with.special-chars'
      }
      
      render(React.createElement(SocialLink, props))
      
      expect(screen.getByText('user@name_with.special-chars')).toBeInTheDocument()
    })

    it('handles empty text', () => {
      const props = {
        ...defaultProps,
        text: ''
      }
      
      render(React.createElement(SocialLink, props))
      
      expect(screen.getByRole('link')).toBeInTheDocument()
    })

    it('handles numeric text', () => {
      const props = {
        ...defaultProps,
        text: '12345'
      }
      
      render(React.createElement(SocialLink, props))
      
      expect(screen.getByText('12345')).toBeInTheDocument()
    })
  })

  describe('Encoded Prop', () => {
    it('handles encoded prop set to true', () => {
      const props = {
        ...defaultProps,
        encoded: true
      }
      
      expect(() => {
        render(React.createElement(SocialLink, props))
      }).not.toThrow()
      
      expect(screen.getByRole('link')).toBeInTheDocument()
    })

    it('handles encoded prop set to false', () => {
      const props = {
        ...defaultProps,
        encoded: false
      }
      
      expect(() => {
        render(React.createElement(SocialLink, props))
      }).not.toThrow()
      
      expect(screen.getByRole('link')).toBeInTheDocument()
    })

    it('handles missing encoded prop', () => {
      const props = {
        href: defaultProps.href,
        icon: defaultProps.icon,
        text: defaultProps.text
        // encoded is omitted
      }
      
      expect(() => {
        render(React.createElement(SocialLink, props))
      }).not.toThrow()
      
      expect(screen.getByRole('link')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('maintains proper link accessibility', () => {
      render(React.createElement(SocialLink, defaultProps))
      
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', 'https://linkedin.com/in/test')
      expect(link).not.toHaveAttribute('target') // Should not open in new tab by default
    })

    it('preserves icon accessibility attributes', () => {
      const accessibleIcon = React.createElement(IconBrandLinkedin, {
        'data-testid': 'accessible-icon',
        'aria-label': 'LinkedIn icon'
      })
      
      const props = {
        ...defaultProps,
        icon: accessibleIcon
      }
      
      render(React.createElement(SocialLink, props))
      
      const icon = screen.getByTestId('accessible-icon')
      expect(icon).toHaveAttribute('aria-label', 'LinkedIn icon')
    })

    it('provides meaningful link content', () => {
      render(React.createElement(SocialLink, defaultProps))
      
      const link = screen.getByRole('link')
      expect(link).toHaveTextContent('test-user')
    })
  })

  describe('Different Social Platforms', () => {
    it('handles LinkedIn URLs', () => {
      const props = {
        ...defaultProps,
        href: 'https://www.linkedin.com/in/johndoe/',
        text: 'johndoe'
      }
      
      render(React.createElement(SocialLink, props))
      
      expect(screen.getByRole('link')).toHaveAttribute('href', 'https://www.linkedin.com/in/johndoe/')
      expect(screen.getByText('johndoe')).toBeInTheDocument()
    })

    it('handles GitHub URLs', () => {
      const props = {
        ...defaultProps,
        href: 'https://github.com/username',
        text: 'username'
      }
      
      render(React.createElement(SocialLink, props))
      
      expect(screen.getByRole('link')).toHaveAttribute('href', 'https://github.com/username')
      expect(screen.getByText('username')).toBeInTheDocument()
    })

    it('handles Twitter/X URLs', () => {
      const props = {
        ...defaultProps,
        href: 'https://twitter.com/username',
        text: '@username'
      }
      
      render(React.createElement(SocialLink, props))
      
      expect(screen.getByRole('link')).toHaveAttribute('href', 'https://twitter.com/username')
      expect(screen.getByText('@username')).toBeInTheDocument()
    })

    it('handles custom domain URLs', () => {
      const props = {
        ...defaultProps,
        href: 'https://custom-domain.com/profile',
        text: 'My Profile'
      }
      
      render(React.createElement(SocialLink, props))
      
      expect(screen.getByRole('link')).toHaveAttribute('href', 'https://custom-domain.com/profile')
      expect(screen.getByText('My Profile')).toBeInTheDocument()
    })
  })
})