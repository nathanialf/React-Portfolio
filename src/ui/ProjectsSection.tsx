import React from 'react';
import { projects } from '../data/projects';
import ProjectGalleryCard from './ProjectGalleryCard';
import styles from '../styles/ProjectsSection.module.css';

interface ProjectsSectionProps {
  onProjectSelect: (projectId: string) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onProjectSelect }) => {
  return (
    <div className={styles.gallery}>
      {projects.map((project) => (
        <ProjectGalleryCard
          key={project.id}
          project={project}
          onClick={() => onProjectSelect(project.id)}
        />
      ))}
    </div>
  );
};

export default ProjectsSection;