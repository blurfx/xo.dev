import React, { ReactNode } from 'react';
import PostItem from '@components/Posts/Item';
import { Container } from './styles';

interface Props {
  children: ReactNode;
}

const Posts = ({ children }: Props) => (
  <Container>
    { children }
  </Container>
);

Posts.Item = PostItem;

export default Posts;
