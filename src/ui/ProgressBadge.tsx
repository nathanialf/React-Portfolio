'use client';

import React, { useEffect, useState } from 'react';
import { TargetProgress } from '../lib/ico-progress';
import styles from '../styles/ProjectDetail.module.css';

interface ProgressBadgeProps {
  endpoint: string;
  dashboard: string; // Dashboard root; each badge deep-links to its target's #hash
  accentColor?: string;
}

// Versioned: earlier visits cached a single summary object under `progress:<endpoint>`
const cacheKeyFor = (endpoint: string) => `progress:v2:${endpoint}`;

function getCachedTargets(key: string): TargetProgress[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(key);
    const parsed = cached ? JSON.parse(cached) : null;
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

const ProgressBadge: React.FC<ProgressBadgeProps> = ({ endpoint, dashboard, accentColor }) => {
  const [targets, setTargets] = useState<TargetProgress[] | null>(null);

  useEffect(() => {
    const cacheKey = cacheKeyFor(endpoint);

    // 1. Load cached data immediately (stale). Not via a useState initializer:
    // this renders on the server first, so that would be a hydration mismatch.
    const cached = getCachedTargets(cacheKey);
    if (cached) {
      setTargets(cached);
    }

    // 2. Always fetch fresh data (revalidate)
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const fresh: TargetProgress[] | null =
          Array.isArray(data.targets) && data.targets.length > 0 ? data.targets : null;
        if (!fresh) return;

        // 3. Only update state and cache if data changed
        const serialized = JSON.stringify(fresh);
        if (serialized !== JSON.stringify(cached)) {
          setTargets(fresh);
          try {
            localStorage.setItem(cacheKey, serialized);
          } catch {
            // Storage unavailable; the badges still render from state
          }
        }
      })
      .catch(() => {
        // On error, keep showing cached data (already set above)
        if (!cached) {
          setTargets(null);
        }
      });
  }, [endpoint]);

  if (!targets) return null;

  return (
    <>
      {targets.map(({ target, bytePct, matchedBytes, totalBytes, matchedFuncs, totalFuncs, funcPct }) => (
        <a
          key={target.id}
          href={`${dashboard}#${target.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.progressBadge}
          style={{
            '--project-color': accentColor,
            '--progress-pct': `${bytePct}%`,
          } as React.CSSProperties}
          title={`${target.name}: ${matchedBytes.toLocaleString()} / ${totalBytes.toLocaleString()} .text bytes matched · ${matchedFuncs.toLocaleString()} / ${totalFuncs.toLocaleString()} functions (${funcPct}%)`}
          aria-label={`${target.name}: ${bytePct}% of code bytes matched. Opens the progress dashboard in a new tab.`}
        >
          {target.short} {bytePct.toFixed(1)}%
        </a>
      ))}
    </>
  );
};

export default ProgressBadge;
