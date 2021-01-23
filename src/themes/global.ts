import { createGlobalStyle } from 'styled-components';
import { breakpoints, media } from '@utils/mediaquery';

const GlobalStyle = createGlobalStyle`  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
      
    font-family: 'Spoqa Han Sans Neo', sans-serif;
    
    transition: color .1s ease, border-color 0.1s ease, background-color 0.1s ease;
  }

  :root {
    --base-font-size: 18px;
    --background: ${({ theme }) => theme.colors.white};
    --blog-name: ${({ theme }) => theme.colors.charcoal};
    --nav-item: ${({ theme }) => theme.colors.blue};
    --header-divider: ${({ theme }) => theme.colors.lightestGray};
    --divider: ${({ theme }) => theme.colors.whitesmoke};
    --text: ${({ theme }) => theme.colors.darkGray};
    --light-text: ${({ theme }) => theme.colors.gray};
    --tag-background: ${({ theme }) => theme.colors.lightGray};
    --tag-count-background: ${({ theme }) => theme.colors.silver};

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

  h1 {
    font-size: 1.35em;
  }


  h2 {
    font-size: 1.125em;
  }

  h3 {
      font-size: 1em;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin: 1em 0 15px;
    padding: 0;

    line-height: 1.4;
      
    ${media.greaterThan(breakpoints.small)} {
      line-height: 1.7;
    }
  }
`;

export default GlobalStyle;
