'use client';

import Link from 'next/link';
import Image from 'next/image';
import ScrambleText from './ScrambleText';
import styles from '../styles/Blog.module.css';

interface PostWithFormattedDate {
  title: string;
  date: string;
  formattedDate: string;
  description: string;
  coverImage?: string;
  coverImageDark?: boolean;
  tags?: string[];
  slug: string;
}

interface BlogPostListProps {
  posts: PostWithFormattedDate[];
}

export default function BlogPostList({ posts }: BlogPostListProps) {
  if (posts.length === 0) {
    return <p className={styles.empty}>No posts yet.</p>;
  }

  return (
    <div className={styles.postList}>
      {posts.map((post, index) => {
        const hasCover = !!post.coverImage;
        const textColorClass = hasCover
          ? (post.coverImageDark ? styles.lightText : styles.darkText)
          : '';

        return (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className={`${styles.postCard} ${hasCover ? styles.postCardWithCover : ''} ${textColorClass}`}
          >
            {hasCover && (
              <div className={styles.postCardBackground}>
                <Image src={post.coverImage!} alt="" fill sizes="(max-width: 768px) 100vw, 640px" />
              </div>
            )}
            <div className={styles.postInfo}>
              <h2 className={styles.postTitle}>
                <ScrambleText delay={index * 100} duration={800}>
                  {post.title}
                </ScrambleText>
              </h2>
              <time className={styles.postDate} dateTime={post.date}>
                <ScrambleText delay={index * 100 + 50} duration={600}>
                  {post.formattedDate}
                </ScrambleText>
              </time>
              {post.description && (
                <p className={styles.postDescription}>
                  <ScrambleText delay={index * 100 + 100} duration={700}>
                    {post.description}
                  </ScrambleText>
                </p>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className={styles.postTags}>
                  {post.tags.map((tag, tagIndex) => (
                    <span key={tag} className={styles.tag}>
                      <ScrambleText delay={index * 100 + 150 + tagIndex * 30} duration={400}>
                        {tag}
                      </ScrambleText>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
