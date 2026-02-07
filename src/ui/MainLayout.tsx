'use client';

import React, { useState, useEffect } from 'react';
import ProjectDetail from './ProjectDetail';
import AboutDetail from './AboutDetail';
import VerticalSidebar from './VerticalSidebar';
import { projects, categoryLabels, ProjectCategory } from '../data/projects';
import styles from '../styles/MainLayout.module.css';
import introStyles from '../styles/CardContent.module.css';

const categoryOrder: ProjectCategory[] = ['saas', 'apps', 'games'];
const isDev = process.env.NODE_ENV === 'development';
const visibleProjects = projects.filter(p => isDev || !p.hidden);

interface MainLayoutProps {
  onProjectChange?: (projectId: string | null) => void;
  brightBackground?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onProjectChange, brightBackground }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const selectedProject = selectedProjectId
    ? projects.find(p => p.id === selectedProjectId)
    : null;

  // Report selected project to parent for background changes (no hover)
  useEffect(() => {
    onProjectChange?.(selectedProjectId);
  }, [selectedProjectId, onProjectChange]);

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
        {categoryOrder.map((category) => {
          const categoryProjects = visibleProjects.filter(p => p.category === category);
          return (
            <div key={category} className={styles.categoryGroup}>
              <div className={styles.categoryButtons}>
                {categoryProjects.map((project) => (
                  <button
                    key={project.id}
                    className={`${styles.navButton} ${selectedProjectId === project.id ? styles.active : ''}`}
                    onClick={() => handleProjectSelect(project.id)}
                    style={{ '--project-color': project.hoverColor } as React.CSSProperties}
                  >
                    <span className={styles.navButtonName}>{project.name}</span>
                    <span className={styles.navButtonTagline}>{project.tagline}</span>
                  </button>
                ))}
              </div>
              <div className={styles.bracket}>
                <div className={styles.categoryLabel}>
                  <span>{categoryLabels[category]}</span>
                </div>
              </div>
            </div>
          );
        })}
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
                brightBackground={brightBackground}
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
                {categoryOrder.map((category) => {
                  const categoryProjects = visibleProjects.filter(p => p.category === category);
                  return (
                    <div key={category} className={styles.mobileCategoryGroup}>
                      <div className={styles.mobileBracket}>
                        <div className={styles.mobileCategoryLabel}>
                          <span>{categoryLabels[category]}</span>
                        </div>
                      </div>
                      <div className={styles.mobileCategoryButtons}>
                        {categoryProjects.map((project) => (
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
                      </div>
                    </div>
                  );
                })}
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
