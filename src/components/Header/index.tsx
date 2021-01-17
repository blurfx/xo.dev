import React from 'react';
import { getConfig } from '@api';
import { Container } from './styles';

const Header = (): JSX.Element => {
  const { name } = getConfig();

  return (
    <Container>
      {name}
    </Container>
  );
};

export default Header;
