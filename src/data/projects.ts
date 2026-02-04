export interface ProjectLink {
  label: string;
  url: string;
  type: 'github' | 'website' | 'playstore' | 'privacy' | 'release' | 'dungeon' | 'hexagon-site' | 'plane';
  disabled?: boolean;
}

export interface ProjectSection {
  heading: string;
  content: string | string[]; // string for paragraph, string[] for list items
}

export type ProjectCategory = 'saas' | 'apps' | 'games';

export const categoryLabels: Record<ProjectCategory, string> = {
  saas: 'SaaS',
  apps: 'Apps',
  games: 'Games',
};

export interface Project {
  id: string;
  name: string;
  tagline: string; // Short tagline for gallery card
  description: string;
  category: ProjectCategory;
  sections?: ProjectSection[]; // Optional structured sections for detailed view
  icon: {
    type: 'tabler' | 'svg' | 'placeholder';
    content?: string; // Icon name for tabler, SVG path for svg, or placeholder text
  };
  links: ProjectLink[];
  backgroundImage?: string; // Optional background image shown when project is selected
  darkBackground?: boolean; // If true, force dark mode styling when this project is shown
  hoverColor?: string; // Border color when hovering over the badge
}

export const projects: Project[] = [
  {
    id: 'seatmap',
    name: 'MYSEATMAP',
    tagline: 'Real-time flight intelligence.',
    category: 'saas',
    description: 'A full-stack serverless SaaS product helping airline employees make smarter standby and non-rev flight decisions. Built as 1/2 of Ody-Software.',
    sections: [
      {
        heading: 'The Problem',
        content: 'My business partner, who has connections in the airline industry, saw a gap in how employees with flight benefits have no easy way to assess seat availability across multiple data sources before committing to flights.',
      },
      {
        heading: 'What I Built',
        content: [
          'Airline API integrations for real-time seat availability',
          'Serverless backend on AWS Lambda, API Gateway, and DynamoDB',
          'Modern React frontend with responsive design',
          'Alerting system based on user preferences',
          'Auth and payment integrations with Google and Stripe',
        ],
      },
    ],
    icon: {
      type: 'svg',
      content: '/images/myseatmap-icon.svg',
    },
    hoverColor: '#14b8a6',
    links: [
      { label: 'MySeatMap', url: 'https://myseatmap.com', type: 'plane' },
      { label: 'Ody-Software', url: 'https://ody-software.com/', type: 'website' },
      { label: 'Privacy Policy', url: '/privacy-policy/myseatmap', type: 'privacy' },
    ],
  },
  {
    id: 'cartograph',
    name: 'CARTOGRAPH',
    tagline: 'Docs that write themselves.',
    category: 'saas',
    description: 'AI-powered documentation that stays in sync with your code. Working title.',
    sections: [
      {
        heading: 'The Problem',
        content: 'Hand-written docs are excellent, but engineers never keep them up to date.',
      },
      {
        heading: 'What I Built',
        content: [
          'Multi-step analysis pipeline with AWS Step Functions',
          'LLM-powered document generation with configurable sections',
          'Pre-LLM secret scanning and automatic redaction',
          'GitHub OAuth and webhook integration',
          'Serverless backend on Lambda, DynamoDB, and S3',
          'Next.js dashboard with Mermaid diagram rendering',
        ],
      },
    ],
    icon: {
      type: 'tabler',
      content: 'file-ai',
    },
    hoverColor: '#1e3a5f',
    links: [
      { label: 'Prototype Site', url: 'https://cartograph.riperoni.com', type: 'website' },
      { label: 'Shareable Documentation Example', url: 'https://cartograph.riperoni.com/share?token=3NRZJT9A9HMtgE7T8hG1OA', type: 'website' },
    ],
  },
  {
    id: 'grid',
    name: 'GRID',
    tagline: 'Thoughtfully designed file management.',
    category: 'apps',
    description: 'A beautifully crafted Android file manager. Now available on the Google Play Store.',
    sections: [
      {
        heading: 'The Problem',
        content: 'I wanted a file manager that felt intuitive and looked great. So I built one.',
      },
      {
        heading: 'What I Built',
        content: [
          'Clean, minimal interface with attention to detail',
          'Built-in viewers for code, images, PDFs, video, audio, and EPUB',
          'Smooth animations and thoughtful micro-interactions',
          'SFTP and SMB protocol support for remote file access',
          'Biometric authentication for saved connections',
        ],
      },
    ],
    icon: {
      type: 'svg',
      content: '/images/grid-icon.svg',
    },
    hoverColor: '#22c55e',
    links: [
      { label: 'Google Play Store', url: 'https://play.google.com/store/apps/details?id=com.defnf.grid', type: 'playstore' },
      { label: 'GitHub Repository', url: 'https://github.com/nathanialf/grid', type: 'github' },
      { label: 'Privacy Policy', url: '/privacy-policy/grid', type: 'privacy' },
    ],
  },
  {
    id: 'encom',
    name: 'ENCOM',
    tagline: 'Hexagon map service.',
    category: 'games',
    description: 'One backend, three very different applications.',
    sections: [
      {
        heading: 'The Concept',
        content: 'A hexagonal map service that serves the same data to completely different client experiences.',
      },
      {
        heading: 'Applications',
        content: [
          'Browser-based dungeon crawler',
          '2D hex map explorer and dashboard',
          'Nintendo 64 homebrew game',
        ],
      },
    ],
    icon: {
      type: 'tabler',
      content: 'hexagon',
    },
    backgroundImage: '/images/projects/encom-background.png',
    hoverColor: '#8b5cf6',
    links: [
      { label: 'Dungeon Crawler', url: 'https://dungeon.riperoni.com/', type: 'dungeon' },
      { label: '2D Explorer', url: 'https://encom.riperoni.com/', type: 'hexagon-site' },
      { label: 'encom-lambda Repository', url: 'https://github.com/nathanialf/encom-lambda', type: 'github' },
      { label: 'encom-frontend Repository', url: 'https://github.com/nathanialf/encom-frontend', type: 'github' },
      { label: 'encom-dungeon Repository', url: 'https://github.com/nathanialf/encom-dungeon', type: 'github' },
      { label: 'N64 ROM Release', url: 'https://github.com/nathanialf/encom-64/releases/tag/alpha', type: 'release' },
    ],
  },
  {
    id: 'groovy-picture-book',
    name: 'GROOVY PICTURE BOOK',
    tagline: 'Global Game Jam 2026.',
    category: 'games',
    description: 'A platformer where you jump through a picture book made of cardboard cutouts, collecting pushpins as you punch into and out of different pages.',
    sections: [
      {
        heading: 'The Project',
        content: 'Created in 48 hours for Global Game Jam 2026 at the MADE (Museum of Art and Digital Entertainment) with the theme "Mask." I served as project manager, coordinating a team to bring together art, music, and gameplay into a layered picture book experience.',
      },
    ],
    icon: {
      type: 'tabler',
      content: 'book',
    },
    backgroundImage: '/images/projects/groovy-picture-book-background.png',
    hoverColor: '#ec4899',
    links: [
      { label: 'Play in Browser', url: 'https://nathanialf.github.io/GroovyPictureBook/GroovyPictureBook.html', type: 'website' },
      { label: 'itch.io', url: 'https://wiley-fox-productions.itch.io/groovy-picture-book', type: 'website' },
      { label: 'Global Game Jam', url: 'https://globalgamejam.org/games/2026/groovypicturebook-9', type: 'website' },
      { label: 'GitHub Repository', url: 'https://github.com/nathanialf/GroovyPictureBook', type: 'github' },
    ],
  },
];