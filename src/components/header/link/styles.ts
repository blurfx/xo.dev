import Link from 'next/link';

import { NavItemStyle } from '~/components/header/styles';
import { styled } from '~/stitches.config';

export const Container = styled(Link, NavItemStyle, {
  variants: {
    active: {
      true: {
        background:
          'linear-gradient(25deg, $secondaryGradient1 1.7%, $secondaryGradient2 50%, $secondaryGradient3 100%)',
        '& path': {
          fill: '$gray9',
        },
      },
    },
  },
});
