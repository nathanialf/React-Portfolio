'use client';

import React, { useState, useRef, useEffect } from 'react';
import CardContent from './CardContent';
import ProjectDetail from './ProjectDetail';
import { projects } from '../data/projects';
import styles from '../styles/FloatingCard.module.css';

interface FloatingCardProps {
  onProjectChange?: (projectId: string | null) => void;
  forceDarkMode?: boolean;
}

const FloatingCard: React.FC<FloatingCardProps> = ({ onProjectChange, forceDarkMode }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isReturningFromProject, setIsReturningFromProject] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  const selectedProject = selectedProjectId 
    ? projects.find(p => p.id === selectedProjectId) 
    : null;

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
    }
  }, [selectedProjectId, selectedProject]);

  useEffect(() => {
    onProjectChange?.(selectedProjectId);
  }, [selectedProjectId, onProjectChange]);

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsReturningFromProject(false);
  };

  const handleBackToMain = () => {
    setSelectedProjectId(null);
    setIsReturningFromProject(true);
  };

  return (
    <div className={styles.card}>
      <div
        className={`${styles.content} ${selectedProjectId ? styles.projectView : ''}`}
        style={{ height: contentHeight ? `${contentHeight}px` : 'auto' }}
      >
        <div ref={contentRef}>
          {selectedProject ? (
            <ProjectDetail
              project={selectedProject}
              onBack={handleBackToMain}
              forceDarkMode={forceDarkMode}
            />
          ) : (
            <div className={isReturningFromProject ? styles.mainView : ''}>
              <CardContent onProjectSelect={handleProjectSelect} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingCard;
