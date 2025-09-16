import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmailLink from '../src/ui/EmailLink'
import { IconMail } from '@tabler/icons-react'

// Mock the clipboard API
const mockWriteText = jest.fn().mockResolvedValue(undefined)

// Ensure navigator is available in test environment
Object.defineProperty(global, 'navigator', {
  value: {
    clipboard: {
      writeText: mockWriteText,
    },
  },
  writable: true,
})

describe('EmailLink', () => {
  const defaultProps = {
    href: 'mailto:test@example.com',
    icon: React.createElement(IconMail, { 'data-testid': 'mail-icon' }),
    text: 'test@example.com',
    email: 'test@example.com'
  }

  beforeEach(() => {
    mockWriteText.mockClear()
    // Ensure navigator.clipboard is available for each test
    Object.defineProperty(global, 'navigator', {
      value: {
        clipboard: {
          writeText: mockWriteText,
        },
      },
      writable: true,
    })
  })

  describe('Basic Rendering', () => {
    it('renders email link with icon and text', () => {
      render(React.createElement(EmailLink, defaultProps))
      
      expect(screen.getByRole('link')).toHaveAttribute('href', 'mailto:test@example.com')
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('renders with different email and display text', () => {
      const props = {
        ...defaultProps,
        text: 'Contact Me',
        email: 'different@example.com'
      }
      
      render(React.createElement(EmailLink, props))
      
      expect(screen.getByText('Contact Me')).toBeInTheDocument()
      expect(screen.getByRole('link')).toHaveAttribute('href', 'mailto:test@example.com')
    })

    it('applies correct CSS classes', () => {
      render(React.createElement(EmailLink, defaultProps))
      
      const container = screen.getByRole('link').parentElement
      expect(container).toHaveClass('container')
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass('emailLink')
    })
  })

  describe('Clipboard Functionality', () => {
    it('renders copy button when clipboard API is available', () => {
      render(React.createElement(EmailLink, defaultProps))
      
      expect(screen.getByRole('button', { name: /copy email to clipboard/i })).toBeInTheDocument()
      expect(screen.getByTitle('Copy email to clipboard')).toBeInTheDocument()
    })

    it('renders divider when clipboard API is available', () => {
      render(React.createElement(EmailLink, defaultProps))
      
      const divider = document.querySelector('.divider')
      expect(divider).toBeInTheDocument()
    })

    it('copies email to clipboard when copy button is clicked', async () => {
      render(React.createElement(EmailLink, defaultProps))
      
      const copyButton = screen.getByRole('button', { name: /copy email to clipboard/i })
      fireEvent.click(copyButton)
      
      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith('test@example.com')
      })
    })

    it('handles clipboard API errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      mockWriteText.mockRejectedValue(new Error('Clipboard API failed'))
      
      render(React.createElement(EmailLink, defaultProps))
      
      const copyButton = screen.getByRole('button', { name: /copy email to clipboard/i })
      fireEvent.click(copyButton)
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to copy email:', expect.any(Error))
      })
      
      consoleSpy.mockRestore()
    })

    it('does not render copy button when clipboard API is not available', () => {
      // Temporarily remove clipboard API
      const originalNavigator = global.navigator
      delete (global as any).navigator
      
      render(React.createElement(EmailLink, defaultProps))
      
      expect(screen.queryByRole('button', { name: /copy email to clipboard/i })).not.toBeInTheDocument()
      expect(document.querySelector('.divider')).not.toBeInTheDocument()
      
      // Restore navigator
      global.navigator = originalNavigator
    })

    it('does not render copy button when navigator is undefined', () => {
      Object.defineProperty(global, 'navigator', {
        value: undefined,
        writable: true,
      })
      
      render(React.createElement(EmailLink, defaultProps))
      
      expect(screen.queryByRole('button', { name: /copy email to clipboard/i })).not.toBeInTheDocument()
      expect(document.querySelector('.divider')).not.toBeInTheDocument()
    })

    it('does not render copy button when clipboard property is missing', () => {
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
      })
      
      render(React.createElement(EmailLink, defaultProps))
      
      expect(screen.queryByRole('button', { name: /copy email to clipboard/i })).not.toBeInTheDocument()
      expect(document.querySelector('.divider')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper accessibility attributes', () => {
      render(React.createElement(EmailLink, defaultProps))
      
      const copyButton = screen.getByRole('button', { name: /copy email to clipboard/i })
      expect(copyButton).toHaveAttribute('type', 'button')
      expect(copyButton).toHaveAttribute('title', 'Copy email to clipboard')
    })

    it('maintains proper link accessibility', () => {
      render(React.createElement(EmailLink, defaultProps))
      
      const emailLink = screen.getByRole('link')
      expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com')
      expect(emailLink).not.toHaveAttribute('target') // Should not open in new tab
    })
  })

  describe('Edge Cases', () => {
    it('handles empty email string', () => {
      const props = {
        ...defaultProps,
        email: ''
      }
      
      render(React.createElement(EmailLink, props))
      
      const copyButton = screen.getByRole('button', { name: /copy email to clipboard/i })
      fireEvent.click(copyButton)
      
      expect(mockWriteText).toHaveBeenCalledWith('')
    })

    it('handles special characters in email', () => {
      const props = {
        ...defaultProps,
        email: 'test+tag@example-domain.co.uk'
      }
      
      render(React.createElement(EmailLink, props))
      
      const copyButton = screen.getByRole('button', { name: /copy email to clipboard/i })
      fireEvent.click(copyButton)
      
      expect(mockWriteText).toHaveBeenCalledWith('test+tag@example-domain.co.uk')
    })

    it('renders without errors when icon is null', () => {
      const props = {
        ...defaultProps,
        icon: null
      }
      
      expect(() => {
        render(React.createElement(EmailLink, props))
      }).not.toThrow()
      
      expect(screen.getByRole('link')).toBeInTheDocument()
    })

    it('renders copy button with correct CSS class', () => {
      render(React.createElement(EmailLink, defaultProps))
      
      const copyButton = screen.getByRole('button', { name: /copy email to clipboard/i })
      expect(copyButton).toHaveClass('copyButton')
    })
  })
})