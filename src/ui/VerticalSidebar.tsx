'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/VerticalSidebar.module.css';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface VerticalSidebarProps {
  disableLink?: boolean;
}

interface CachedData {
  contributions: ContributionDay[];
  fetchedDate: string;
}

const CACHE_KEY = 'github-contributions';

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCachedContributions(): ContributionDay[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const data: CachedData = JSON.parse(cached);
    return data.contributions;
  } catch {
    return null;
  }
}

function contributionsChanged(
  oldData: ContributionDay[] | null,
  newData: ContributionDay[]
): boolean {
  if (!oldData) return true;
  if (oldData.length !== newData.length) return true;
  return JSON.stringify(oldData) !== JSON.stringify(newData);
}

function setCachedContributions(contributions: ContributionDay[]): void {
  if (typeof window === 'undefined') return;
  const data: CachedData = {
    contributions,
    fetchedDate: getTodayString(),
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

const VerticalSidebar: React.FC<VerticalSidebarProps> = ({ disableLink }) => {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);

  useEffect(() => {
    // 1. Load cached data immediately (stale)
    const cached = getCachedContributions();
    if (cached) {
      setContributions(cached);
    }

    // 2. Always fetch fresh data (revalidate)
    fetch('/api/contributions?username=nathanialf')
      .then(res => res.json())
      .then(data => {
        const freshContributions = data.contributions || [];

        // 3. Only update state and cache if data changed
        if (contributionsChanged(cached, freshContributions)) {
          setContributions(freshContributions);
          setCachedContributions(freshContributions);
        }
      })
      .catch(() => {
        // On error, keep showing cached data (already set above)
        // Only set empty if no cache existed
        if (!cached) {
          setContributions([]);
        }
      });
  }, []);

  const days = contributions.slice(-182); // ~6 months
  const firstDate = new Date(days[0]?.date || new Date());
  const padDays = firstDate.getDay();

  const allDays: (ContributionDay | null)[] = [
    ...Array(padDays).fill(null),
    ...days
  ];

  const weeks: (ContributionDay | null)[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    const week = allDays.slice(i, i + 7);
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  const getColor = (level: number | undefined) => {
    if (!level) return 'transparent';
    const opacity = [0, 0.3, 0.5, 0.7, 0.9][level] || 0;
    return `rgba(255,255,255,${opacity})`;
  };

  const gap = 3;
  const dotSize = 3;
  const offset = (dotSize + gap) / 2;

  // Calculate actual content width (rightmost circle edge)
  const contentWidth = 3 * (dotSize + gap) + dotSize; // 4 circles in column 1
  const svgWidth = contentWidth + offset; // add space for honeycomb offset
  const svgHeight = weeks.length * (dotSize + gap);
  const padX = offset / 2; // center the honeycomb pattern

  const content = (
    <>
      <Image
        src="/images/defnf-logo.svg"
        alt="DEFNF"
        width={20}
        height={20}
        className={styles.logo}
      />
      <div className={styles.brandText}>DEFNF COMPUTING</div>
      <svg className={styles.graph} width={svgWidth} height={svgHeight}>
        {weeks.map((week, wi) => (
          <g key={wi}>
            {/* Column 1: Sun, Tue, Thu, Sat (indices 0, 2, 4, 6) */}
            {[0, 2, 4, 6].map((di, i) => (
              <circle
                key={`a-${di}`}
                cx={padX + i * (dotSize + gap) + dotSize / 2}
                cy={wi * (dotSize + gap) + dotSize / 2}
                r={dotSize / 2}
                fill={getColor(week[di]?.level)}
              />
            ))}
            {/* Column 2: Mon, Wed, Fri (indices 1, 3, 5) - offset */}
            {[1, 3, 5].map((di, i) => (
              <circle
                key={`b-${di}`}
                cx={padX + i * (dotSize + gap) + dotSize / 2 + offset}
                cy={wi * (dotSize + gap) + dotSize / 2 + offset}
                r={dotSize / 2}
                fill={getColor(week[di]?.level)}
              />
            ))}
          </g>
        ))}
      </svg>
    </>
  );

  if (disableLink) {
    return <div className={styles.sidebar}>{content}</div>;
  }

  return (
    <Link href="/" className={`${styles.sidebar} ${styles.clickable}`}>
      {content}
    </Link>
  );
};

export default VerticalSidebar;
