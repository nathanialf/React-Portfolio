import { notFound } from 'next/navigation';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { IconRss } from '@tabler/icons-react';
import VerticalSidebar from '../../../ui/VerticalSidebar';
import Copyright from '../../../ui/Copyright';
import BlogPostHeader from '../../../ui/BlogPostHeader';
import BlogPostContent from '../../../ui/BlogPostContent';
import { getPostBySlug, getAllPostSlugs, formatDate } from '../../../lib/blog';
import { isImageDark } from '../../../lib/image-brightness';
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
    .use(remarkRehype, {
      clobberPrefix: '',
      footnoteLabel: 'Footnotes',
      footnoteLabelTagName: 'h2',
      footnoteLabelProperties: { className: ['sr-only'] },
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(post.content);

  // Use frontmatter value if set, otherwise detect
  const coverImageDark = post.coverImageDark ?? (post.coverImage ? await isImageDark(post.coverImage) : true);

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
        <IconRss className={styles.rssIcon} stroke={1.5} size={18} />
        <span className={styles.rssLink}>RSS FEED</span>
      </a>
      <div className={styles.container}>
        <div className={styles.content}>
          <BlogPostHeader
            title={post.title}
            date={post.date}
            formattedDate={formatDate(post.date)}
            coverImage={post.coverImage}
            coverImageDark={coverImageDark}
            tags={post.tags}
          />

          <BlogPostContent
            htmlContent={htmlContent.toString()}
            tags={post.tags}
            className={styles.markdown}
          />
          <Copyright />
        </div>
      </div>
    </div>
  );
}
