import React, { useContext, useEffect } from 'react';
import { ThemeContext } from '@contexts/theme';
import { Theme } from '@interfaces';
import { Button } from './styles';

const getSystemColorScheme = (): Theme => {
  const mediaQuery = '(prefers-color-scheme: dark)';
  const mq = window.matchMedia(mediaQuery);
  return mq.matches ? Theme.Dark : Theme.Light;
};

const ThemeToggle = (): JSX.Element => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (theme !== getSystemColorScheme()) {
      toggleTheme();
    }
  }, []);

  return (
    <Button onClick={toggleTheme}>{ theme === Theme.Light ? '🌚' : '🌝'}</Button>
  );
};

export default ThemeToggle;
