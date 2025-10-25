import React from 'react';
import { projects } from '../data/projects';
import ProjectBadge from './ProjectBadge';
import styles from '../styles/ProjectsSection.module.css';

interface ProjectsSectionProps {
  onProjectSelect: (projectId: string) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onProjectSelect }) => {
  return (
    <div className={styles.section}>
      <div className={styles.title}>Projects</div>
      <div className={styles.badges}>
        {projects.map((project) => (
          <ProjectBadge
            key={project.id}
            project={project}
            onClick={() => onProjectSelect(project.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;