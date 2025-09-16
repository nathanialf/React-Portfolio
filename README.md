# Nathanial Fine - Portfolio Website

A modern Next.js portfolio website featuring responsive design, dark/light mode support, and comprehensive testing.

## Features

- **Responsive Design** - Mobile-first approach with CSS modules
- **Dark/Light Mode** - Adaptive images based on user's color scheme preference
- **Interactive Components** - Social links with copy-to-clipboard functionality
- **Company Badges** - Hover tooltips with employment details
- **Comprehensive Testing** - 85+ unit tests with Jest and React Testing Library
- **Performance Optimized** - Next.js Image optimization and static generation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint with Next.js configuration
- **Icons**: Tabler Icons React
- **Deployment**: AWS Amplify

## Development Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run test     # Run test suite
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── app/           # Next.js app router pages
│   ├── layout.tsx # Global layout with Google Fonts
│   ├── page.tsx   # Homepage with floating card
│   └── embed/     # Embeddable version
├── ui/            # Reusable UI components
│   ├── CardContent.tsx    # Main content component
│   ├── SocialLink.tsx     # Social media links
│   ├── EmailLink.tsx      # Email with copy functionality
│   ├── CompanyBadge.tsx   # Employment badges
│   └── DEFNFImage.tsx     # Responsive logo
├── styles/        # CSS modules
└── ...
tst/              # Test files
public/           # Static assets
```

## Key Components

- **CardContent** - Main portfolio content shared between card variants
- **EmailLink** - Email contact with clipboard copy functionality  
- **SocialLink** - Social media links with consistent styling
- **CompanyBadge** - Previous employment with tooltip details
- **DEFNFImage** - Logo that adapts to dark/light mode

## Deployment

The site deploys automatically to [defnf.com](https://defnf.com) via AWS Amplify on push to main branch.

## Testing

Run the comprehensive test suite covering all components:

```bash
npm test
```

The test suite includes 85+ unit tests covering:
- Component rendering and props
- User interactions and events
- Accessibility features
- Edge cases and error handling
- Browser compatibility (clipboard API)