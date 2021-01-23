import styled from 'styled-components';

export const Container = styled.li`
  display: inline;
  margin: 0;
  
  color: var(--text);
  
  a {
    text-decoration: none;
  }
`;

interface LabelProps {
  withCount: boolean;
}

export const Label = styled.span<LabelProps>`
  margin: 3px 3px 3px 0;
  padding: 1px 4px;
  border-bottom: 0;
  border-radius: 3px;
        
  background: var(--tag-background);
  
  ${({ withCount }) => withCount && `
    margin-right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  `};
`;

export const Count = styled.span`
  padding: 1px 4px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;

  background: var(--tag-count-background);
`;
