import React from 'react';
import { projects, categoryLabels, ProjectCategory } from '../data/projects';
import ProjectGalleryCard from './ProjectGalleryCard';
import styles from '../styles/ProjectsSection.module.css';

interface ProjectsSectionProps {
  onProjectSelect: (projectId: string) => void;
}

const categoryOrder: ProjectCategory[] = ['saas', 'apps', 'games'];

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onProjectSelect }) => {
  const groupedProjects = categoryOrder.map(category => ({
    category,
    label: categoryLabels[category],
    items: projects.filter(p => p.category === category),
  }));

  return (
    <div className={styles.categoriesContainer}>
      {groupedProjects.map(({ category, label, items }) => (
        <div key={category} className={styles.categoryGroup}>
          <div className={styles.bracketContainer}>
            <div className={styles.bracket}>
              <span className={styles.categoryLabel}>{label}</span>
            </div>
          </div>
          <div className={styles.gallery}>
            {items.map((project) => (
              <ProjectGalleryCard
                key={project.id}
                project={project}
                onClick={() => onProjectSelect(project.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsSection;
