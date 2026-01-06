import React from 'react';
import { IconArrowLeft, IconMail, IconBrandLinkedin } from '@tabler/icons-react';
import styles from '../styles/AboutDetail.module.css';

interface AboutDetailProps {
  onBack: () => void;
}

const AboutDetail: React.FC<AboutDetailProps> = ({ onBack }) => {
  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onBack}>
        <IconArrowLeft size={16} />
        <span>Back to Home</span>
      </button>

      <div className={styles.section}>
        <h2 className={styles.heading}>Who I Am</h2>
        <p className={styles.text}>
          I&apos;m a software engineer. I&apos;ve spent years building infrastructure at
          Apple, AWS, and Amazon. I know what makes systems reliable and actually useful.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.heading}>How I Help</h2>
        <p className={styles.text}>
          I build software for people who need something that doesn&apos;t exist yet.
          If you have a problem and need a tool to solve it, I can help you make it real.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.heading}>Previously</h2>
        <div className={styles.experience}>
          <div className={styles.company}>Amazon.com <span className={styles.years}>2023–2025</span></div>
          <div className={styles.company}>AWS <span className={styles.years}>2020–2023</span></div>
          <div className={styles.company}>Apple <span className={styles.years}>2018–2020</span></div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.heading}>Contact</h2>
        <div className={styles.links}>
          <a href="mailto:nathanial+website@defnf.com" className={styles.link}>
            <IconMail size={16} />
            <span>nathanial@defnf.com</span>
          </a>
          <a href="https://www.linkedin.com/in/nathanial-fine/" className={styles.link} target="_blank" rel="noopener noreferrer">
            <IconBrandLinkedin size={16} />
            <span>nathanial-fine</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutDetail;
