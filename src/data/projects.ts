export interface ProjectLink {
  label: string;
  url: string;
  type: 'github' | 'website' | 'playstore' | 'privacy' | 'release' | 'dungeon' | 'hexagon-site' | 'plane';
  disabled?: boolean;
}

export interface Project {
  id: string;
  name: string;
  tagline: string; // Short tagline for gallery card
  description: string;
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
    id: 'encom',
    name: 'ENCOM',
    tagline: 'Hexagon map service.',
    description: 'One backend, three very different frontends. I built a browser-based dungeon crawler, a web dashboard, and even a Nintendo 64 homebrew game that all talk to the same server.',
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
      { label: 'encom-64 Repository', url: 'https://github.com/nathanialf/encom-64', type: 'github' },
      { label: 'N64 ROM Release', url: 'https://github.com/nathanialf/encom-64/releases/tag/alpha', type: 'release' },
    ],
  },
  {
    id: 'grid',
    name: 'GRID',
    tagline: 'Privacy-first file management.',
    description: 'Now Available on the Google Play Store!\n\nI wanted a simple way to manage files on my servers from my phone without giving up my privacy. So I built one. It connects over SFTP and SMB, and I put it together using Jetpack Compose and Material 3.',
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
    id: 'seatmap',
    name: 'MYSEATMAP',
    tagline: 'Real-time flight intelligence.',
    description: 'Flying standby can be stressful when you don\'t know if there\'s a seat for you. MySeatMap pulls real-time availability from multiple airlines into one place, with interactive seat maps, smart search, bookmarks, and alerts so you can make better decisions before heading to the airport.\n\nBuilt as 1/2 of Ody-Software.',
    icon: {
      type: 'svg',
      content: '/images/myseatmap-icon.svg',
    },
    hoverColor: '#14b8a6',
    links: [
      { label: 'MySeatMap', url: 'https://myseatmap.com', type: 'plane' },
      { label: 'Privacy Policy', url: '/privacy-policy/myseatmap', type: 'privacy' },
    ],
  },
  {
    id: 'cartograph',
    name: 'CARTOGRAPH',
    tagline: 'Docs that write themselves.',
    description: 'Working Title\n\nHand-written docs are excellent, but engineers never keep them up to date. Cartograph generates purposeful documentation based on the code itself. Connect your git repos, and webhooks keep everything in sync whenever you push changes.',
    icon: {
      type: 'tabler',
      content: 'file-ai',
    },
    hoverColor: '#1e3a5f',
    links: [
      { label: 'Shareable Documentation Example', url: 'https://cartograph.riperoni.com/share?token=3NRZJT9A9HMtgE7T8hG1OA', type: 'website' },
      { label: 'Coming Soon', url: '#', type: 'website', disabled: true },
    ],
  },
];