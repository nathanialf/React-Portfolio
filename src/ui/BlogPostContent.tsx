'use client';

import { useEffect, useState, useRef } from 'react';

interface BlogPostContentProps {
  htmlContent: string;
  tags?: string[];
  className?: string;
}

/* ============================================================ */
/* Tag-Specific Styles                                          */
/* ============================================================ */

// Tag → animation mapping
const TAG_ANIMATIONS: Record<string, string> = {
  'marathon': 'marathon',
};

function getAnimation(tags?: string[]): string | null {
  if (!tags) return null;
  for (const tag of tags) {
    const animation = TAG_ANIMATIONS[tag.toLowerCase()];
    if (animation) return animation;
  }
  return null;
}

// Marathon — neon glyph text reveal animation
const MARATHON_COLOR = '#bfff00';

const createDiamondSvg = (size: number, color: string) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 16 16" style="display:inline-block;vertical-align:middle"><path fill-rule="evenodd" d="M8 1L15 8L8 15L1 8Z M8 3.5 A4.5 4.5 0 0 0 8 12.5 A4.5 4.5 0 0 0 8 3.5" fill="${color}"/></svg>`;

const createCircleSvg = (size: number, color: string, id = Math.random().toString(36).slice(2)) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 16 16" style="display:inline-block;vertical-align:middle"><defs><mask id="cx${id}"><circle cx="8" cy="8" r="7" fill="white"/><circle cx="8" cy="8" r="3.5" fill="black"/><line x1="2" y1="2" x2="14" y2="14" stroke="black" stroke-width="2.5"/><line x1="14" y1="2" x2="2" y2="14" stroke="black" stroke-width="2.5"/></mask></defs><circle cx="8" cy="8" r="7" fill="${color}" mask="url(#cx${id})"/></svg>`;

const createHexagonSvg = (size: number, color: string) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 16 16" style="display:inline-block;vertical-align:middle"><path fill-rule="evenodd" d="M14 8 L11 2.8 L5 2.8 L2 8 L5 13.2 L11 13.2 Z M8 2.8 L12.5 10.6 L3.5 10.6 Z" fill="${color}"/></svg>`;

const createTargetSvg = (size: number, color: string, id = Math.random().toString(36).slice(2)) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 16 16" style="display:inline-block;vertical-align:middle"><defs><mask id="tg${id}"><circle cx="8" cy="8" r="7" fill="white"/><rect x="3" y="3" width="10" height="10" rx="1.5" fill="black"/></mask></defs><circle cx="8" cy="8" r="7" fill="${color}" mask="url(#tg${id})"/></svg>`;

const createPlusSvg = (size: number, color: string) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 16 16" style="display:inline-block;vertical-align:middle"><path d="M8 2V14M2 8H14" stroke="${color}" stroke-width="2" stroke-linecap="square"/></svg>`;

const createCrosshairSvg = (size: number, color: string) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 16 16" style="display:inline-block;vertical-align:middle"><circle cx="8" cy="8" r="7" stroke="${color}" stroke-width="1.5" fill="none"/><path d="M8 2V5.5M8 10.5V14M2 8H5.5M10.5 8H14" stroke="${color}" stroke-width="1.5"/></svg>`;

const createXTipsSvg = (size: number, color: string, id = Math.random().toString(36).slice(2)) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 16 16" style="display:inline-block;vertical-align:middle"><defs><mask id="xt${id}"><rect width="16" height="16" fill="white"/><circle cx="8" cy="8" r="6.5" fill="black"/></mask></defs><g mask="url(#xt${id})"><polygon points="0,5 5,0 16,11 11,16" fill="${color}"/><polygon points="11,0 16,5 5,16 0,11" fill="${color}"/></g></svg>`;

const createBlockSvg = (size: number, color: string) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 16 16" style="display:inline-block;vertical-align:middle"><rect x="1" y="1" width="14" height="14" fill="${color}"/></svg>`;

const SHAPE_SVG_CREATORS = [
  createDiamondSvg,
  createCircleSvg,
  createHexagonSvg,
  createTargetSvg,
  createPlusSvg,
  createCrosshairSvg,
  createXTipsSvg,
];

/* ============================================================ */

export default function BlogPostContent({ htmlContent, tags, className }: BlogPostContentProps) {
  const animation = getAnimation(tags);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(animation === 'marathon');
  const [, setAnimationComplete] = useState(animation !== 'marathon');

  useEffect(() => {
    if (animation !== 'marathon' || !containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const duration = 2000;
    const startTime = performance.now();

    // First pass: collect all text nodes without modifying DOM
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textNodes: Text[] = [];
    let node;
    while ((node = walker.nextNode())) {
      const text = node as Text;
      if (text.textContent && text.textContent.trim()) {
        textNodes.push(text);
      }
    }

    // Second pass: replace text nodes with spans for SVG animation
    const animatedSpans: { span: HTMLSpanElement; original: string; svgCreators: ((size: number, color: string) => string)[] }[] = [];
    for (const text of textNodes) {
      const original = text.textContent || '';
      // Pre-select random SVG creators for each character
      const svgCreators = original.split('').map(() =>
        SHAPE_SVG_CREATORS[Math.floor(Math.random() * SHAPE_SVG_CREATORS.length)]
      );

      // Replace text node with a span we can manipulate
      const span = document.createElement('span');
      span.textContent = original;
      text.parentNode?.replaceChild(span, text);

      animatedSpans.push({ span, original, svgCreators });
    }

    // Estimate glyph size based on font size (will be roughly 1em)
    const glyphSize = 14;

    const animate = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      animatedSpans.forEach(({ span, original, svgCreators }) => {
        let result = '';
        for (let i = 0; i < original.length; i++) {
          if (original[i] === ' ') {
            result += ' ';
            continue;
          }
          if (original[i] === '\n') {
            result += '<br>';
            continue;
          }

          // Stagger reveal from start to end
          const charDelay = (i / original.length) * 0.3;
          const charProgress = Math.max(0, Math.min(1, (progress - charDelay) / (1 - charDelay)));

          if (charProgress < 0.4) {
            // Phase 1: SVG shape glyphs
            result += svgCreators[i](glyphSize, MARATHON_COLOR);
          } else if (charProgress < 0.7) {
            // Phase 2: Solid blocks
            result += createBlockSvg(glyphSize, MARATHON_COLOR);
          } else {
            // Phase 3: Reveal real character
            result += `<span style="color:${progress < 0.85 ? MARATHON_COLOR : 'inherit'}">${original[i]}</span>`;
          }
        }
        span.innerHTML = result;
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Restore original text content
        animatedSpans.forEach(({ span, original }) => {
          span.textContent = original;
        });
        container.style.color = '';
        setIsAnimating(false);
        setAnimationComplete(true);
      }
    };

    requestAnimationFrame(animate);
  }, [animation]);

  return (
    <main
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={isAnimating ? { color: MARATHON_COLOR } : undefined}
    />
  );
}
