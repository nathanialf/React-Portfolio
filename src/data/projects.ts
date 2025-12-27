export interface ProjectLink {
  label: string;
  url: string;
  type: 'github' | 'website' | 'playstore' | 'privacy' | 'release' | 'dungeon' | 'hexagon-site' | 'plane';
  disabled?: boolean;
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
  backgroundImage?: string; // Optional background image shown when project is selected
  darkBackground?: boolean; // If true, force dark mode styling when this project is shown
}

export const projects: Project[] = [
  {
    id: 'encom',
    name: 'ENCOM',
    description: 'A unified platform powering multiple experiences—a browser-based dungeon crawler, a web dashboard, and a Nintendo 64 homebrew game—all connected through a single shared backend.',
    icon: {
      type: 'tabler',
      content: 'hexagon',
    },
    backgroundImage: '/images/projects/encom-background.png',
    darkBackground: true,
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
    description: 'Now Available on the Google Play Store!\n\nPrivacy-focused Android file management app for securely browsing and managing files on remote servers. Built with Jetpack Compose and Material 3, supporting SFTP and SMB connections.',
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
    description: 'Launching January 2026!\n\nA real-time flight seat availability intelligence platform designed for airline employees using free flight benefits. Aggregates live data from multiple airline sources to provide interactive seat maps, intelligent flight search, bookmarks, and personalized alerts—helping users make informed decisions before traveling standby.',
    icon: {
      type: 'svg',
      content: '/images/myseatmap-icon.svg',
    },
    links: [
      { label: 'Coming Soon', url: 'https://myseatmap.com', type: 'plane', disabled: true },
    ],
  },
];