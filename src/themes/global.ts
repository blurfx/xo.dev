import { createGlobalStyle } from 'styled-components';
import { breakpoints, media } from '@utils/mediaquery';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
        
  :root {
    --base-font-size: 18px;
    --background: ${({ theme }) => theme.colors.background};
    --blog-name: ${({ theme }) => theme.colors.blogName};
    --nav-item: ${({ theme }) => theme.colors.mobileNav};
    --header-divider: ${({ theme }) => theme.colors.headerDivider};
    
    ${media.greaterThan(breakpoints.small)} {
      --nav-item: var(--blog-name);
    }
  }
  
  html {
    font-size: var(--base-font-size);
  }
  
  body {
    background-color: var(--background);
  }

  a {
    color: inherit;
  }
`;

export default GlobalStyle;
