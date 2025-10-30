# Nathanial Fine - Portfolio Website

A modern Next.js portfolio website featuring responsive design, dark/light mode support, and comprehensive testing.

## Features

- **Responsive Design** - Mobile-first approach with CSS modules
- **Dark/Light Mode** - Adaptive images based on user's color scheme preference
- **Interactive Project Showcase** - Dynamic project details with smooth animations
- **Privacy Policy System** - Comprehensive markdown-based privacy policies with table support, anchor links, and legal compliance
- **Contact Links** - Unified link badges with copy-to-clipboard functionality
- **Company Badges** - Previous employment showcase
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
- **Markdown**: Remark + GitHub Flavored Markdown with rehype plugins for enhanced privacy policies
- **Deployment**: AWS Amplify

## Development Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run clean    # Clean Next.js build cache
npm run test     # Run test suite
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── app/           # Next.js app router pages
│   ├── layout.tsx # Global layout with Google Fonts
│   ├── page.tsx   # Homepage with floating card
│   ├── embed/     # Embeddable version
│   └── privacy-policy/  # Privacy policy system
├── ui/            # Reusable UI components
│   ├── CardContent.tsx     # Main content component
│   ├── LinkBadge.tsx       # Unified contact links
│   ├── ProjectsSection.tsx # Project showcase
│   ├── ProjectDetail.tsx   # Individual project views
│   ├── CompanyBadge.tsx    # Employment badges
│   └── DEFNFImage.tsx      # Responsive logo
├── data/          # Data and content
│   ├── projects.ts         # Project definitions
│   └── privacy-policies/   # Markdown privacy policies
├── styles/        # CSS modules
└── ...
tst/              # Test files
public/           # Static assets
```

## Key Components

- **CardContent** - Main portfolio content shared between card variants
- **ProjectsSection** - Interactive project showcase with dynamic details
- **ProjectDetail** - Individual project views with GitHub, Play Store, privacy policy, and external links
- **LinkBadge** - Unified contact links with clipboard copy functionality
- **CompanyBadge** - Previous employment showcase
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