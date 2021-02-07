import fs from 'fs';
import path from 'path';
import frontMatter from '@utils/front-matter';
import { Post, PostResponse } from '@interfaces';
import { getConfig } from '@api/config';

const postDirectory = path.join(process.cwd(), 'posts');
const regex = new RegExp(/(\d{4}-\d{1,2}-\d{1,2})-([\w\W]+).mdx?/);

const parsePostData = (filename: string): Post => {
  const matches = regex.exec(filename);
  if (!matches) {
    throw Error('Invalid post filename');
  }

  const date = matches[1];
  const slug = matches[2];

  const fullPath = path.join(postDirectory, filename);
  const fileContents = fs.readFileSync(fullPath, { encoding: 'utf8' });
  const matter = frontMatter(fileContents);

  return {
    date,
    slug,
    ...matter,
  };
};

export const getAllPosts = (): Post[] => {
  const fileNames = fs.readdirSync(postDirectory);
  const posts = fileNames.map((filename: string) => parsePostData(filename));

  return posts.sort((x, y) => {
    if (new Date(x.date) < new Date(y.date)) {
      return 1;
    }
    return -1;
  });
};

const Posts = getAllPosts();

const getPosts = (page: number): PostResponse => {
  const { pagination } = getConfig();
  const offset = pagination.size * (page - 1);
  const posts = Posts.slice(offset, offset + pagination.size);
  const totalPages = Math.ceil(Posts.length / pagination.size);

  return {
    posts,
    pagination: {
      currentPage: page,
      hasPrev: page > 1,
      hasNext: page < totalPages,
    },
  };
};

export default getPosts;
