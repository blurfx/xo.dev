import React from 'react';
import Posts from '@components/Posts';
import getPosts from '@api/posts';
import { Post } from '@interfaces';
import BaseLayout from '../layouts/BaseLayout';

interface Props {
  posts: Post[];
}

const IndexPage = ({ posts }: Props): JSX.Element => (
  <BaseLayout title='Home | Next.js + TypeScript Example'>
    <Posts>
      {posts.map((post: Post) => <Posts.Item key={post.slug} post={post} />)}
    </Posts>
  </BaseLayout>
);

export default IndexPage;

export async function getStaticProps() {
  const posts = getPosts();
  return {
    props: {
      posts,
    },
  };
}
