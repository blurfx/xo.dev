import React, { ReactNode, useContext } from 'react';
import Head from 'next/head';
import styled, { DefaultTheme, ThemeProvider } from 'styled-components';
import { getConfig } from '@api/config';
import Header from '@components/Header';
import { ThemeContext } from '@contexts/theme';
import GlobalStyle from '@themes/global';
import { DarkTheme, LightTheme } from '@themes';
import { Theme } from '@interfaces';

interface Props {
  children?: ReactNode
  title?: string
}

const themes: Record<Theme, DefaultTheme> = {
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
  const currentTheme = themes[theme];

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <Container>
        <Head>
          <title>{pageTitle}</title>
          <meta charSet='utf-8' />
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
          <link href='//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css' rel='stylesheet' type='text/css' />
        </Head>
        <Header />
        {children}
      </Container>
    </ThemeProvider>

  );
};

export default BaseLayout;
