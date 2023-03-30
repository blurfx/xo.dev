import { writeFileSync } from 'fs';

import { Feed } from 'feed';

import { BlogConfig } from '../../blog.config';
import { getSortedPosts } from '~/utils/post';

export default function generateRssFeed() {
  const blogUrl = BlogConfig.url;

  const feed = new Feed({
    id: blogUrl,
    title: BlogConfig.title,
    description: BlogConfig.description,
    link: BlogConfig.url,
    feedLinks: {
      rss2: `${blogUrl}/feed.xml`,
      json: `${blogUrl}/feed.json`,
      atom: `${blogUrl}/atom.xml`,
    },
    updated: new Date(),
    copyright: '',
  });

  getSortedPosts().map((post) => {
    feed.addItem({
      title: post.title,
      description: post.description,
      link: `${blogUrl}${post.url}`,
      date: new Date(post.date),
    });
  });

  writeFileSync('./public/feed.xml', feed.rss2(), { encoding: 'utf-8' });
  writeFileSync('./public/atom.xml', feed.atom1(), { encoding: 'utf-8' });
  writeFileSync('./public/feed.json', feed.json1(), { encoding: 'utf-8' });
}
