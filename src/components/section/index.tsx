import React from 'react';

import { Container, Title } from './styles';

type Props = React.PropsWithChildren<{
  title: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}>;
const Section = ({ title, level = 1, children }: Props) => {
  return (
    <Container>
      <Title as={`h${level}`}>{title}</Title>
      {children}
    </Container>
  );
};

export default Section;
