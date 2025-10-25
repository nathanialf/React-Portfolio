import React from 'react';
import Image from 'next/image';
import { IconHexagon } from '@tabler/icons-react';
import { Project } from '../data/projects';
import styles from '../styles/ProjectBadge.module.css';

interface ProjectBadgeProps {
  project: Project;
  onClick: () => void;
}

const ProjectBadge: React.FC<ProjectBadgeProps> = ({ project, onClick }) => {
  const renderIcon = () => {
    switch (project.icon.type) {
      case 'tabler':
        if (project.icon.content === 'hexagon') {
          return <IconHexagon stroke={2.5} size={24} className={styles.tablerIcon} />;
        }
        return null;
      case 'svg':
        return (
          <Image
            src={project.icon.content || ''}
            alt={`${project.name} icon`}
            width={28}
            height={28}
            className={styles.svgIcon}
          />
        );
      case 'placeholder':
        return (
          <span className={styles.placeholderText}>
            {project.icon.content}
          </span>
        );
      default:
        return (
          <span className={styles.placeholderText}>
            {project.name.charAt(0)}
          </span>
        );
    }
  };

  return (
    <div
      className={styles.badge}
      onClick={onClick}
      title={project.name}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className={styles.icon}>
        {renderIcon()}
      </div>
      <span className={styles.name}>{project.name}</span>
    </div>
  );
};

export default ProjectBadge;