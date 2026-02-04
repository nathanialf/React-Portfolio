'use client';

import React, { useState, useEffect } from 'react';
import ProjectDetail from './ProjectDetail';
import AboutDetail from './AboutDetail';
import VerticalSidebar from './VerticalSidebar';
import { projects } from '../data/projects';
import styles from '../styles/MainLayout.module.css';
import introStyles from '../styles/CardContent.module.css';

interface MainLayoutProps {
  onProjectChange?: (projectId: string | null) => void;
  forceDarkMode?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onProjectChange, forceDarkMode }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  const selectedProject = selectedProjectId
    ? projects.find(p => p.id === selectedProjectId)
    : null;

  // Report hovered or selected project to parent for background changes
  // On mobile, hoveredProjectId won't change (no hover), so we use selectedProjectId
  useEffect(() => {
    onProjectChange?.(hoveredProjectId || selectedProjectId);
  }, [hoveredProjectId, selectedProjectId, onProjectChange]);

  // Reset navigation state when returning via browser back button (bfcache)
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsNavigating(false);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setShowAbout(false);
  };

  const handleAboutSelect = () => {
    setShowAbout(true);
    setSelectedProjectId(null);
  };

  const handleBackToMain = () => {
    setSelectedProjectId(null);
    setShowAbout(false);
  };

  const handleNavigate = (url: string) => {
    setIsNavigating(true);
    setTimeout(() => {
      window.location.href = url;
    }, 300);
  };

  return (
    <div className={styles.card}>
      <div className={styles.sidebar}>
        <VerticalSidebar disableLink />
      </div>

      {/* Navigation - always visible */}
      <nav className={styles.nav}>
        {projects.map((project) => (
          <button
            key={project.id}
            className={`${styles.navButton} ${selectedProjectId === project.id ? styles.active : ''}`}
            onClick={() => handleProjectSelect(project.id)}
            onMouseEnter={() => setHoveredProjectId(project.id)}
            onMouseLeave={() => setHoveredProjectId(null)}
            style={{ '--project-color': project.hoverColor } as React.CSSProperties}
          >
            <span className={styles.navButtonName}>{project.name}</span>
            <span className={styles.navButtonTagline}>{project.tagline}</span>
          </button>
        ))}
        <button
          className={`${styles.aboutButton} ${showAbout ? styles.active : ''}`}
          onClick={handleAboutSelect}
        >
          About & Contact
        </button>
      </nav>

      {/* Main content area */}
      <div className={styles.main}>
        <div className={`${styles.content} ${isNavigating ? styles.contentFading : ''}`}>
          {selectedProject ? (
            <div key={`project-${selectedProject.id}`} className={styles.projectView}>
              <ProjectDetail
                project={selectedProject}
                onBack={handleBackToMain}
                forceDarkMode={forceDarkMode}
                onNavigate={handleNavigate}
                backButtonClass={styles.backButton}
              />
            </div>
          ) : showAbout ? (
            <div key="about" className={styles.projectView}>
              <AboutDetail onBack={handleBackToMain} backButtonClass={styles.backButton} />
            </div>
          ) : (
            <div key="main" className={styles.mainView}>
              <h1 className={introStyles.name}>Nathanial Fine</h1>
              <p className={introStyles.tagline}>Bespoke Software</p>

              {/* Mobile navigation - hidden on desktop via CSS */}
              <div className={styles.mobileNav}>
                {projects.map((project) => (
                  <button
                    key={project.id}
                    className={styles.mobileNavButton}
                    onClick={() => handleProjectSelect(project.id)}
                    style={{ '--project-color': project.hoverColor } as React.CSSProperties}
                  >
                    <span className={styles.navButtonName}>{project.name}</span>
                    <span className={styles.navButtonTagline}>{project.tagline}</span>
                  </button>
                ))}
                <button
                  className={styles.mobileAboutButton}
                  onClick={handleAboutSelect}
                >
                  About & Contact
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
