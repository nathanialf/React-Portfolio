'use client';

import Link from 'next/link';
import Image from 'next/image';
import { IconArrowLeft } from '@tabler/icons-react';
import DitherImage from './DitherImage';
import styles from '../styles/Blog.module.css';

interface BlogPostHeaderProps {
  title: string;
  date: string;
  formattedDate: string;
  coverImage?: string;
  coverImageDark?: boolean;
  tags?: string[];
}

/* Tag-Specific Styles */

// Marathon — use DitherImage for cover instead of standard Image
function hasMarathonTag(tags?: string[]): boolean {
  if (!tags) return false;
  return tags.some(tag => tag.toLowerCase() === 'marathon');
}

export default function BlogPostHeader({
  title,
  date,
  formattedDate,
  coverImage,
  coverImageDark = true,
  tags,
}: BlogPostHeaderProps) {
  const useDitherAnimation = hasMarathonTag(tags);

  if (coverImage) {
    return (
      <header className={`${styles.headerWithCover} ${coverImageDark ? styles.lightText : styles.darkText}`}>
        <div className={styles.headerBackground}>
          {useDitherAnimation ? (
            <DitherImage src={coverImage} alt="" fill sizes="(max-width: 768px) 100vw, 700px" />
          ) : (
            <Image src={coverImage} alt="" fill sizes="(max-width: 768px) 100vw, 700px" />
          )}
        </div>
        <div className={styles.headerContent}>
          <Link href="/blog" className={styles.backLink}>
            <IconArrowLeft stroke={2} width="1em" height="1em" />
            <span>All Posts</span>
          </Link>
          <h1 className={styles.title}>{title}</h1>
          <time className={styles.postDateHeader} dateTime={date}>
            {formattedDate}
          </time>
          {tags && tags.length > 0 && (
            <div className={styles.postTagsHeader}>
              {tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <Link href="/blog" className={styles.backLink}>
        <IconArrowLeft stroke={2} width="1em" height="1em" />
        <span>All Posts</span>
      </Link>
      <h1 className={styles.title}>{title}</h1>
      <time className={styles.postDateHeader} dateTime={date}>
        {formattedDate}
      </time>
      {tags && tags.length > 0 && (
        <div className={styles.postTagsHeader}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}
    </header>
  );
}
