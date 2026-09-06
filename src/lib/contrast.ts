// WCAG relative luminance and the black/white text choice for a filled swatch.

const FALLBACK_COLOR = '#525252'; // matches the CSS fallback for --project-color

export const relativeLuminance = (hex: string): number => {
  const normalized = hex.replace('#', '');
  const full = normalized.length === 3
    ? normalized.split('').map(c => c + c).join('')
    : normalized;
  const channels = [0, 2, 4].map(i => {
    const value = parseInt(full.slice(i, i + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

export interface ContrastTextVars {
  '--project-text-color': string;
  '--project-text-muted': string;
}

// Picks whichever of black or white has the higher contrast ratio against the fill.
export const contrastTextVars = (color?: string): ContrastTextVars => {
  const luminance = relativeLuminance(color || FALLBACK_COLOR);
  const againstBlack = (luminance + 0.05) / 0.05;
  const againstWhite = 1.05 / (luminance + 0.05);
  const useDarkText = againstBlack > againstWhite;

  return {
    '--project-text-color': useDarkText ? '#000000' : '#ffffff',
    '--project-text-muted': useDarkText ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
  };
};
