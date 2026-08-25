export interface ProjectLink {
  label: string;
  url: string;
  type: 'github' | 'website' | 'playstore' | 'privacy' | 'release' | 'dungeon' | 'hexagon-site' | 'plane';
  disabled?: boolean;
  hidden?: boolean; // If true, link is only shown in development
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
  backgroundImage?: string | string[]; // Optional background image(s); arrays are randomized on each open
  backgroundVideo?: string; // Optional background video (webm/mp4); takes precedence over backgroundImage, plays muted/looping with no controls
  brightBackground?: boolean; // If true, use dark text for readability on bright backgrounds
  hoverColor?: string; // Border color when hovering over the badge
  hidden?: boolean; // If true, project is not displayed
  cancelled?: boolean; // If true, project is cancelled (shown only in dev with cancelled badge)
}

export const projects: Project[] = [
  {
    id: 'seatmap',
    name: 'MYSEATMAP',
    tagline: 'Real-time flight intelligence.',
    category: 'saas',
    description: 'A full-stack serverless SaaS product helping airline employees make smarter standby and non-rev flight decisions.',
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
    hoverColor: '#00bba7',
    backgroundVideo: '/images/projects/myseatmap/journey.webm',
    links: [
      { label: 'MySeatMap', url: 'https://myseatmap.com', type: 'plane' },
      { label: 'Privacy Policy', url: '/privacy-policy/myseatmap', type: 'privacy' },
      { label: 'Dev Site', url: 'https://dev.myseatmap.com', type: 'website', hidden: true },
      { label: 'Ody-Software', url: 'https://ody-software.com/', type: 'website', hidden: true },
      { label: 'Ody-Software Repository', url: 'https://github.com/nathanialf/ody-software', type: 'github', hidden: true },
      { label: 'Frontend Repository', url: 'https://github.com/nathanialf/seatmap-frontend', type: 'github', hidden: true },
      { label: 'Backend Repository', url: 'https://github.com/nathanialf/seatmap-backend', type: 'github', hidden: true },
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
      { label: 'GitHub Repository', url: 'https://github.com/nathanialf/cartograph', type: 'github', hidden: true },
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
      { label: 'Dev 2D Explorer', url: 'https://encom-dev.riperoni.com', type: 'hexagon-site', hidden: true },
      { label: 'Dev Dungeon Crawler', url: 'https://dungeon-dev.riperoni.com', type: 'dungeon', hidden: true },
      { label: 'encom-lambda Repository', url: 'https://github.com/nathanialf/encom-lambda', type: 'github' },
      { label: 'encom-frontend Repository', url: 'https://github.com/nathanialf/encom-frontend', type: 'github' },
      { label: 'encom-dungeon Repository', url: 'https://github.com/nathanialf/encom-dungeon', type: 'github' },
      { label: 'N64 ROM Release', url: 'https://github.com/nathanialf/encom-64/releases/tag/alpha', type: 'release' },
    ],
  },
  {
    id: 'grimoire-void',
    name: 'GRIMOIRE VOID',
    tagline: 'A restricted archive.',
    category: 'games',
    description: 'Working title. A wiki-as-game framed as a restricted archive recovered from a quarantined sector, with an in-wiki 3D museum and a Godot prototype exploring the same world.',
    sections: [
      {
        heading: 'The Concept',
        content: 'I wanted to see if a wiki could be the game itself instead of a companion to one. Each entry type (bestiary, dossier, location, report) shares the same template, so the chrome stays consistent while the content varies. Inside the wiki, a first-person 3D museum scene lets you walk around with pointer-lock controls and a touch fallback for mobile. Scene transitions use custom visual effects like pixel-sort derez and datamosh to keep the bureaucratic-archive tone consistent between the flat pages and the 3D space. A terminal log overlay sits in the corner for ambience.',
      },
      {
        heading: 'What I Built',
        content: [
          'React-based wiki as the primary form, presented as a redacted, restricted archive',
          'Pixelated typography and monospaced terminal styling for a bureaucratic horror tone',
          'Cross-linked entries that reward following threads between bestiary, characters, locations, and reports',
          'First-person 3D museum embedded in the wiki via react-three-fiber, with voxel cartridge pedestals, pointer-lock controls, and a terminal log HUD',
          '3D cartridge prototype in Godot, developed in tandem as an exploration of storytelling in the same world',
        ],
      },
    ],
    icon: {
      type: 'placeholder',
    },
    backgroundImage: [
      '/images/projects/grimoire-void/scene-1.jpg',
      '/images/projects/grimoire-void/scene-2.jpg',
      '/images/projects/grimoire-void/cartridge.jpg',
      '/images/projects/grimoire-void/static.jpg',
      '/images/projects/grimoire-void/glow.jpg',
    ],
    hoverColor: '#901020',
    links: [
      { label: 'Grimoire Void', url: 'https://grimoire.riperoni.com', type: 'website' },
      { label: 'Wiki Repository', url: 'https://github.com/nathanialf/grimoire-void', type: 'github' },
      { label: '3D Cartridge Prototype (Godot)', url: 'https://github.com/nathanialf/microfiche', type: 'github' },
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
    brightBackground: true,
    hoverColor: '#8B5E3C',
    links: [
      { label: 'Play in Browser', url: 'https://nathanialf.github.io/GroovyPictureBook/GroovyPictureBook.html', type: 'website' },
      { label: 'itch.io', url: 'https://wiley-fox-productions.itch.io/groovy-picture-book', type: 'website' },
      { label: 'Global Game Jam', url: 'https://globalgamejam.org/games/2026/groovypicturebook-9', type: 'website' },
      { label: 'GitHub Repository', url: 'https://github.com/nathanialf/GroovyPictureBook', type: 'github' },
    ],
  },
  {
    id: 'untitled-playdate',
    name: 'TAILING PERSON 53',
    tagline: 'A Playdate game about watching strangers.',
    category: 'games',
    description: 'A narrative graphic novel for Playdate adapted from an original screenplay by Oscar Ballyvolane. You play a woman who follows strangers through Berlin, observing their routines and quiet moments through the Playdate\'s crank. Built as Programmer with Oscar Ballyvolane (Writer/Director) and Maxime Franchot (Art/Programming).',
    sections: [
      {
        heading: 'The Game',
        content: 'Person 53 is Lennard. Scruffy, old, unremarkable. You\'ve been tailing him for 17 days. Each environment is a new scene in his life: buying ice cream, playing chess in the park, struggling with a ticket machine. The crank drives a different mechanic in each setting. Follow too close and the study ends.',
      },
      {
        heading: 'What I Built',
        content: [
          'Scene-based game architecture with lifecycle hooks and managed transitions',
          'Crank input system mapping physical rotation to per-environment mechanics',
          'CI/CD pipeline with GitHub Actions for automatic builds and versioned releases',
        ],
      },
    ],
    icon: {
      type: 'placeholder',
    },
    hoverColor: '#ffc500',
    links: [
      { label: 'Coming Soon', url: '#', type: 'website', disabled: true },
      { label: 'GitHub Repository', url: 'https://github.com/nathanialf/tailing-person-53', type: 'github', hidden: true },
      { label: 'Releases', url: 'https://github.com/nathanialf/tailing-person-53/releases', type: 'release', hidden: true },
    ],
    hidden: true,
  },
  {
    id: 'contact-force',
    name: 'CONTACT FORCE',
    tagline: 'Zero-gravity deathmatch.',
    category: 'games',
    description: 'A four-player free-for-all deathmatch set in zero gravity, built in Godot 4. You walk the outside of floating structures until you push off into open space, where the only way to steer is to shoot. Working title; the project repo is Ejecta.',
    sections: [
      {
        heading: 'The Game',
        content: 'Every arena is a handful of structures floating in a wrapping play space: leave one edge and you reappear on the other. Attached to a block you walk its surface and round its corners as if it were flat ground. Detached, you are a body with momentum: your stick rotates you to line up a landing, and firing your weapon kicks you 180° off the shot like recoil. Landing feet first is clean, landing head first hurts.',
      },
      {
        heading: 'What I Built',
        content: [
          'Surface-walking movement that carries momentum around corners, plus free-flight physics where recoil is the thrust',
          'Two-tap kill model: the first hit punctures your suit, vents air, and flings you off with a one-second window to be finished',
          'Weapons, knife melee, and ricochet timing that lets a well-placed slash save you from a hazard',
          'Full front end: player join and skin select, match configuration, HUD, pause, settings, and rematch flow',
          'Godot editor tooling for designers: grid-snapped block prefabs, a copyable arena template, and a live tuning panel over every physics value',
        ],
      },
    ],
    icon: {
      type: 'placeholder',
    },
    hoverColor: '#ff6b35',
    links: [
      { label: 'GitHub Repository', url: 'https://github.com/nathanialf/ejecta', type: 'github', hidden: true },
    ],
    hidden: true,
  },
  {
    id: 'syndicate',
    name: 'SYNDICATE',
    tagline: 'A modern Android RSS reader.',
    category: 'apps',
    description: 'A clean, full-featured RSS/Atom feed reader for Android built with Kotlin and Jetpack Compose. Release postponed indefinitely.',
    sections: [
      {
        heading: 'The Problem',
        content: 'Most RSS readers are either bloated with features nobody asked for or abandoned and outdated. I wanted something clean, fast, and thoughtfully designed.',
      },
      {
        heading: 'What I Built',
        content: [
          'Jetpack Compose UI with Material 3 dynamic theming and responsive two-pane tablet layout',
          'RSS and Atom feed parsing with automatic favicon loading and duplicate detection',
          'OPML import/export for feed backup and migration',
          'Background sync via WorkManager with per-feed push notifications',
          'Rich article rendering with inline images, code blocks, lists, and YouTube embeds',
          'Clean architecture with Room, Hilt, Retrofit, and DataStore',
        ],
      },
    ],
    icon: {
      type: 'placeholder',
    },
    hoverColor: '#f59e0b',
    links: [
      { label: 'GitHub Repository', url: 'https://github.com/nathanialf/syndicate', type: 'github' },
    ],
    hidden: true,
  },
  {
    id: 'new-years-nightmare',
    name: "NEW YEAR'S NIGHTMARE",
    tagline: 'A social horror game.',
    category: 'games',
    description: 'Role: Project Manager.',
    icon: {
      type: 'placeholder',
    },
    links: [],
    hidden: true,
  },
  {
    id: 'dawnfall-flowers-and-thorns',
    name: 'DAWNFALL: FLOWERS AND THORNS',
    tagline: 'A game by Black Onyx Studios.',
    category: 'games',
    description: 'Role: Project Manager at Black Onyx Studios. Heading to Kickstarter this fall.',
    icon: {
      type: 'placeholder',
    },
    links: [],
    hidden: true,
  },
  {
    id: 'ico-decomp',
    name: 'ICO DECOMPILED',
    tagline: 'Reverse Engineering',
    category: 'games',
    description: 'Test',
    icon: {
      type: 'placeholder',
    },
    links: [
      { label: 'GitHub Repository', url: 'https://github.com/nathanialf/ico', type: 'github' },
    ],
    hidden: true,
  },
];
