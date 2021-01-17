import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
        
  :root {
    --background: ${({ theme }): string => theme.colors.background};
    --blog-name: ${({ theme }): string => theme.colors.blogName};
  }
  
  body {
    background-color: var(--background);
  }
`;

export default GlobalStyle;
