import React from 'react';
import getPosts, { getAllPosts } from '@api/posts';
import { getConfig } from '@api/config';
import Posts from '@components/Posts';
import { Post, PostResponse } from '@interfaces';
import BaseLayout from '@layouts/BaseLayout';
import Paginator from '@components/Paginator';

const Page = ({ posts, pagination }: PostResponse): JSX.Element => {
  const { currentPage, hasPrev, hasNext } = pagination;

  return (
    <BaseLayout title='Home | Next.js + TypeScript Example'>
      <Posts>
        {posts.map((post: Post) => <Posts.Item key={post.slug} post={post} />)}
      </Posts>
      <Paginator
        currentPage={currentPage}
        hasPrevPage={hasPrev}
        hasNextPage={hasNext}
      />
    </BaseLayout>
  );
};

export async function getStaticPaths() {
  const posts = getAllPosts();
  const { pagination } = getConfig();
  const totalPages = Math.ceil(posts.length / pagination.size);
  const paths = Array(totalPages).fill(0).map((_, index) => ({ params: { page: `${index + 1}` } }));

  return {
    paths,
    fallback: false,
  };
}

interface StaticProps {
  params: {
    page: string;
  }
}

export async function getStaticProps({ params: { page } }: StaticProps) {
  const response = getPosts(parseInt(page, 10));

  return {
    props: {
      ...response,
    },
  };
}

export default Page;
