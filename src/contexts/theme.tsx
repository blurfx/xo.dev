import React, { ReactNode, useState } from 'react';
import { Theme } from '@interfaces';

interface IThemeContext {
  theme: Theme,
  toggleTheme: () => void,
}

interface Props {
  children: ReactNode;
}

const ThemeContext = React.createContext<IThemeContext>({} as IThemeContext);

const ThemeContextProvider = ({ children }: Props): JSX.Element => {
  const [theme, setTheme] = useState<Theme>(Theme.Light);
  const toggleTheme = (): void => {
    setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContextProvider, ThemeContext };
