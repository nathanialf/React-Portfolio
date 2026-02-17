'use client';

// Marathon 2026 design language glyphs as inline SVGs
// These match the packaging aesthetic with pixel-perfect rendering

const MARATHON_COLOR = '#bfff00';

interface GlyphProps {
  size?: number | string;
  color?: string;
  className?: string;
}

// Diamond with circular cutout
export function DiamondGlyph({ size = '1em', color = MARATHON_COLOR, className }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path
        fillRule="evenodd"
        d="M8 1L15 8L8 15L1 8Z M8 3.5 A4.5 4.5 0 0 0 8 12.5 A4.5 4.5 0 0 0 8 3.5"
        fill={color}
      />
    </svg>
  );
}

// Circle with rounded square cutout
export function TargetGlyph({ size = '1em', color = MARATHON_COLOR, className }: GlyphProps) {
  const maskId = `tg-${Math.random().toString(36).slice(2)}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <defs>
        <mask id={maskId}>
          <circle cx="8" cy="8" r="7" fill="white"/>
          <rect x="3" y="3" width="10" height="10" rx="1.5" fill="black"/>
        </mask>
      </defs>
      <circle cx="8" cy="8" r="7" fill={color} mask={`url(#${maskId})`}/>
    </svg>
  );
}

// Plus/cross sign (+)
export function PlusGlyph({ size = '1em', color = MARATHON_COLOR, className }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path
        d="M8 2V14M2 8H14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}

// Flat-top hexagon with triangle cutout touching edge centers
export function HexagonGlyph({ size = '1em', color = MARATHON_COLOR, className }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path
        fillRule="evenodd"
        d="M14 8 L11 2.8 L5 2.8 L2 8 L5 13.2 L11 13.2 Z M8 2.8 L12.5 10.6 L3.5 10.6 Z"
        fill={color}
      />
    </svg>
  );
}

// Keep TriangleGlyph as alias for backwards compatibility
export const TriangleGlyph = HexagonGlyph;

// Hexagon with diagonal split (the IR block style)
export function HexSplitGlyph({ size = '1em', color = MARATHON_COLOR, className }: GlyphProps) {
  const darkColor = '#0a6618';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Light green base */}
      <rect x="1" y="1" width="14" height="14" fill={color} />
      {/* Dark green triangle top-right */}
      <path d="M1 1L15 1L15 15Z" fill={darkColor} />
    </svg>
  );
}

// Crosshair/reticle with interior lines
export function CrosshairGlyph({ size = '1em', color = MARATHON_COLOR, className }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="1.5" fill="none" />
      <path
        d="M8 2V5.5M8 10.5V14M2 8H5.5M10.5 8H14"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
}

// Small filled diamond
export function DiamondFilledGlyph({ size = '1em', color = MARATHON_COLOR, className }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path
        d="M8 2L14 8L8 14L2 8L8 2Z"
        fill={color}
      />
    </svg>
  );
}

// X tips - thick X with circle cutout showing only the tips
export function XTipsGlyph({ size = '1em', color = MARATHON_COLOR, className }: GlyphProps) {
  const maskId = `xt-${Math.random().toString(36).slice(2)}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <defs>
        <mask id={maskId}>
          <rect width="16" height="16" fill="white"/>
          <circle cx="8" cy="8" r="6.5" fill="black"/>
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <polygon points="0,5 5,0 16,11 11,16" fill={color}/>
        <polygon points="11,0 16,5 5,16 0,11" fill={color}/>
      </g>
    </svg>
  );
}

// Thick circle ring with X cutout
export function CircleGlyph({ size = '1em', color = MARATHON_COLOR, className }: GlyphProps) {
  const maskId = `cx-${Math.random().toString(36).slice(2)}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <defs>
        <mask id={maskId}>
          <circle cx="8" cy="8" r="7" fill="white"/>
          <circle cx="8" cy="8" r="3.5" fill="black"/>
          <line x1="2" y1="2" x2="14" y2="14" stroke="black" strokeWidth="2.5"/>
          <line x1="14" y1="2" x2="2" y2="14" stroke="black" strokeWidth="2.5"/>
        </mask>
      </defs>
      <circle cx="8" cy="8" r="7" fill={color} mask={`url(#${maskId})`}/>
    </svg>
  );
}

// Array of glyph components for random selection
export const MARATHON_GLYPHS = [
  DiamondGlyph,
  TargetGlyph,
  PlusGlyph,
  TriangleGlyph,
  CrosshairGlyph,
  CircleGlyph,
  XTipsGlyph,
];

// Get a random glyph component
export function getRandomGlyph() {
  return MARATHON_GLYPHS[Math.floor(Math.random() * MARATHON_GLYPHS.length)];
}
