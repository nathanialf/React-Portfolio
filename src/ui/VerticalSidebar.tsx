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

let cachedContributions: ContributionDay[] | null = null;

const VerticalSidebar: React.FC<VerticalSidebarProps> = ({ disableLink }) => {
  const [contributions, setContributions] = useState<ContributionDay[]>(cachedContributions || []);

  useEffect(() => {
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

  const gap = 2;
  const dotSize = 3;
  const offset = (dotSize + gap) / 2;

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
      <div className={styles.graph}>
        {weeks.map((week, wi) => (
          <div key={wi} className={styles.week}>
            {/* Row 1: Sun, Tue, Thu, Sat (indices 0, 2, 4, 6) */}
            <div className={styles.column}>
              {[0, 2, 4, 6].map((di) => (
                <div
                  key={di}
                  className={styles.dot}
                  style={{ backgroundColor: getColor(week[di]?.level) }}
                />
              ))}
            </div>
            {/* Row 2: Mon, Wed, Fri (indices 1, 3, 5) - offset */}
            <div className={styles.column} style={{ marginLeft: `${offset}px` }}>
              {[1, 3, 5].map((di) => (
                <div
                  key={di}
                  className={styles.dot}
                  style={{ backgroundColor: getColor(week[di]?.level) }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
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
