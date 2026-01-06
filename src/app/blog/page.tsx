import { readdir } from 'fs/promises';
import { join } from 'path';
import Link from 'next/link';
import VerticalSidebar from '../../ui/VerticalSidebar';
import styles from '../../styles/Blog.module.css';

async function getAllPosts() {
  try {
    const postsDir = join(process.cwd(), 'src', 'data', 'blog-posts');
    const files = await readdir(postsDir);

    return files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const slug = file.replace('.md', '');
        const title = slug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        return { slug, title };
      });
  } catch {
    return [];
  }
}

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
                {posts.map(({ slug, title }) => (
                  <Link
                    key={slug}
                    href={`/blog/${slug}`}
                    className={styles.postCard}
                  >
                    <h2 className={styles.postTitle}>{title}</h2>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
