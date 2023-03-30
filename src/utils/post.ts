import { allMDXPosts, allPosts } from 'contentlayer/generated';

export const getSortedPosts = () => {
  return [...allPosts, ...allMDXPosts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};
