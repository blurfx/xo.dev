import Link from 'next/link';
import React from 'react';
import { Container, Count, Label } from './styles';

interface Props {
  href: string | URL;
  label: string;
  count?: number;
}

const Tag = ({ href, label, count }: Props): JSX.Element => (
  <Container>
    <Link href={href}>
      <a>
        <Label withCount={count !== undefined}>{ label }</Label>
        { count !== undefined && <Count>{ count }</Count>}
      </a>
    </Link>
  </Container>
);

export default Tag;
