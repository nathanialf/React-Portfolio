import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { notFound } from 'next/navigation';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import VerticalSidebar from '../../../ui/VerticalSidebar';
import styles from '../../../styles/Blog.module.css';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getBlogPost(slug: string) {
  try {
    const filePath = join(process.cwd(), 'src', 'data', 'blog-posts', `${slug}.md`);
    const fileContent = await readFile(filePath, 'utf8');

    const htmlContent = await remark()
      .use(remarkGfm)
      .use(html)
      .process(fileContent);

    return htmlContent.toString();
  } catch {
    return null;
  }
}

async function getAllPostSlugs() {
  try {
    const postsDir = join(process.cwd(), 'src', 'data', 'blog-posts');
    const files = await readdir(postsDir);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''));
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${title} - Blog`,
    description: `Blog post: ${title}`,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const content = await getBlogPost(slug);

  if (!content) {
    notFound();
  }

  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <VerticalSidebar />
      </div>
      <div className={styles.container}>
        <div className={styles.content}>
          <header className={styles.header}>
            <Link href="/blog" className={styles.backLink}>
              <IconArrowLeft stroke={2} width="1em" height="1em" />
              <span>All Posts</span>
            </Link>
            <h1 className={styles.title}>{title}</h1>
          </header>

          <main
            className={styles.markdown}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}
