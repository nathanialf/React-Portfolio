'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ToolPageLayout from '../../ui/ToolPageLayout';
import styles from '../../styles/Midi.module.css';

const SaxophoneViewer = dynamic(() => import('../../ui/SaxophoneViewer'), {
  ssr: false,
});

export default function MidiPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleShowTooltip = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    setShowTooltip(true);
  };

  const handleHideTooltip = () => {
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  return (
    <ToolPageLayout
      title="MIDI"
      subtitle="Tenor Saxophone"
      containerClassName={styles.container}
      fixedFooter
    >
      <div className={styles.viewerContainer}>
        <SaxophoneViewer onLoad={() => setTimeout(() => setIsLoaded(true), 100)} />
        {isLoaded && (
          <>
            <div
              className={styles.info}
              onMouseEnter={handleShowTooltip}
              onMouseLeave={handleHideTooltip}
            >
              i
            </div>
            <div
              className={`${styles.infoTooltip} ${showTooltip ? styles.infoTooltipShow : ''}`}
              onMouseEnter={handleShowTooltip}
              onMouseLeave={handleHideTooltip}
            >
              Inspiration: <a href="https://open.spotify.com/track/48cyBWVdq8n5sZ6G8qghOJ?si=976f6881db9f40b6" target="_blank" rel="noopener noreferrer">Moonlight Rendez-vous by Justice</a><br />
              Model: <a href="https://www.turbosquid.com/3d-models/saxophone-580399" target="_blank" rel="noopener noreferrer">TurboSquid</a>
            </div>
          </>
        )}
      </div>
      <p className={styles.instructions}>
        Drag to rotate. Click keys to play. Connect MIDI controller for full experience.
      </p>
    </ToolPageLayout>
  );
}
