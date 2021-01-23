import React from 'react';
import { getConfig } from '@api/config';
import Link from 'next/link';
import Navigation from '@components/Navigation';
import ThemeToggle from '@components/ThemeToggle';
import {
  Anchor, BlogName, BlogNameWrapper, Container, ThemeToggleContainer, Wrapper,
} from './styles';

const Header = (): JSX.Element => {
  const { name, navigation } = getConfig();

  return (
    <Container>
      <Wrapper>
        <BlogNameWrapper>
          <Link href='/' passHref>
            <Anchor>
              <BlogName>{name}</BlogName>
            </Anchor>
          </Link>
          <ThemeToggleContainer>
            <ThemeToggle />
          </ThemeToggleContainer>
        </BlogNameWrapper>
        <Navigation>
          {
            navigation.map((item) => (
              <Navigation.Item key={item.name} href={item.path}>
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
