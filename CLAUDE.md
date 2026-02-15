# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (accessible at localhost:3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint on src directory for .ts and .tsx files

## Architecture Overview

This is a Next.js 14+ React portfolio website using the App Router architecture. The project follows a component-based structure with CSS modules for styling.

### Key Architecture Patterns

**Page Structure:**
- Uses Next.js App Router with `src/app/` directory
- Pages are defined as `page.tsx` files within route directories
- Global layout in `src/app/layout.tsx` sets up Google Fonts (Outfit) and metadata

**Component Architecture:**
- Reusable UI components in `src/ui/` directory
- CSS modules for component-specific styling in `src/styles/`
- `FloatingCard` component displays the main portfolio card on homepage
- `CardContent` component contains the shared content (name, tagline, projects, links)

**Responsive Design:**
- Theme color defined as `#9fc2c2` in viewport metadata
- Background image stored in `/public/images/darkmode/background.jpg`

**Photography Section:**
- Dynamic photo gallery using JSON data (`src/app/photography/photos.json`)
- Server-side rendering with `fs.readFile()` for photo metadata
- Photo metadata includes camera settings, title, and year
- Images stored in `/public/photography/`

### Current Pages

1. **Homepage (`/`)** - Main portfolio with floating card design
2. **Photography (`/photography`)** - Photo gallery with EXIF-style metadata

### Styling System

- Global styles in `src/styles/global.css`
- Component-specific CSS modules follow `ComponentName.module.css` pattern
- Uses CSS custom properties and modern layout techniques
- Responsive design with mobile-first approach

### TypeScript Configuration

- TypeScript enabled with `strict: false` for gradual adoption
- Next.js plugin configured for optimal TypeScript integration
- `strictNullChecks: true` for better null safety

### Deployment

- Deploys to https://defnf.com via AWS Amplify
- Uses Next.js static generation where possible for optimal performance