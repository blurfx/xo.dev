import styled from 'styled-components';

export const Container = styled.div`
  margin: 2em auto;
  
  ::after {
    display: block;
    clear: both;

    content: '';
  }
`;

export const PageAnchor = styled.a`
  display: inline-block;
  width: 50%;

  color: var(--light-text);
  font-weight: 300;
  text-decoration: none;

  &.prev {
    float: left;
  }
  
  &.next {
    float: right;
    
    text-align: right;
  }
`;
