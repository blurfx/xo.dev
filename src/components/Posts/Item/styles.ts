import styled from 'styled-components';

interface ContainerProps {
  hasExcerpt: boolean;
}

export const Container = styled.article<ContainerProps>`
  padding-bottom: 2em;
  border-bottom: 1px solid var(--divider);
  
  ${({ hasExcerpt }) => !hasExcerpt && `
    padding-bottom: 1em;
  `};
  
  &:last-child {
    padding-bottom: 1em;
    border-bottom: none;
  }
`;

export const Title = styled.h1`
  margin-bottom: 0.1em;
  
  color: var(--text);
  
  a {
    text-decoration: none;
  }
`;

export const Date = styled.span`
  margin-right: 3px;

  color: var(--light-text);
  font-weight: 300;
  font-size: 0.78em;
`;

export const Excerpt = styled.p`
  margin: 15px 0;

  color: var(--text);
  
  word-break: keep-all;
`;
