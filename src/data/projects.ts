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
  backgroundImage?: string; // Optional background image shown when project is selected
  brightBackground?: boolean; // If true, use dark text for readability on bright backgrounds
  hoverColor?: string; // Border color when hovering over the badge
  hidden?: boolean; // If true, project is not displayed
}

export const projects: Project[] = [
  {
    id: 'seatmap',
    name: 'MYSEATMAP',
    tagline: 'Real-time flight intelligence.',
    category: 'saas',
    description: 'A full-stack serverless SaaS product helping airline employees make smarter standby and non-rev flight decisions. Built as CTO and 1/2 of Ody-Software.',
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
    links: [
      { label: 'MySeatMap', url: 'https://myseatmap.com', type: 'plane' },
      { label: 'Ody-Software', url: 'https://ody-software.com/', type: 'website' },
      { label: 'Privacy Policy', url: '/privacy-policy/myseatmap', type: 'privacy' },
      { label: 'Ody-Software Repository', url: 'https://github.com/nathanialf/ody-software', type: 'github', hidden: true },
      { label: 'Frontend Repository', url: 'https://github.com/nathanialf/seatmap-frontend', type: 'github', hidden: true },
      { label: 'Backend Repository', url: 'https://github.com/nathanialf/seatmap-backend', type: 'github', hidden: true },
    ],
  },
  {
    id: 'claryn-health',
    name: 'CLARYN HEALTH',
    tagline: 'Workflow-native clinical intelligence.',
    category: 'saas',
    description: 'A Chrome extension that automates screening recommendations inside Practice Fusion EHR. It pulls patient data through FHIR, runs it through a HIPAA-compliant LLM, and injects the right screenings directly into the chart. Built as CTO and 1/2 of Claryn.',
    sections: [
      {
        heading: 'The Problem',
        content: 'Providers using Practice Fusion have no automated way to know which screenings are due. They manually cross-reference conditions, meds, and prior history against clinical guidelines, and things get missed.',
      },
      {
        heading: 'What I Built',
        content: [
          'Chrome extension with SMART on FHIR EHR Launch for seamless Practice Fusion auth',
          'Direct FHIR R4 API integration pulling conditions, meds, vitals, labs, and prior screenings',
          'HIPAA-compliant LLM inference through a minimal serverless backend on AWS Lambda',
          'DOM injection engine that pre-fills screening forms directly in the EHR UI',
          'Support for 15+ screening types across mental health, preventive care, and chronic disease management',
        ],
      },
    ],
    icon: {
      type: 'placeholder',
    },
    hoverColor: '#f97316',
    links: [
      { label: 'Claryn Health', url: 'https://www.clarynhealth.com', type: 'website' },
      { label: 'YC Application', url: 'https://apply.ycombinator.com/apps/a57613d8-fe65-4a11-92ed-cb08a259e831', type: 'website', hidden: true },
      { label: 'GitHub Repository', url: 'https://github.com/nathanialf/claryn-health', type: 'github', hidden: true },
    ],
    hidden: true,
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
    id: 'markio',
    name: 'MARKIO',
    tagline: 'Working title.',
    category: 'saas',
    description: 'Role: CTO.',
    icon: {
      type: 'placeholder',
    },
    links: [],
    hidden: true,
  },
  {
    id: 'the-glass-house',
    name: 'THE GLASS HOUSE',
    tagline: 'Psychological horror through dialogue.',
    category: 'games',
    description: 'A psychological horror game where combat is entirely dialogue-based. Built as Lead Programmer with Arcane Misfits in Godot 4.',
    sections: [
      {
        heading: 'The Concept',
        content: 'You wake up in your childhood bedroom. The glow-in-the-dark stars on the ceiling are glowing a sick, pale red. You explore rooms of a house that is really a fractured mind, confronting Shadow Archetypes through dialogue choices rather than weapons.',
      },
      {
        heading: 'What I Built',
        content: [
          'Dialogue combat system with branching trees, conditional choices, and flag-driven state',
          'Hidden sanity system (100 to 0) with five tiers that progressively corrupt the experience',
          'Custom GLSL shader for wave distortion, chromatic aberration, vignette, and color shift',
          'Hallucination layer that spawns fake UI elements and trick choices that drain sanity',
          'Item database where names and descriptions change at low sanity',
        ],
      },
    ],
    icon: {
      type: 'placeholder',
    },
    hoverColor: '#8b1a3a',
    links: [
      { label: 'GitHub Repository', url: 'https://github.com/nathanialf/glass-house', type: 'github', hidden: true },
      { label: 'Releases', url: 'https://github.com/nathanialf/glass-house/releases', type: 'release', hidden: true },
      { label: 'Web Build (Dev)', url: 'https://dev.internal.defnf.com:8443/', type: 'website', hidden: true },
    ],
    hidden: true,
  },
  {
    id: 'untitled-playdate',
    name: 'TAILING PERSON 53',
    tagline: 'A Playdate game about watching strangers.',
    category: 'games',
    description: 'A Playdate game adapted from an original screenplay by Oscar Ballyvolane. You play a woman who follows strangers through Berlin, observing their routines and quiet moments through the Playdate\'s crank. Built as Programmer with Oscar Ballyvolane (Writer/Director) and Maxime Franchot (Art/Programming).',
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
          'Menu system with custom bitmap font, gridview navigation, and nine-slice UI',
          'CI/CD pipeline with GitHub Actions for automatic builds and versioned releases',
        ],
      },
    ],
    icon: {
      type: 'placeholder',
    },
    hoverColor: '#ffc500',
    links: [
      { label: 'GitHub Repository', url: 'https://github.com/nathanialf/tailing-person-53', type: 'github', hidden: true },
      { label: 'Releases', url: 'https://github.com/nathanialf/tailing-person-53/releases', type: 'release', hidden: true },
    ],
    hidden: true,
  },
  {
    id: 'vka-first-combat',
    name: 'VKA FIRST COMBAT',
    tagline: 'Mission-based mech combat.',
    category: 'games',
    description: 'A mech combat game built in Unreal Engine 5. Mission-based single-player with customizable loadouts and tactical objectives. Built as Producer/Project Manager.',
    sections: [
      {
        heading: 'The Game',
        content: 'You pilot a mech through mission-based combat scenarios. Swap weapons, build loadouts, and take on objectives like target kills, navigation challenges, and timed survival. Two core enemy types plus bosses keep the combat varied.',
      },
      {
        heading: 'What I Manage',
        content: [
          'Phase-gated roadmap across four milestones from gameplay lock to full release',
          'Task ownership and dependency tracking across programming, art, animation, and sound',
          'Scope control with strict feature lock gates to prevent creep',
          'Early playtesting pipeline and QA targets (stable 60fps)',
        ],
      },
    ],
    icon: {
      type: 'placeholder',
    },
    hoverColor: '#ff0000',
    links: [],
    hidden: true,
  },
  {
    id: 'untitled-party-game',
    name: 'UNTITLED PARTY GAME',
    tagline: 'Coming soon.',
    category: 'games',
    description: 'Role: Project Manager.',
    icon: {
      type: 'placeholder',
    },
    links: [],
    hidden: true,
  },
];