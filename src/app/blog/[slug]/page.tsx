import { notFound } from 'next/navigation';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import VerticalSidebar from '../../../ui/VerticalSidebar';
import { getPostBySlug, getAllPostSlugs, formatDate } from '../../../lib/blog';
import styles from '../../../styles/Blog.module.css';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  const metadata: Record<string, unknown> = {
    title: post.title,
    description: post.description || `Blog post: ${post.title}`,
    alternates: {
      canonical: `https://defnf.com/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description || `Blog post: ${post.title}`,
      type: 'article',
      url: `https://defnf.com/blog/${slug}`,
      publishedTime: post.date,
      authors: ['Nathanial Fine'],
      tags: post.tags,
    },
    twitter: {
      card: post.coverImage ? 'summary_large_image' : 'summary',
      title: post.title,
      description: post.description || `Blog post: ${post.title}`,
    },
  };

  if (post.coverImage) {
    (metadata.openGraph as Record<string, unknown>).images = [
      {
        url: post.coverImage,
        alt: post.title,
      },
    ];
    (metadata.twitter as Record<string, unknown>).images = [post.coverImage];
  }

  return metadata;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const htmlContent = await remark()
    .use(remarkGfm)
    .use(html)
    .process(post.content);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.coverImage,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: 'Nathanial Fine',
      url: 'https://defnf.com',
    },
    publisher: {
      '@type': 'Person',
      name: 'Nathanial Fine',
      url: 'https://defnf.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://defnf.com/blog/${slug}`,
    },
  };

  return (
    <div className={styles.wrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.sidebar}>
        <VerticalSidebar />
      </div>
      <a href="/feed.xml" className={styles.rssSidebar} title="RSS Feed">
        <span className={styles.rssLink}>RSS FEED</span>
      </a>
      <div className={styles.container}>
        <div className={styles.content}>
          <header className={styles.header}>
            <Link href="/blog" className={styles.backLink}>
              <IconArrowLeft stroke={2} width="1em" height="1em" />
              <span>All Posts</span>
            </Link>
            <h1 className={styles.title}>{post.title}</h1>
            <time className={styles.postDateHeader} dateTime={post.date}>
              {formatDate(post.date)}
            </time>
            {post.tags && post.tags.length > 0 && (
              <div className={styles.postTagsHeader}>
                {post.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}
          </header>

          {post.coverImage && (
            <div className={styles.coverImage}>
              <img src={post.coverImage} alt="" />
            </div>
          )}

          <main
            className={styles.markdown}
            dangerouslySetInnerHTML={{ __html: htmlContent.toString() }}
          />
        </div>
      </div>
    </div>
  );
}
