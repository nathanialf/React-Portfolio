import { Feed } from 'feed';
import { getAllPosts } from '../../lib/blog';

export async function GET() {
  const posts = await getAllPosts();
  const siteUrl = 'https://defnf.com';

  const feed = new Feed({
    title: 'Nathanial Fine - Blog',
    description: 'Thoughts on software, technology, and building things.',
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    image: `${siteUrl}/favicon.png`,
    favicon: `${siteUrl}/favicon.png`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Nathanial Fine`,
    feedLinks: {
      rss2: `${siteUrl}/feed.xml`,
    },
    author: {
      name: 'Nathanial Fine',
      link: siteUrl,
    },
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${siteUrl}/blog/${post.slug}`,
      link: `${siteUrl}/blog/${post.slug}`,
      description: post.description,
      date: new Date(post.date),
      author: [
        {
          name: 'Nathanial Fine',
          link: siteUrl,
        },
      ],
      image: post.coverImage ? `${siteUrl}${post.coverImage}` : undefined,
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
