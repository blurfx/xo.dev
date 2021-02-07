import React from 'react';
import { getConfig } from '@api/config';
import getPosts from '@api/posts';
import { Post } from '@interfaces';
import Page from '@pages/page/[page]';

interface Props {
  posts: Post[];
}

const IndexPage = ({ posts }: Props): JSX.Element => (
  <Page posts={posts} />
);

export default IndexPage;

export async function getStaticProps() {
  const posts = getPosts();
  const { pagination } = getConfig();
  const chunks = posts.slice(0, pagination.size);

  return {
    props: {
      posts: chunks,
    },
  };
}
