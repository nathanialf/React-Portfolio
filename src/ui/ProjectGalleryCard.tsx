import React from 'react';
import { Project } from '../data/projects';
import styles from '../styles/ProjectGalleryCard.module.css';

interface ProjectGalleryCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectGalleryCard: React.FC<ProjectGalleryCardProps> = ({ project, onClick }) => {
  return (
    <button
      className={styles.card}
      onClick={onClick}
      style={{ '--project-color': project.hoverColor } as React.CSSProperties}
      aria-label={`View ${project.name} project`}
    >
      <span className={styles.name}>{project.name}</span>
      <span className={styles.tagline}>{project.tagline}</span>
    </button>
  );
};

export default ProjectGalleryCard;
