import React, { ReactNode, useState } from 'react';

type Theme = 'light' | 'dark';
interface IThemeContext {
  theme: Theme,
  toggleTheme: () => void,
}

interface Props {
  children: ReactNode;
}

const ThemeContext = React.createContext<IThemeContext>({} as IThemeContext);

const ThemeContextProvider = ({ children }: Props): JSX.Element => {
  const [theme, setTheme] = useState<Theme>('light');
  const toggleTheme = (): void => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContextProvider, ThemeContext };
