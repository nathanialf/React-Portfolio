import React from 'react';
import { Project, ProjectSection } from '../data/projects';
import { IconArrowLeft, IconExternalLink, IconBrandGithub, IconBrandGooglePlay, IconShield, IconHexagon, IconWall, IconPlane } from '@tabler/icons-react';
import styles from '../styles/ProjectDetail.module.css';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  brightBackground?: boolean;
  onNavigate?: (url: string) => void;
  backButtonClass?: string;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, brightBackground, onNavigate, backButtonClass }) => {
  const brightTextStyle = brightBackground ? { color: '#a3a3a3' } : undefined;

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'github':
        return <IconBrandGithub stroke={2} width="1em" height="1em" />;
      case 'playstore':
        return <IconBrandGooglePlay stroke={2} width="1em" height="1em" />;
      case 'privacy':
        return <IconShield stroke={2} width="1em" height="1em" />;
      case 'dungeon':
        return <IconWall stroke={2} width="1em" height="1em" />;
      case 'hexagon-site':
        return <IconHexagon stroke={2} width="1em" height="1em" />;
      case 'plane':
        return <IconPlane stroke={2} width="1em" height="1em" />;
      default:
        return <IconExternalLink stroke={2} width="1em" height="1em" />;
    }
  };

  const renderSection = (section: ProjectSection, index: number) => (
    <div key={index} className={styles.section}>
      <h3 className={styles.sectionHeading}>
        {section.heading}
      </h3>
      {Array.isArray(section.content) ? (
        <ul className={styles.sectionList}>
          {section.content.map((item, i) => (
            <li key={i} className={styles.sectionListItem} style={brightTextStyle}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.sectionText} style={brightTextStyle}>
          {section.content}
        </p>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <button
        className={`${styles.backButton} ${backButtonClass || ''}`}
        onClick={onBack}
      >
        <IconArrowLeft stroke={2} width="1.2em" height="1.2em" />
        <span>Back to Home</span>
      </button>

      <div className={styles.header}>
        <h2 className={styles.title}>{project.name}</h2>
        <p className={styles.description}>{project.description}</p>
      </div>

      {project.sections && project.sections.length > 0 && (
        <div className={styles.sections}>
          {project.sections.map((section, index) => renderSection(section, index))}
        </div>
      )}

      <div className={styles.links}>
        <h3 className={styles.linksTitle}>Links</h3>
        <div className={styles.linkGrid}>
          {project.links.map((link, index) => (
            link.disabled ? (
              <span
                key={index}
                className={`${styles.link} ${styles.disabled}`}
              >
                {getLinkIcon(link.type)}
                <span>{link.label}</span>
              </span>
            ) : link.type === 'privacy' && onNavigate ? (
              <a
                key={index}
                href={link.url}
                className={styles.link}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(link.url);
                }}
              >
                {getLinkIcon(link.type)}
                <span>{link.label}</span>
              </a>
            ) : (
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
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;