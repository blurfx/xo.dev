import React, { ReactNode, useContext } from 'react';
import Head from 'next/head';
import styled, { ThemeProvider } from 'styled-components';
import { getConfig } from '@api';
import Header from '@components/Header';
import { ThemeContext } from '@contexts/theme';
import GlobalStyle from '@themes/global';
import { DarkTheme, LightTheme } from '@themes';

interface Props {
  children?: ReactNode
  title?: string
}

const themes = {
  light: LightTheme,
  dark: DarkTheme,
};

const Container = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 10px;
`;

const BaseLayout = ({ children, title }: Props): JSX.Element => {
  const { name } = getConfig();
  const { theme } = useContext(ThemeContext);
  const pageTitle = title ? [title, name].join(' — ') : name;
  const currentTheme = theme === 'light' ? themes.light : themes.dark;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <Container>
        <Head>
          <title>{pageTitle}</title>
          <meta charSet='utf-8' />
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        </Head>
        <Header />
        {children}
      </Container>
    </ThemeProvider>

  );
};

export default BaseLayout;
