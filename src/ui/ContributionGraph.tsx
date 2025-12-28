'use client';

import React, { useEffect, useState } from 'react';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

const ContributionGraph: React.FC = () => {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    fetch('/api/contributions?username=nathanialf')
      .then(res => res.json())
      .then(data => setContributions(data.contributions || []))
      .catch(() => setContributions([]));

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

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

  return (
    <div style={{ display: 'flex', gap: '2px', width: '100%', marginTop: '1.5em', justifyContent: 'center' }}>
      {weeks.map((week, wi) => (
        <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {week.map((day, di) => (
            <div
              key={di}
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: getColor(day?.level),
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ContributionGraph;
