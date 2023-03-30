import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';

const postFields = {
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      description: 'The tags of the post',
    },
    description: {
      type: 'string',
      description: 'The description of the post for preview and SEO',
    },
    thumbnail: {
      type: 'string',
      description: 'The thumbnail image file path of the post for SEO',
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/articles/${post._raw.flattenedPath}`,
    },
  },
};

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: '**/*.md',
  ...postFields,
}));

export const MDXPost = defineDocumentType(() => ({
  name: 'MDXPost',
  filePathPattern: '**/*.mdx',
  contentType: 'mdx',
  ...postFields,
}));

const rehypePrettyCodeOptions = {
  theme: {
    light: 'github-light',
    dark: 'github-dark',
  },
};

export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [MDXPost, Post],
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  },
});
