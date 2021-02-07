import React from 'react';
import getPosts from '@api/posts';
import { PostResponse } from '@interfaces';
import Page from '@pages/page/[page]';

const IndexPage = ({ posts, pagination }: PostResponse): JSX.Element => (
  <Page posts={posts} pagination={pagination} />
);

export default IndexPage;

export async function getStaticProps() {
  const response = getPosts(1);

  return {
    props: {
      ...response,
    },
  };
}
