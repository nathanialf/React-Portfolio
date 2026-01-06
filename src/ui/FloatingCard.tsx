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
      setContentHeight(height);
    }
  }, [selectedProjectId, selectedProject, showAbout, isDetailView]);

  useEffect(() => {
    onProjectChange?.(selectedProjectId);
  }, [selectedProjectId, onProjectChange]);

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

  return (
    <div className={styles.card}>
      <VerticalSidebar disableLink />
      <div className={styles.main}>
        <div
          className={`${styles.content} ${isDetailView ? styles.projectView : ''}`}
          style={{ height: contentHeight ? `${contentHeight}px` : 'auto' }}
        >
          <div ref={contentRef}>
            {selectedProject ? (
              <ProjectDetail
                project={selectedProject}
                onBack={handleBackToMain}
                forceDarkMode={forceDarkMode}
              />
            ) : showAbout ? (
              <AboutDetail onBack={handleBackToMain} />
            ) : (
              <div ref={mainViewRef} key={animationKey} className={isReturningFromDetail ? styles.mainView : ''}>
                <CardContent onProjectSelect={handleProjectSelect} onAboutSelect={handleAboutSelect} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingCard;
