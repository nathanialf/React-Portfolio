import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { notFound } from 'next/navigation';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import { rehype } from 'rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import VerticalSidebar from '../../../ui/VerticalSidebar';
import styles from '../../../styles/PrivacyPolicy.module.css';

interface PrivacyPolicyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPrivacyPolicy(slug: string) {
  try {
    const filePath = join(process.cwd(), 'src', 'data', 'privacy-policies', `${slug}.md`);
    const fileContent = await readFile(filePath, 'utf8');
    
    // First convert markdown to HTML
    const htmlContent = await remark()
      .use(remarkGfm)
      .use(html)
      .process(fileContent);
    
    // Then process HTML to add anchor links
    const processedContent = await rehype()
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings)
      .process(htmlContent);
    
    return processedContent.toString();
  } catch {
    return null;
  }
}

async function getAllPolicyNames() {
  try {
    const policiesDir = join(process.cwd(), 'src', 'data', 'privacy-policies');
    const files = await readdir(policiesDir);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''));
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const policyNames = await getAllPolicyNames();
  return policyNames.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PrivacyPolicyPageProps) {
  const { slug } = await params;
  const appName = slug.charAt(0).toUpperCase() + slug.slice(1);
  
  return {
    title: `Privacy Policy - ${appName}`,
    description: `Privacy policy for ${appName} application`,
  };
}

export default async function PrivacyPolicyPage({ params }: PrivacyPolicyPageProps) {
  const { slug } = await params;
  const content = await getPrivacyPolicy(slug);
  
  if (!content) {
    notFound();
  }
  
  const appName = slug.charAt(0).toUpperCase() + slug.slice(1);
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <VerticalSidebar />
      </div>
      <div className={styles.container}>
        <div className={styles.content}>
          <header className={styles.header}>
            <Link href="/privacy-policy" className={styles.backLink}>
              <IconArrowLeft stroke={2} width="1em" height="1em" />
              <span>All Policies</span>
            </Link>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.subtitle}>{appName}</p>
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