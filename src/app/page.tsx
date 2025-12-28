'use client';

import { useState } from 'react';
import Image from 'next/image';
import Copyright from '../ui/Copyright';
import FloatingCard from '../ui/FloatingCard';
import { projects } from '../data/projects';

import styles from '../styles/Homepage.module.css';

const projectsWithBackgrounds = projects.filter(p => p.backgroundImage);

export default function Homepage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = selectedProjectId
    ? projects.find(p => p.id === selectedProjectId)
    : null;

  const activeBackground = selectedProject?.backgroundImage;

  return (
    <>
      {/* Default background */}
      <picture className={`${styles.defaultBackground} ${activeBackground ? styles.hidden : ''}`}>
        <source
          srcSet='/images/darkmode/background.jpg'
          media='(prefers-color-scheme: dark)'
        />
        <Image
          src='/images/lightmode/background.jpg'
          alt='Background Photograph'
          quality={100}
          fill
          sizes='100vw'
          style={{ objectFit: 'cover' }}
          priority
        />
      </picture>

      {/* Preload all project backgrounds */}
      {projectsWithBackgrounds.map(project => (
        <div
          key={project.id}
          className={`${styles.projectBackground} ${activeBackground === project.backgroundImage ? styles.visible : styles.hidden
            }`}
        >
          <Image
            src={project.backgroundImage!}
            alt={`${project.name} Background`}
            quality={100}
            fill
            sizes='100vw'
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      ))}

      <FloatingCard onProjectChange={setSelectedProjectId} forceDarkMode={selectedProject?.darkBackground} />
      <Copyright />
    </>
  );
}
