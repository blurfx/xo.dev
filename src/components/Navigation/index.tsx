import React, { ReactNode } from 'react';
import NavigationItem from './NavigationItem';
import { Container } from './styles';

interface Props {
  children: ReactNode;
}

const Navigation = ({ children }: Props): JSX.Element => (
  <Container>{ children }</Container>
);

Navigation.Item = NavigationItem;

export default Navigation;
