import Link from 'next/link';
import Image from 'next/image';
import { IconRss } from '@tabler/icons-react';
import VerticalSidebar from '../../ui/VerticalSidebar';
import Copyright from '../../ui/Copyright';
import { getAllPosts, formatDate } from '../../lib/blog';
import styles from '../../styles/Blog.module.css';

export const metadata = {
  title: 'Blog',
  description: 'Thoughts on software, technology, and building things.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <VerticalSidebar />
      </div>
      <a href="/feed.xml" className={styles.rssSidebar} title="RSS Feed">
        <IconRss className={styles.rssIcon} stroke={1.5} size={18} />
        <span className={styles.rssLink}>RSS FEED</span>
      </a>
      <div className={styles.container}>
        <div className={styles.content}>
          <header className={styles.header}>
            <h1 className={styles.title}>Blog</h1>
            <p className={styles.subtitle}>Thoughts on software</p>
          </header>

          <main className={styles.posts}>
            {posts.length === 0 ? (
              <p className={styles.empty}>No posts yet.</p>
            ) : (
              <div className={styles.postList}>
                {posts.map(post => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className={styles.postCard}
                  >
                    {post.coverImage && (
                      <div className={styles.postCoverImage}>
                        <Image src={post.coverImage} alt="" fill sizes="(max-width: 768px) 100vw, 300px" />
                      </div>
                    )}
                    <div className={styles.postInfo}>
                      <h2 className={styles.postTitle}>{post.title}</h2>
                      <time className={styles.postDate} dateTime={post.date}>
                        {formatDate(post.date)}
                      </time>
                      {post.description && (
                        <p className={styles.postDescription}>{post.description}</p>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className={styles.postTags}>
                          {post.tags.map(tag => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
          <Copyright />
        </div>
      </div>
    </div>
  );
}
