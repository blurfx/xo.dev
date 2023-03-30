import type { InferGetStaticPropsType } from 'next';

import Card from '~/components/card';
import CardContainer from '~/components/card-container';
import Section from '~/components/section';
import { getSortedPosts } from '~/utils/post';

const ArticlesPage = ({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Section title={'Articles'}>
      <CardContainer>
        {posts.map((post) => (
          <Card
            key={post.url}
            title={post.title}
            description={post.description}
            date={post.date}
            url={post.url}
          />
        ))}
      </CardContainer>
    </Section>
  );
};

export default ArticlesPage;

export const getStaticProps = () => {
  const posts = getSortedPosts().map((post) => ({
    title: post.title,
    description: post.description ?? null,
    date: post.date,
    url: post.url,
  }));
  return { props: { posts } };
};
