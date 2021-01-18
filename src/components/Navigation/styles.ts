import styled from 'styled-components';
import { breakpoints, media } from '@utils/mediaquery';

export const Container = styled.nav`
  display: flex;
  justify-content: center;
  margin-top: 10px;

  ${media.greaterThan(breakpoints.small)} {
    margin-top: 0;
  }
`;
