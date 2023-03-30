import { NextSeoProps } from 'next-seo';

type BlogConfigOptions = {
  name: string; // used for footer and RSS feed
  title: string;
  description: string;
  url: string;
  comment:
    | { type: 'utterances'; repo: string }
    | {
        type: 'giscus';
        repo: string;
        repoId: string;
        category: string;
        categoryId: string;
        lang?: 'ko' | 'en'; // defaults to 'en'
        lazy?: boolean;
      }
    | null;
  googleAnalyticsId?: string; // gtag id
};
export const BlogConfig: BlogConfigOptions = {
  name: 'Changhui Lee',
  title: 'xo.dev',
  description: 'xo.dev는 소프트웨어 개발에 대해 이야기합니다',
  url: 'https://xo.dev',
  comment: {
    type: 'giscus',
    repo: 'blurfx/xo.dev',
    repoId: 'MDEwOlJlcG9zaXRvcnk5NjQ1Mzkw',
    category: 'Comments',
    categoryId: 'DIC_kwDOAJMtTs4CVJ9b',
  },
};
export const SEOConfig: NextSeoProps = {
  title: BlogConfig.title,
  description: BlogConfig.description,
  canonical: BlogConfig.url,
  openGraph: {
    title: BlogConfig.title,
    description: BlogConfig.description,
    url: BlogConfig.url,
    images: [
      {
        url: `${BlogConfig.url}/images/thumbnail.png`,
      },
    ],
  },
};
