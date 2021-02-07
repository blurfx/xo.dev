import React from 'react';
import getPosts from '@api/posts';
import { getConfig } from '@api/config';
import Posts from '@components/Posts';
import { Post } from '@interfaces';
import BaseLayout from '@layouts/BaseLayout';

interface PageProps {
  posts: Post[];
}

const Page = ({ posts }: PageProps) => (
  <BaseLayout title='Home | Next.js + TypeScript Example'>
    <Posts>
      {posts.map((post: Post) => <Posts.Item key={post.slug} post={post} />)}
    </Posts>
  </BaseLayout>
);

export async function getStaticPaths() {
  const posts = getPosts();
  const { pagination } = getConfig();
  const totalPages = Math.ceil(posts.length / pagination.size);
  const paths = Array(totalPages).fill(0).map((_, index) => ({ params: { page: `${index + 1}` } }));

  console.log(paths);
  return {
    paths,
    fallback: false,
  };
}

interface StaticProps {
  params: {
    page: number;
  }
}

export async function getStaticProps({ params: { page } }: StaticProps) {
  const posts = getPosts();
  const { pagination } = getConfig();
  const offset = pagination.size * (page - 1);
  const chunks = posts.slice(offset, offset + pagination.size);

  return {
    props: {
      posts: chunks,
    },
  };
}

export default Page;
