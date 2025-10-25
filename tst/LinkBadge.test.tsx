import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import LinkBadge from '../src/ui/LinkBadge'
import { IconMail, IconBrandLinkedin } from '@tabler/icons-react'

// Mock the clipboard API
const mockWriteText = jest.fn()
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText
  }
})

describe('LinkBadge', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders a simple link without copy functionality', () => {
    render(
      <LinkBadge
        href="https://linkedin.com/in/test"
        icon={<IconBrandLinkedin data-testid="linkedin-icon" />}
        text="LinkedIn"
      />
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://linkedin.com/in/test')
    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders with copy functionality when copyText is provided', async () => {
    render(
      <LinkBadge
        href="mailto:test@example.com"
        icon={<IconMail data-testid="mail-icon" />}
        text="test@example.com"
        copyText="test@example.com"
      />
    )

    await waitFor(() => {
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', 'mailto:test@example.com')
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  it('copies text to clipboard when copy button is clicked', async () => {
    render(
      <LinkBadge
        href="mailto:test@example.com"
        icon={<IconMail />}
        text="test@example.com"
        copyText="test@example.com"
      />
    )

    await waitFor(() => {
      const copyButton = screen.getByRole('button')
      fireEvent.click(copyButton)
    })

    expect(mockWriteText).toHaveBeenCalledWith('test@example.com')
  })

  it('handles copy failure gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockWriteText.mockRejectedValueOnce(new Error('Copy failed'))

    render(
      <LinkBadge
        href="mailto:test@example.com"
        icon={<IconMail />}
        text="test@example.com"
        copyText="test@example.com"
      />
    )

    await waitFor(() => {
      const copyButton = screen.getByRole('button')
      fireEvent.click(copyButton)
    })

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to copy text:', expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  it('shows correct title attribute on copy button', async () => {
    render(
      <LinkBadge
        href="mailto:test@example.com"
        icon={<IconMail />}
        text="Email"
        copyText="test@example.com"
      />
    )

    await waitFor(() => {
      const copyButton = screen.getByRole('button')
      expect(copyButton).toHaveAttribute('title', 'Copy test@example.com to clipboard')
    })
  })

  it('renders as simple link when clipboard is not available', () => {
    // Temporarily remove clipboard API
    const originalClipboard = navigator.clipboard
    delete (navigator as any).clipboard

    render(
      <LinkBadge
        href="mailto:test@example.com"
        icon={<IconMail />}
        text="test@example.com"
        copyText="test@example.com"
      />
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'mailto:test@example.com')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()

    // Restore clipboard API
    ;(navigator as any).clipboard = originalClipboard
  })
})