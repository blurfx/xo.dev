import { breakpoints, media } from '@utils/mediaquery';
import styled from 'styled-components';

export const Anchor = styled.a`
  margin-right: 0.75em;
  margin-left: 0.75em;

  color: var(--nav-item);
  font-size: 0.9em;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-decoration: none;
  
  ${media.greaterThan(breakpoints.small)} {
    margin-right: 0;
    margin-left: 1.1em;
    
    font-size: 1em;
  }
`;
