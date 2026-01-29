'use client';

import ScrambleText from './ScrambleText';
import styles from '../styles/Blog.module.css';

export default function BlogHeader() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <ScrambleText duration={600}>Blog</ScrambleText>
      </h1>
      <p className={styles.subtitle}>
        <ScrambleText delay={100} duration={500}>Thoughts on software</ScrambleText>
      </p>
    </header>
  );
}
