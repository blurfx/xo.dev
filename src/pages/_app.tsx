import type { AppProps /* , AppContext */ } from 'next/app';
import React from 'react';
import { ThemeContextProvider } from '@contexts/theme';

const App = ({ Component, pageProps }: AppProps): JSX.Element => (
  <ThemeContextProvider>
    <Component {...pageProps} />
  </ThemeContextProvider>
);

export default App;
