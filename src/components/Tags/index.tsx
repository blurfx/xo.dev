import React, { ReactNode } from 'react';
import Tag from './Tag';
import { Container } from './styles';

interface Props {
  children: ReactNode;
}

const Tags = ({ children }: Props): JSX.Element => (
  <Container>
    {children}
  </Container>
);

Tags.Tag = Tag;

export default Tags;
