import React from 'react';
import Image from 'next/image';
import { IconArrowLeft, IconMail, IconBrandLinkedin } from '@tabler/icons-react';
import styles from '../styles/AboutDetail.module.css';

interface AboutDetailProps {
  onBack: () => void;
  backButtonClass?: string;
}

const AboutDetail: React.FC<AboutDetailProps> = ({ onBack, backButtonClass }) => {
  return (
    <div className={styles.container}>
      <button className={`${styles.backButton} ${backButtonClass || ''}`} onClick={onBack}>
        <IconArrowLeft size={16} />
        <span>Back to Home</span>
      </button>

      <div className={styles.section}>
        <h2 className={styles.heading}>Who I Am</h2>
        <p className={styles.text}>
          I&apos;m Nathan. I spent 5 years at Amazon, 3 of them in AWS GameTech working on
          backend infrastructure for games. Before that I was at Apple. I&apos;ve built
          systems that scale and stay up.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.heading}>How I Help</h2>
        <p className={styles.text}>
          If you have a problem that needs custom software to solve, let&apos;s figure out
          what you actually need and build it together. Backend APIs, full-stack apps,
          infrastructure. You&apos;ll get production-ready code and I&apos;ll make sure you
          understand how it all works.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.heading}>Previously</h2>
        <div className={styles.experience}>
          <div className={styles.company}>
            <Image src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className={styles.companyLogo} width={60} height={18} unoptimized />
            <span className={styles.years}>2023–2025</span>
          </div>
          <div className={styles.company}>
            <Image src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" className={styles.companyLogo} width={60} height={18} unoptimized />
            <span className={styles.years}>2020–2023</span>
          </div>
          <div className={styles.company}>
            <Image src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className={styles.companyLogo} width={18} height={18} unoptimized />
            <span className={styles.years}>2018–2020</span>
          </div>
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
