'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import Copyright from '../ui/Copyright';
import MainLayout from '../ui/MainLayout';
import { projects } from '../data/projects';

import styles from '../styles/Homepage.module.css';

const isDev = process.env.NODE_ENV === 'development';
const visibleProjects = projects.filter(p => isDev || (!p.hidden && !p.cancelled));
const allBackgroundSources = Array.from(
  new Set(
    visibleProjects.flatMap(p => {
      const bg = p.backgroundImage;
      if (!bg) return [];
      return Array.isArray(bg) ? bg : [bg];
    }),
  ),
);

const pickBackground = (bg: string | string[] | undefined): string | undefined => {
  if (!bg) return undefined;
  if (typeof bg === 'string') return bg;
  return bg[Math.floor(Math.random() * bg.length)];
};

export default function Homepage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeBackground, setActiveBackground] = useState<string | undefined>(undefined);

  const selectedProject = selectedProjectId
    ? visibleProjects.find(p => p.id === selectedProjectId)
    : null;

  const handleProjectChange = useCallback((projectId: string | null) => {
    setSelectedProjectId(projectId);
    if (!projectId) {
      setActiveBackground(undefined);
      return;
    }
    const project = visibleProjects.find(p => p.id === projectId);
    setActiveBackground(pickBackground(project?.backgroundImage));
  }, []);

  return (
    <>
      {/* Default background */}
      <div className={`${styles.defaultBackground} ${activeBackground ? styles.hidden : ''}`}>
        <Image
          src='/images/darkmode/background.jpg'
          alt='Background Photograph'
          quality={100}
          fill
          sizes='100vw'
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* Preload all project backgrounds */}
      {allBackgroundSources.map(src => (
        <div
          key={src}
          className={`${styles.projectBackground} ${activeBackground === src ? styles.visible : styles.hidden}`}
        >
          <Image
            src={src}
            alt='Project Background'
            quality={100}
            fill
            sizes='100vw'
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      ))}

      <MainLayout onProjectChange={handleProjectChange} brightBackground={selectedProject?.brightBackground} />
      <Copyright fixed />
    </>
  );
}
