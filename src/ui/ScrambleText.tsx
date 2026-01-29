'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface ScrambleTextProps {
  children: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  duration?: number;
  delay?: number;
  scrambleChars?: string;
  enabled?: boolean;
}

const defaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';

// Set to true to enable scramble animation globally
const SCRAMBLE_ENABLED = false;

export default function ScrambleText({
  children,
  className,
  as: Component = 'span',
  duration = 1000,
  delay = 0,
  scrambleChars = defaultChars,
  enabled = SCRAMBLE_ENABLED,
}: ScrambleTextProps) {
  const pathname = usePathname();
  const text = children;
  const [displayText, setDisplayText] = useState(text);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Skip animation if disabled
    if (!enabled) {
      setDisplayText(text);
      return;
    }

    const length = text.length;

    const getRandomChar = () => {
      return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
    };

    const scramble = (revealCount: number) => {
      let result = '';
      for (let i = 0; i < length; i++) {
        if (text[i] === ' ') {
          result += ' ';
        } else if (i < revealCount) {
          result += text[i];
        } else {
          result += getRandomChar();
        }
      }
      return result;
    };

    // Set initial scrambled state
    setDisplayText(scramble(0));

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp + delay;
      }

      const elapsed = timestamp - startTimeRef.current;

      if (elapsed < 0) {
        // Still in delay, show scrambled
        setDisplayText(scramble(0));
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      const revealCount = Math.floor(progress * length);

      if (progress >= 1) {
        setDisplayText(text);
      } else {
        setDisplayText(scramble(revealCount));
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
  }, [text, duration, delay, scrambleChars, pathname, enabled]);

  return <Component className={className}>{displayText}</Component>;
}
