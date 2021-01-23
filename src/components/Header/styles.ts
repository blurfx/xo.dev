import styled from 'styled-components';
import { breakpoints, media } from '@utils/mediaquery';

export const Container = styled.header`
  margin-bottom: 50px;
`;

export const Wrapper = styled.div`
  padding: 40px 0;
  border-bottom: 1px solid var(--header-divider);
  
  ${media.greaterThan(breakpoints.small)} { 
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const BlogNameWrapper = styled.div`
  margin: 0;

  color: var(--blog-name);
  text-align: center;

  ${media.greaterThan(breakpoints.small)} {
    display: inline-block;
  }
`;

export const ThemeToggleContainer = styled.div`
  display: inline-block;
`;

export const Anchor = styled.a`
  display: inline-block;
  
  text-decoration: none;
`;

export const BlogName = styled.h1`
  margin: 0;
        
  font-weight: 500;
  font-size: 1.6em;
  
  letter-spacing: -2px;
  text-decoration: none;
`;
