import React from 'react';
import { Project } from '../data/projects';
import { IconArrowLeft, IconExternalLink, IconBrandGithub, IconBrandGooglePlay, IconShield } from '@tabler/icons-react';
import styles from '../styles/ProjectDetail.module.css';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'github':
        return <IconBrandGithub stroke={2} width="1em" height="1em" />;
      case 'playstore':
        return <IconBrandGooglePlay stroke={2} width="1em" height="1em" />;
      case 'privacy':
        return <IconShield stroke={2} width="1em" height="1em" />;
      default:
        return <IconExternalLink stroke={2} width="1em" height="1em" />;
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onBack}>
        <IconArrowLeft stroke={2} width="1.2em" height="1.2em" />
        <span>Back to Home</span>
      </button>
      
      <div className={styles.header}>
        <h2 className={styles.title}>{project.name}</h2>
        <p className={styles.description}>{project.description}</p>
      </div>
      
      <div className={styles.links}>
        <h3 className={styles.linksTitle}>Links</h3>
        <div className={styles.linkGrid}>
          {project.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className={styles.link}
              target={link.type === 'privacy' ? '_self' : '_blank'}
              rel={link.type === 'privacy' ? '' : 'noopener noreferrer'}
            >
              {getLinkIcon(link.type)}
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;