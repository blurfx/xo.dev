import { ParsedUrlQuery } from 'querystring';

import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { NextSeo } from 'next-seo';

import { BlogConfig, SEOConfig } from '../../../blog.config';
import { allMDXPosts, allPosts, MDXPost, Post } from 'contentlayer/generated';
import { ArticleHeader } from '~/components/article/header';
import Giscus from '~/components/comment/giscus';
import Utterances from '~/components/comment/utterances';
import Content from '~/components/content';
import MDXContent from '~/components/MDXContent';
import { styled } from '~/stitches.config';

type Props = {
  post: Post | MDXPost;
};

type Params = ParsedUrlQuery & {
  slug: string;
};

const Article = styled('article', {
  marginBottom: '2rem',
});

const ArticlePage = ({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  // @ts-ignore
  return (
    <div>
      <NextSeo
        title={post.title}
        description={post.description ?? post.title}
        canonical={`${SEOConfig.canonical}${post.url}`}
        openGraph={{
          title: post.title,
          description: post.description,
          images: post.thumbnail
            ? [{ url: `${BlogConfig.url}${post.thumbnail}` }]
            : undefined,
        }}
      />
      <Article>
        <ArticleHeader title={post.title} date={post.date} />
        {'code' in post.body ? (
          <MDXContent code={post.body.code} />
        ) : (
          <Content dangerouslySetInnerHTML={{ __html: post.body.html }} />
        )}
      </Article>
      {BlogConfig.comment?.type === 'giscus' && <Giscus />}
      {BlogConfig.comment?.type === 'utterances' && <Utterances />}
    </div>
  );
};

export const getStaticPaths: GetStaticPaths<Params> = () => {
  const paths = [...allPosts, ...allMDXPosts].map((post) => post.url);
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = ({ params }) => {
  const post = [...allPosts, ...allMDXPosts].find(
    (p) => p._raw.flattenedPath === params?.slug,
  )!;
  return {
    props: {
      post,
    },
  };
};

export default ArticlePage;
