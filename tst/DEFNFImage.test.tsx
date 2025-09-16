import React from 'react'
import { render, screen } from '@testing-library/react'
import DEFNFImage from '../src/ui/DEFNFImage'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, height, width, ...props }: any) {
    return React.createElement('img', {
      src,
      alt,
      height,
      width,
      'data-testid': 'next-image',
      ...props
    })
  }
})

describe('DEFNFImage', () => {
  describe('Basic Rendering', () => {
    it('renders the image component', () => {
      render(React.createElement(DEFNFImage))
      
      expect(screen.getByTestId('next-image')).toBeInTheDocument()
    })

    it('renders with correct image attributes', () => {
      render(React.createElement(DEFNFImage))
      
      const image = screen.getByTestId('next-image')
      expect(image).toHaveAttribute('src', '/images/lightmode/defnf.png')
      expect(image).toHaveAttribute('alt', 'DEFNF Logo')
      expect(image).toHaveAttribute('height', '80')
      expect(image).toHaveAttribute('width', '80')
    })

    it('renders within a picture element', () => {
      render(React.createElement(DEFNFImage))
      
      const picture = document.querySelector('picture')
      expect(picture).toBeInTheDocument()
      expect(picture).toContainElement(screen.getByTestId('next-image'))
    })
  })

  describe('Responsive Image Sources', () => {
    it('includes dark mode source element', () => {
      render(React.createElement(DEFNFImage))
      
      const darkModeSource = document.querySelector('source[media="(prefers-color-scheme: dark)"]')
      expect(darkModeSource).toBeInTheDocument()
      expect(darkModeSource).toHaveAttribute('srcSet', '/images/darkmode/defnf.png')
    })

    it('uses light mode as fallback image', () => {
      render(React.createElement(DEFNFImage))
      
      const image = screen.getByTestId('next-image')
      expect(image).toHaveAttribute('src', '/images/lightmode/defnf.png')
    })

    it('has proper DOM structure with picture and source elements', () => {
      render(React.createElement(DEFNFImage))
      
      const picture = document.querySelector('picture')
      const source = document.querySelector('source')
      const image = screen.getByTestId('next-image')
      
      expect(picture).toBeInTheDocument()
      expect(source).toBeInTheDocument()
      expect(image).toBeInTheDocument()
      
      // Verify structure: picture contains source and image
      expect(picture).toContainElement(source)
      expect(picture).toContainElement(image)
    })
  })

  describe('Image Dimensions', () => {
    it('sets correct width and height', () => {
      render(React.createElement(DEFNFImage))
      
      const image = screen.getByTestId('next-image')
      expect(image).toHaveAttribute('width', '80')
      expect(image).toHaveAttribute('height', '80')
    })

    it('maintains square aspect ratio', () => {
      render(React.createElement(DEFNFImage))
      
      const image = screen.getByTestId('next-image')
      const width = image.getAttribute('width')
      const height = image.getAttribute('height')
      
      expect(width).toBe(height)
      expect(width).toBe('80')
    })
  })

  describe('Accessibility', () => {
    it('has meaningful alt text', () => {
      render(React.createElement(DEFNFImage))
      
      const image = screen.getByTestId('next-image')
      expect(image).toHaveAttribute('alt', 'DEFNF Logo')
    })

    it('is accessible by role', () => {
      render(React.createElement(DEFNFImage))
      
      const image = screen.getByRole('img')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('alt', 'DEFNF Logo')
    })

    it('can be found by alt text', () => {
      render(React.createElement(DEFNFImage))
      
      expect(screen.getByAltText('DEFNF Logo')).toBeInTheDocument()
    })
  })

  describe('Media Query Configuration', () => {
    it('configures dark mode media query correctly', () => {
      render(React.createElement(DEFNFImage))
      
      const source = document.querySelector('source')
      expect(source).toHaveAttribute('media', '(prefers-color-scheme: dark)')
    })

    it('sets correct srcSet for dark mode', () => {
      render(React.createElement(DEFNFImage))
      
      const source = document.querySelector('source')
      expect(source).toHaveAttribute('srcSet', '/images/darkmode/defnf.png')
    })

    it('handles both light and dark mode sources', () => {
      render(React.createElement(DEFNFImage))
      
      // Dark mode source
      const darkModeSource = document.querySelector('source[srcSet="/images/darkmode/defnf.png"]')
      expect(darkModeSource).toBeInTheDocument()
      
      // Light mode fallback
      const lightModeImage = screen.getByTestId('next-image')
      expect(lightModeImage).toHaveAttribute('src', '/images/lightmode/defnf.png')
    })
  })

  describe('Component Structure', () => {
    it('renders without any props', () => {
      expect(() => {
        render(React.createElement(DEFNFImage))
      }).not.toThrow()
    })

    it('maintains consistent structure across renders', () => {
      const { rerender } = render(React.createElement(DEFNFImage))
      
      const firstRenderPicture = document.querySelector('picture')
      const firstRenderSource = document.querySelector('source')
      const firstRenderImage = screen.getByTestId('next-image')
      
      expect(firstRenderPicture).toBeInTheDocument()
      expect(firstRenderSource).toBeInTheDocument()
      expect(firstRenderImage).toBeInTheDocument()
      
      rerender(React.createElement(DEFNFImage))
      
      // Structure should remain the same
      expect(document.querySelector('picture')).toBeInTheDocument()
      expect(document.querySelector('source')).toBeInTheDocument()
      expect(screen.getByTestId('next-image')).toBeInTheDocument()
    })

    it('uses Next.js Image component', () => {
      render(React.createElement(DEFNFImage))
      
      // Our mock should be called, indicating Next.js Image is being used
      expect(screen.getByTestId('next-image')).toBeInTheDocument()
    })
  })

  describe('File Paths', () => {
    it('uses correct path structure for images', () => {
      render(React.createElement(DEFNFImage))
      
      const darkModeSource = document.querySelector('source')
      const lightModeImage = screen.getByTestId('next-image')
      
      // Verify paths follow expected structure
      expect(darkModeSource).toHaveAttribute('srcSet', '/images/darkmode/defnf.png')
      expect(lightModeImage).toHaveAttribute('src', '/images/lightmode/defnf.png')
      
      // Both should reference the same filename in different directories
      expect(darkModeSource?.getAttribute('srcSet')).toContain('defnf.png')
      expect(lightModeImage.getAttribute('src')).toContain('defnf.png')
    })

    it('uses absolute paths from public directory', () => {
      render(React.createElement(DEFNFImage))
      
      const darkModeSource = document.querySelector('source')
      const lightModeImage = screen.getByTestId('next-image')
      
      expect(darkModeSource?.getAttribute('srcSet')).toMatch(/^\/images\//)
      expect(lightModeImage.getAttribute('src')).toMatch(/^\/images\//)
    })
  })

  describe('Performance Considerations', () => {
    it('provides efficient responsive image setup', () => {
      render(React.createElement(DEFNFImage))
      
      // Should have picture element for responsive behavior
      const picture = document.querySelector('picture')
      expect(picture).toBeInTheDocument()
      
      // Should have source with media query for efficient loading
      const source = document.querySelector('source[media]')
      expect(source).toBeInTheDocument()
      
      // Should use Next.js Image for optimization
      const image = screen.getByTestId('next-image')
      expect(image).toBeInTheDocument()
    })

    it('follows responsive image best practices', () => {
      render(React.createElement(DEFNFImage))
      
      const picture = document.querySelector('picture')
      const source = document.querySelector('source')
      const image = screen.getByTestId('next-image')
      
      // Picture element should contain both source and img
      expect(picture).toContainElement(source)
      expect(picture).toContainElement(image)
      
      // Source should have media query and srcSet
      expect(source).toHaveAttribute('media')
      expect(source).toHaveAttribute('srcSet')
      
      // Image should have fallback src
      expect(image).toHaveAttribute('src')
    })
  })
})