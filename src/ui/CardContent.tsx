import React from 'react';
import ProjectsSection from './ProjectsSection';
import AboutButton from './AboutButton';
import styles from '../styles/CardContent.module.css';

// Feature flags
const SHOW_BLOG = true;

interface CardContentProps {
  onProjectSelect?: (projectId: string) => void;
  onAboutSelect?: () => void;
}

const CardContent: React.FC<CardContentProps> = ({ onProjectSelect, onAboutSelect }) => {
  return (
    <>
      <h1 className={styles.name}>Nathanial Fine</h1>
      <p className={styles.tagline}>Bespoke Software</p>

      {onProjectSelect && <ProjectsSection onProjectSelect={onProjectSelect} />}

      <div className={styles.bottomButtons}>
        {onAboutSelect && <AboutButton onClick={onAboutSelect} label="About & Contact" />}
        {SHOW_BLOG && <AboutButton onClick={() => window.open('/blog', '_self')} label="Blog" />}
      </div>
    </>
  );
};

export default CardContent;
