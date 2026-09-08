'use client';

import React, { useEffect, useState } from 'react';
import { ProgressSummary } from '../lib/ico-progress';
import styles from '../styles/ProjectDetail.module.css';

interface ProgressBadgeProps {
  endpoint: string;
  dashboard: string;
  accentColor?: string;
}

function getCachedSummary(key: string): ProgressSummary | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

const ProgressBadge: React.FC<ProgressBadgeProps> = ({ endpoint, dashboard, accentColor }) => {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);

  useEffect(() => {
    const cacheKey = `progress:${endpoint}`;

    // 1. Load cached data immediately (stale). Not via a useState initializer:
    // this renders on the server first, so that would be a hydration mismatch.
    const cached = getCachedSummary(cacheKey);
    if (cached) {
      setSummary(cached);
    }

    // 2. Always fetch fresh data (revalidate)
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const fresh: ProgressSummary | null = data.progress || null;
        if (!fresh) return;

        // 3. Only update state and cache if data changed
        const serialized = JSON.stringify(fresh);
        if (serialized !== JSON.stringify(cached)) {
          setSummary(fresh);
          try {
            localStorage.setItem(cacheKey, serialized);
          } catch {
            // Storage unavailable; the badge still renders from state
          }
        }
      })
      .catch(() => {
        // On error, keep showing cached data (already set above)
        if (!cached) {
          setSummary(null);
        }
      });
  }, [endpoint]);

  if (!summary) return null;

  const { bytePct, matchedBytes, totalBytes, matchedFuncs, totalFuncs, funcPct } = summary;

  return (
    <a
      href={dashboard}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.progressBadge}
      style={{
        '--project-color': accentColor,
        '--progress-pct': `${bytePct}%`,
      } as React.CSSProperties}
      title={`${matchedBytes.toLocaleString()} / ${totalBytes.toLocaleString()} .text bytes matched · ${matchedFuncs.toLocaleString()} / ${totalFuncs.toLocaleString()} functions (${funcPct}%)`}
      aria-label={`${bytePct}% of code bytes matched. Opens the progress dashboard in a new tab.`}
    >
      {bytePct.toFixed(1)}%
    </a>
  );
};

export default ProgressBadge;
