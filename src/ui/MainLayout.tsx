'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProjectDetail from './ProjectDetail';
import AboutDetail from './AboutDetail';
import VerticalSidebar from './VerticalSidebar';
import { projects, categoryLabels, ProjectCategory } from '../data/projects';
import { IconLock, IconArrowLeft, IconQrcode, IconMusic, IconMarkdown } from '@tabler/icons-react';
import styles from '../styles/MainLayout.module.css';
import introStyles from '../styles/CardContent.module.css';
import aboutStyles from '../styles/AboutDetail.module.css';
import projectStyles from '../styles/ProjectDetail.module.css';

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
  const [showTools, setShowTools] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navOverflows, setNavOverflows] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const checkNavOverflow = useCallback(() => {
    const el = navRef.current;
    if (el) setNavOverflows(el.scrollHeight > el.clientHeight);
  }, []);

  useEffect(() => {
    checkNavOverflow();
    window.addEventListener('resize', checkNavOverflow);
    return () => window.removeEventListener('resize', checkNavOverflow);
  }, [checkNavOverflow]);

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

  const scrollContentToTop = () => {
    contentRef.current?.scrollTo(0, 0);
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setShowAbout(false);
    setShowTools(false);
    scrollContentToTop();
  };

  const handleAboutSelect = () => {
    setShowAbout(true);
    setShowTools(false);
    setSelectedProjectId(null);
    scrollContentToTop();
  };

  const handleToolsSelect = () => {
    setShowTools(true);
    setShowAbout(false);
    setSelectedProjectId(null);
    scrollContentToTop();
  };

  const handleBackToMain = () => {
    setSelectedProjectId(null);
    setShowAbout(false);
    setShowTools(false);
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
      <nav ref={navRef} className={`${styles.nav} ${navOverflows ? styles.navOverflowing : ''}`}>
        {categoryOrder.map((category) => {
          const categoryProjects = visibleProjects.filter(p => p.category === category);
          return (
            <div key={category} className={styles.categoryGroup}>
              <div className={styles.categoryButtons}>
                {categoryProjects.map((project) => (
                  <button
                    key={project.id}
                    className={`${styles.navButton} ${selectedProjectId === project.id ? styles.active : ''} ${project.hidden ? styles.hiddenProject : ''}`}
                    onClick={() => handleProjectSelect(project.id)}
                    style={{ '--project-color': project.hoverColor } as React.CSSProperties}
                  >
                    {project.hidden && <IconLock className={styles.navLockIcon} stroke={1.5} />}
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
        {isDev && (
          <button
            className={`${styles.aboutButton} ${styles.blogButton} ${styles.hiddenProject}`}
            onClick={() => handleNavigate('/blog')}
          >
            <IconLock className={styles.navLockIcon} stroke={1.5} />
            Blog
          </button>
        )}
        {isDev && (
          <button
            className={`${styles.aboutButton} ${styles.blogButton} ${styles.hiddenProject} ${showTools ? styles.active : ''}`}
            onClick={handleToolsSelect}
          >
            <IconLock className={styles.navLockIcon} stroke={1.5} />
            Tools
          </button>
        )}
      </nav>

      {/* Main content area */}
      <div className={styles.main}>
        {(selectedProject || showAbout || showTools) && (
          <button className={styles.mobileBackButton} onClick={handleBackToMain}>
            <IconArrowLeft stroke={2} width="1.2em" height="1.2em" />
            <span>Back to Home</span>
          </button>
        )}
        <div ref={contentRef} className={`${styles.content} ${isNavigating ? styles.contentFading : ''}`}>
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
          ) : showTools ? (
            <div key="tools" className={styles.projectView}>
              <div className={aboutStyles.container}>
                <button className={`${aboutStyles.backButton} ${styles.backButton}`} onClick={handleBackToMain}>
                  <IconArrowLeft size={16} />
                  <span>Back to Home</span>
                </button>
                <div className={projectStyles.links}>
                  <h3 className={projectStyles.linksTitle}>Tools</h3>
                  <div className={projectStyles.linkGrid}>
                    <a href="/qr" className={projectStyles.link}>
                      <IconQrcode stroke={2} width="1em" height="1em" />
                      <span>QR Code Generator</span>
                    </a>
                    <a href="/midi" className={projectStyles.link}>
                      <IconMusic stroke={2} width="1em" height="1em" />
                      <span>MIDI Saxophone</span>
                    </a>
                    <a href="/markdown" className={projectStyles.link}>
                      <IconMarkdown stroke={2} width="1em" height="1em" />
                      <span>Markdown Editor</span>
                    </a>
                  </div>
                </div>
              </div>
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
                            className={`${styles.mobileNavButton} ${project.hidden ? styles.hiddenProject : ''}`}
                            onClick={() => handleProjectSelect(project.id)}
                            style={{ '--project-color': project.hoverColor } as React.CSSProperties}
                          >
                            {project.hidden && <IconLock className={styles.navLockIcon} stroke={1.5} />}
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
                {isDev && (
                  <button
                    className={`${styles.mobileAboutButton} ${styles.mobileBlogButton} ${styles.hiddenProject}`}
                    onClick={() => handleNavigate('/blog')}
                  >
                    <IconLock className={styles.navLockIcon} stroke={1.5} />
                    Blog
                  </button>
                )}
                {isDev && (
                  <button
                    className={`${styles.mobileAboutButton} ${styles.mobileBlogButton} ${styles.hiddenProject}`}
                    onClick={handleToolsSelect}
                  >
                    <IconLock className={styles.navLockIcon} stroke={1.5} />
                    Tools
                  </button>
                )}
                <div className={styles.mobileNavCopyright}>
                  &copy; {new Date().getFullYear()} Nathanial Fine
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
