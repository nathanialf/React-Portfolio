export interface ProjectLink {
  label: string;
  url: string;
  type: 'github' | 'website' | 'playstore' | 'privacy' | 'release' | 'dungeon' | 'hexagon-site';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  icon: {
    type: 'tabler' | 'svg' | 'placeholder';
    content?: string; // Icon name for tabler, SVG path for svg, or placeholder text
  };
  links: ProjectLink[];
}

export const projects: Project[] = [
  {
    id: 'encom',
    name: 'ENCOM',
    description: 'Multi-platform development ecosystem showcasing how a single Lambda-based API can power diverse applications - from React web interfaces to WebGL dungeon crawlers to Nintendo 64 homebrew games.',
    icon: {
      type: 'tabler',
      content: 'hexagon',
    },
    links: [
      { label: 'Dungeon Site', url: 'https://dungeon.riperoni.com/', type: 'dungeon' },
      { label: 'Frontend Site', url: 'https://encom.riperoni.com/', type: 'hexagon-site' },
      { label: 'Lambda API', url: 'https://github.com/nathanialf/encom-lambda', type: 'github' },
      { label: 'Frontend', url: 'https://github.com/nathanialf/encom-frontend', type: 'github' },
      { label: 'Dungeon Explorer', url: 'https://github.com/nathanialf/encom-dungeon', type: 'github' },
      { label: 'Nintendo 64', url: 'https://github.com/nathanialf/encom-64', type: 'github' },
      { label: 'N64 ROM Release', url: 'https://github.com/nathanialf/encom-64/releases/tag/alpha', type: 'release' },
    ],
  },
  {
    id: 'grid',
    name: 'GRID',
    description: 'Privacy-focused Android file management app for securely browsing and managing files on remote servers. Built with Jetpack Compose and Material 3, supporting FTP, SFTP, and SMB connections. Now available on the Google Play Store.',
    icon: {
      type: 'svg',
      content: '/images/grid-icon.svg',
    },
    links: [
      { label: 'Google Play Store', url: 'https://play.google.com/store/apps/details?id=com.defnf.grid', type: 'playstore' },
      { label: 'GitHub Repository', url: 'https://github.com/nathanialf/grid', type: 'github' },
      { label: 'Privacy Policy', url: '/privacy-policy/grid', type: 'privacy' },
    ],
  },
  {
    id: 'seatmap',
    name: 'MYSEATMAP',
    description: 'Full-stack application for flight seat availability tracking. Serverless REST API aggregating data from Amadeus API (expanding to Sabre and Travelport soon), paired with a React frontend. Designed for airline employees using free flight benefits, featuring OAuth authentication and advanced search capabilities.',
    icon: {
      type: 'tabler',
      content: 'plane',
    },
    links: [
      { label: 'Backend Repository', url: 'https://github.com/nathanialf/seatmap-backend', type: 'github' },
      { label: 'Frontend Repository', url: 'https://github.com/nathanialf/seatmap-frontend', type: 'github' },
    ],
  },
];