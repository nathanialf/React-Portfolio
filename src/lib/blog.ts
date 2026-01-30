import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { isImageDark } from './image-brightness';

export interface PostMetadata {
  title: string;
  date: string;
  description: string;
  coverImage?: string;
  coverImageDark?: boolean;
  tags?: string[];
  slug: string;
}

export interface Post extends PostMetadata {
  content: string;
}

const postsDirectory = join(process.cwd(), 'src', 'data', 'blog-posts');

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const filePath = join(postsDirectory, `${slug}.md`);
    const fileContent = await readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title || formatSlugToTitle(slug),
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      description: data.description || '',
      coverImage: data.coverImage,
      tags: data.tags,
      content,
    };
  } catch {
    return null;
  }
}

export async function getAllPosts(): Promise<PostMetadata[]> {
  try {
    const files = await readdir(postsDirectory);
    const posts = await Promise.all(
      files
        .filter(file => file.endsWith('.md'))
        .map(async file => {
          const slug = file.replace('.md', '');
          const post = await getPostBySlug(slug);
          if (!post) return null;

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { content, ...metadata } = post;

          // Calculate cover image brightness if present
          if (metadata.coverImage) {
            metadata.coverImageDark = await isImageDark(metadata.coverImage);
          }

          return metadata;
        })
    );

    return posts
      .filter((post): post is PostMetadata => post !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const files = await readdir(postsDirectory);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''));
  } catch {
    return [];
  }
}

function formatSlugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
