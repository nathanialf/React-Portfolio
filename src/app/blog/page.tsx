import { IconRss } from '@tabler/icons-react';
import VerticalSidebar from '../../ui/VerticalSidebar';
import Copyright from '../../ui/Copyright';
import BlogHeader from '../../ui/BlogHeader';
import BlogPostList from '../../ui/BlogPostList';
import { getAllPosts, formatDate } from '../../lib/blog';
import styles from '../../styles/Blog.module.css';

export const metadata = {
  title: 'Blog',
  description: 'Thoughts on software, technology, and building things.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const postsWithFormattedDates = posts.map(post => ({
    ...post,
    formattedDate: formatDate(post.date),
    coverImageDark: post.coverImageDark ?? true,
  }));

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
          <BlogHeader />

          <main className={styles.posts}>
            <BlogPostList posts={postsWithFormattedDates} />
          </main>
          <Copyright />
        </div>
      </div>
    </div>
  );
}
