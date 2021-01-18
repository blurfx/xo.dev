import React, { ReactNode } from 'react';
import Link from 'next/link';
import { Anchor } from './styles';

interface Props {
  children: ReactNode;
  href: string | URL;
}

const NavigationItem = ({ children, href }: Props): JSX.Element => (
  <Link href={href} passHref>
    <Anchor>{ children }</Anchor>
  </Link>
);

export default NavigationItem;
