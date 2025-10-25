# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (accessible at localhost:3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Note: Currently configured as "next link" which appears to be a typo, should likely be "next lint"

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
- Two main card variants: `FloatingCard` (homepage) and `FullCard` (embed page)
- Both card variants use shared `CardContent` component for consistency

**Responsive Design:**
- Uses CSS media queries for dark/light mode background images via `<picture>` element
- Theme color defined as `#9fc2c2` in viewport metadata
- Background images stored in `/public/images/darkmode/` and `/public/images/lightmode/`

**Photography Section:**
- Dynamic photo gallery using JSON data (`src/app/photography/photos.json`)
- Server-side rendering with `fs.readFile()` for photo metadata
- Photo metadata includes camera settings, title, and year
- Images stored in `/public/photography/`

### Current Pages

1. **Homepage (`/`)** - Main portfolio with floating card design
2. **Photography (`/photography`)** - Photo gallery with EXIF-style metadata
3. **Embed (`/embed`)** - Embeddable version using full-width card

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