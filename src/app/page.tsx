'use client';

import { useState } from 'react';
import Image from 'next/image';
import Copyright from '../ui/Copyright';
import MainLayout from '../ui/MainLayout';
import { projects } from '../data/projects';

import styles from '../styles/Homepage.module.css';

const isDev = process.env.NODE_ENV === 'development';
const visibleProjects = projects.filter(p => isDev || !p.hidden);
const projectsWithBackgrounds = visibleProjects.filter(p => p.backgroundImage);

export default function Homepage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = selectedProjectId
    ? visibleProjects.find(p => p.id === selectedProjectId)
    : null;

  const activeBackground = selectedProject?.backgroundImage;

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

      <MainLayout onProjectChange={setSelectedProjectId} brightBackground={selectedProject?.brightBackground} />
      <Copyright fixed />
    </>
  );
}
