import { InferGetStaticPropsType } from 'next';
import Link from 'next/link';

import Card from '~/components/card';
import CardContainer from '~/components/card-container';
import Content from '~/components/content';
import Section from '~/components/section';
import SectionList from '~/components/section-list';
import generateRssFeed from '~/utils/generateRssFeed';
import { getSortedPosts } from '~/utils/post';

const HomePage = ({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <SectionList>
      <Section title={'Changhui Lee'}>
        <Content>
          <p>분야에 상관없이 소프트웨어를 개발하는 일을 사랑하며, 일을 제대로 잘하는 것에 관심이 많습니다.</p>
          <p>다양한 기술에 관심이 많으며 특히 Go를 좋아합니다.</p>
        </Content>
      </Section>
      <Section title={'Articles'}>
        <CardContainer direction={'row'}>
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
      <Section title={'Talks'}>
        <CardContainer>
          <Card
            title={'프론트엔드에서 함수형을 추구하면 안되는걸까?'}
            description={'JSConf Korea 2022'}
            date={'2022-09-16'}
            url={'https://2022.jsconf.kr/speakers/minsu-kim-changhui-lee'}
          />
          <Card
            title={'정적 타입 검사로 더 나은 Python 코드 작성하기'}
            description={'PyCon KR 2019'}
            date={'2019-08-17'}
            url={'https://speakerdeck.com/blur/python-type-hinting-and-static-type-checking'}
          />
        </CardContainer>
      </Section>
    </SectionList>
  );
};

export default HomePage;

export const getStaticProps = async () => {
  await generateRssFeed();
  const posts = getSortedPosts()
    .slice(0, 3)
    .map((post) => ({
      title: post.title,
      description: post.description ?? null,
      date: post.date,
      url: post.url,
    }));
  return { props: { posts } };
};
