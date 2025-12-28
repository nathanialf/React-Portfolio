'use client';

import React, { useEffect, useState, useRef } from 'react';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

// Module-level cache to persist across re-mounts
let cachedContributions: ContributionDay[] | null = null;

const ContributionGraph: React.FC = () => {
  const [contributions, setContributions] = useState<ContributionDay[]>(cachedContributions || []);
  const [isDark, setIsDark] = useState(false);
  const [dotSize, setDotSize] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only fetch if not already cached
    if (!cachedContributions) {
      fetch('/api/contributions?username=nathanialf')
        .then(res => res.json())
        .then(data => {
          const contributions = data.contributions || [];
          cachedContributions = contributions;
          setContributions(contributions);
        })
        .catch(() => setContributions([]));
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const calculateDotSize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const numWeeks = 53;
      const columnsPerWeek = 2;
      const totalColumns = numWeeks * columnsPerWeek;
      const gapSize = 2;
      const totalGaps = totalColumns - 1 + (numWeeks - 1);
      const availableForDots = containerWidth - (totalGaps * gapSize);
      const calculatedSize = Math.floor(availableForDots / totalColumns);
      setDotSize(Math.max(2, Math.min(calculatedSize, 6)));
    };

    calculateDotSize();
    window.addEventListener('resize', calculateDotSize);
    return () => window.removeEventListener('resize', calculateDotSize);
  }, [contributions]);

  const days = contributions.slice(-365);
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
    const opacity = [0, 0.4, 0.6, 0.8, 1][level] || 0;
    return isDark ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`;
  };

  const gap = 2;
  const offset = (dotSize + gap) / 2;

  return (
    <div
      ref={containerRef}
      style={{ display: 'flex', gap: `${gap}px`, width: '100%', marginTop: '2em', justifyContent: 'flex-end', overflow: 'hidden' }}
    >
      {weeks.map((week, wi) => (
        <div key={wi} style={{ display: 'flex', gap: `${gap}px` }}>
          {/* Column 1: Sun, Tue, Thu, Sat (indices 0, 2, 4, 6) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
            {[0, 2, 4, 6].map((di) => (
              <div
                key={di}
                style={{
                  width: `${dotSize}px`,
                  height: `${dotSize}px`,
                  borderRadius: '50%',
                  backgroundColor: getColor(week[di]?.level),
                }}
              />
            ))}
          </div>
          {/* Column 2: Mon, Wed, Fri (indices 1, 3, 5) - offset */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px`, marginTop: `${offset}px` }}>
            {[1, 3, 5].map((di) => (
              <div
                key={di}
                style={{
                  width: `${dotSize}px`,
                  height: `${dotSize}px`,
                  borderRadius: '50%',
                  backgroundColor: getColor(week[di]?.level),
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContributionGraph;
