'use client';

import React, { useState, useRef, useEffect } from 'react';
import CardContent from './CardContent';
import ProjectDetail from './ProjectDetail';
import AboutDetail from './AboutDetail';
import VerticalSidebar from './VerticalSidebar';
import { projects } from '../data/projects';
import styles from '../styles/FloatingCard.module.css';

interface FloatingCardProps {
  onProjectChange?: (projectId: string | null) => void;
  forceDarkMode?: boolean;
}

const FloatingCard: React.FC<FloatingCardProps> = ({ onProjectChange, forceDarkMode }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [isReturningFromDetail, setIsReturningFromDetail] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);
  const [cardPosition, setCardPosition] = useState<{ top: number; left: number; width: number } | undefined>(undefined);
  const [enableTransition, setEnableTransition] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mainViewRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);
  const [mainViewHeight, setMainViewHeight] = useState<number | undefined>(undefined);

  const selectedProject = selectedProjectId
    ? projects.find(p => p.id === selectedProjectId)
    : null;

  const isDetailView = selectedProjectId || showAbout;

  useEffect(() => {
    if (isDetailView && contentRef.current) {
      const height = contentRef.current.scrollHeight;
      // On mobile, cap the content height to allow scrolling instead of growing beyond viewport
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        setContentHeight(Math.min(height, window.innerHeight - 35));
      } else {
        setContentHeight(height);
      }
    }
  }, [selectedProjectId, selectedProject, showAbout, isDetailView]);

  useEffect(() => {
    onProjectChange?.(selectedProjectId);
  }, [selectedProjectId, onProjectChange]);

  // Reset navigation state when returning via browser back button (bfcache)
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsNavigating(false);
        setCardHeight(undefined);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const handleProjectSelect = (projectId: string) => {
    if (mainViewRef.current) {
      const currentHeight = mainViewRef.current.scrollHeight;
      setMainViewHeight(currentHeight);
      setContentHeight(currentHeight);
    }
    setSelectedProjectId(projectId);
    setShowAbout(false);
    setIsReturningFromDetail(false);
  };

  const handleAboutSelect = () => {
    if (mainViewRef.current) {
      const currentHeight = mainViewRef.current.scrollHeight;
      setMainViewHeight(currentHeight);
      setContentHeight(currentHeight);
    }
    setShowAbout(true);
    setSelectedProjectId(null);
    setIsReturningFromDetail(false);
  };

  const handleBackToMain = () => {
    if (mainViewHeight) {
      setContentHeight(mainViewHeight);
    }
    setSelectedProjectId(null);
    setShowAbout(false);
    setIsReturningFromDetail(true);
    setAnimationKey(k => k + 1);
    setTimeout(() => setContentHeight(undefined), 400);
  };

  const handleNavigate = (url: string) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const currentHeight = rect.height;
      const currentWidth = rect.width;
      // Set current position and size in pixels first (no transition)
      setCardPosition({ top: rect.top, left: rect.left, width: currentWidth });
      setCardHeight(currentHeight);
      setEnableTransition(false);
      // Double rAF to ensure first position is rendered without transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Enable transition, then animate to target
          setEnableTransition(true);
          requestAnimationFrame(() => {
            const targetHeight = Math.max(window.innerHeight, currentHeight);
            setCardPosition({ top: 0, left: 0, width: window.innerWidth });
            setCardHeight(targetHeight);
            setIsNavigating(true);
          setTimeout(() => {
              window.location.href = url;
            }, 600);
          });
        });
      });
    } else {
      setIsNavigating(true);
      setTimeout(() => {
        window.location.href = url;
      }, 600);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${cardPosition !== undefined ? (enableTransition ? styles.cardAnimatingWithTransition : styles.cardAnimating) : ''} ${isNavigating ? styles.cardNavigating : ''}`}
      style={{
        ...(cardHeight ? { height: `${cardHeight}px` } : {}),
        ...(cardPosition !== undefined ? { top: `${cardPosition.top}px`, left: `${cardPosition.left}px`, width: `${cardPosition.width}px` } : {}),
      }}
    >
      <VerticalSidebar disableLink />
      <div className={styles.main}>
        <div
          className={`${styles.content} ${isDetailView ? styles.projectView : ''} ${isNavigating ? styles.contentFading : ''}`}
          style={{ height: contentHeight ? `${contentHeight}px` : 'auto' }}
        >
          <div ref={contentRef}>
            {selectedProject ? (
              <ProjectDetail
                project={selectedProject}
                onBack={handleBackToMain}
                forceDarkMode={forceDarkMode}
                onNavigate={handleNavigate}
              />
            ) : showAbout ? (
              <AboutDetail onBack={handleBackToMain} />
            ) : (
              <div ref={mainViewRef} key={animationKey} className={isReturningFromDetail ? styles.mainView : ''}>
                <CardContent onProjectSelect={handleProjectSelect} onAboutSelect={handleAboutSelect} onNavigate={handleNavigate} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingCard;
