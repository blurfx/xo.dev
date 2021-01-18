import React from 'react';
import { getConfig } from '@api';
import Link from 'next/link';
import Navigation from '@components/Navigation';
import {
  Anchor, BlogName, BlogNameWrapper, Container, Wrapper,
} from './styles';

const Header = (): JSX.Element => {
  const { name, navigation } = getConfig();

  return (
    <Container>
      <Wrapper>
        <BlogNameWrapper>
          <Link href='/' passHref><Anchor><BlogName>{name}</BlogName></Anchor></Link>
        </BlogNameWrapper>
        <Navigation>
          {
            navigation.map((item) => (
              <Navigation.Item href={item.path}>
                {item.name}
              </Navigation.Item>
            ))
          }
        </Navigation>
      </Wrapper>
    </Container>
  );
};

export default Header;
