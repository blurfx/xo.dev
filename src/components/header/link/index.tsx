import type NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import Tooltip from '~/components/header/tooltip';

import { Container } from './styles';

type Props = React.ComponentProps<typeof NextLink>;
export const Link = ({
  children,
  ...props
}: React.PropsWithChildren<Props>) => {
  const pathname = usePathname();
  const TooltipContainer = props['aria-label'] ? Tooltip : React.Fragment;
  return (
    <TooltipContainer label={props['aria-label']!}>
      <Container active={pathname === props.href} {...props}>
        {children}
      </Container>
    </TooltipContainer>
  );
};
