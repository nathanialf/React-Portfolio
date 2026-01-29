'use client';

import ScrambleText from './ScrambleText';
import styles from '../styles/PrivacyPolicy.module.css';

export default function PrivacyPolicyHeader() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <ScrambleText duration={700}>Privacy Policies</ScrambleText>
      </h1>
      <p className={styles.subtitle}>
        <ScrambleText delay={100} duration={500}>All applications</ScrambleText>
      </p>
    </header>
  );
}
