'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import {
  DiamondGlyph,
  TargetGlyph,
  PlusGlyph,
  HexagonGlyph,
  CrosshairGlyph,
  CircleGlyph,
} from './MarathonGlyphs';

interface MarathonTextProps {
  children: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  duration?: number;
  delay?: number;
  enabled?: boolean;
}

// Marathon 2026 design language neon yellow-green
const MARATHON_COLOR = '#bfff00';

// Glyph components for each phase
const PHASE1_GLYPHS = [DiamondGlyph, CircleGlyph, HexagonGlyph];
const PHASE2_GLYPHS = [TargetGlyph, PlusGlyph, CrosshairGlyph];

// Animation phases with duration percentages
const PHASE_NEON = 0.2;       // 0-20%: All characters in neon color
const PHASE_GLYPHS1 = 0.4;    // 20-40%: Characters become outline glyphs
const PHASE_GLYPHS2 = 0.55;   // 40-55%: Characters become target/plus glyphs
const PHASE_BLOCKS = 0.75;    // 55-75%: Characters become neon solid blocks
// 75-100%: Characters reveal to final text

export default function MarathonText({
  children,
  className,
  as: Component = 'span',
  duration = 1200,
  delay = 0,
  enabled = true,
}: MarathonTextProps) {
  const pathname = usePathname();
  const text = children;
  const [displayContent, setDisplayContent] = useState<React.ReactNode>(text);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Pre-generate random glyph assignments for each character position
  // This ensures consistent glyphs throughout the animation
  const glyphAssignments = useMemo(() => {
    return text.split('').map(() => ({
      phase1: PHASE1_GLYPHS[Math.floor(Math.random() * PHASE1_GLYPHS.length)],
      phase2: PHASE2_GLYPHS[Math.floor(Math.random() * PHASE2_GLYPHS.length)],
    }));
  }, [text]);

  useEffect(() => {
    if (!enabled) {
      setDisplayContent(text);
      return;
    }

    const length = text.length;

    const renderPhase = (progress: number): React.ReactNode => {
      const chars: React.ReactNode[] = [];

      for (let i = 0; i < length; i++) {
        if (text[i] === ' ') {
          chars.push(' ');
          continue;
        }

        // Calculate per-character progress (stagger effect)
        const charDelay = (i / length) * 0.3; // 30% stagger across all chars
        const charProgress = Math.max(0, Math.min(1, (progress - charDelay) / (1 - charDelay)));

        if (charProgress < PHASE_NEON) {
          // Phase 1: Neon colored original character
          chars.push(
            <span key={i} style={{ color: MARATHON_COLOR }}>
              {text[i]}
            </span>
          );
        } else if (charProgress < PHASE_GLYPHS1) {
          // Phase 2: Outline glyphs (diamond, circle, triangle)
          const GlyphComponent = glyphAssignments[i].phase1;
          chars.push(
            <span key={i} style={{ display: 'inline-block', width: '1em', textAlign: 'center' }}>
              <GlyphComponent size="0.8em" />
            </span>
          );
        } else if (charProgress < PHASE_GLYPHS2) {
          // Phase 3: Target/plus glyphs
          const GlyphComponent = glyphAssignments[i].phase2;
          chars.push(
            <span key={i} style={{ display: 'inline-block', width: '1em', textAlign: 'center' }}>
              <GlyphComponent size="0.8em" />
            </span>
          );
        } else if (charProgress < PHASE_BLOCKS) {
          // Phase 4: Neon solid blocks
          chars.push(
            <span key={i} style={{ color: MARATHON_COLOR }}>
              {'\u2588'}
            </span>
          );
        } else {
          // Phase 5: Final text with correct color (no inline style, CSS takes over)
          chars.push(
            <span key={i}>
              {text[i]}
            </span>
          );
        }
      }

      return chars;
    };

    // Set initial state (all neon)
    setDisplayContent(renderPhase(0));

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp + delay;
      }

      const elapsed = timestamp - startTimeRef.current;

      if (elapsed < 0) {
        // Still in delay, show initial neon state
        setDisplayContent(renderPhase(0));
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);

      if (progress >= 1) {
        // Animation complete - show plain text
        setDisplayContent(text);
      } else {
        setDisplayContent(renderPhase(progress));
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      startTimeRef.current = null;
    };
  }, [text, duration, delay, pathname, enabled, glyphAssignments]);

  return <Component className={className}>{displayContent}</Component>;
}
