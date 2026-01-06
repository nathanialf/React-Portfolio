import React from 'react';
import ProjectsSection from './ProjectsSection';
import AboutButton from './AboutButton';
import styles from '../styles/CardContent.module.css';

// Feature flags
const SHOW_BLOG = true;

interface CardContentProps {
  onProjectSelect?: (projectId: string) => void;
  onAboutSelect?: () => void;
  onNavigate?: (url: string) => void;
}

const CardContent: React.FC<CardContentProps> = ({ onProjectSelect, onAboutSelect, onNavigate }) => {
  return (
    <>
      <h1 className={styles.name}>Nathanial Fine</h1>
      <p className={styles.tagline}>Bespoke Software</p>

      {onProjectSelect && <ProjectsSection onProjectSelect={onProjectSelect} />}

      <div className={styles.bottomButtons}>
        {onAboutSelect && <AboutButton onClick={onAboutSelect} label="About & Contact" />}
        {SHOW_BLOG && <AboutButton onClick={() => onNavigate?.('/blog')} label="Blog" />}
      </div>
    </>
  );
};

export default CardContent;
