import Link from 'next/link';

import { styled } from '~/stitches.config';

export const Container = styled(Link, {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: 'calc(100% + 2rem)',
  padding: '1rem',
  marginLeft: '-1rem',
  borderRadius: '$sm',

  '&:hover': {
    background:
      'linear-gradient(90deg, $cardGradient1 0%, $cardGradient2 51%, $cardGradient3 100%)',
  },
});

export const Title = styled('h2', {
  alignItems: 'center',

  fontSize: '1rem',
  fontWeight: 500,
  color: '$textPrimary',
});

export const Description = styled('p', {
  alignItems: 'center',

  fontSize: '1rem',
  fontWeight: 400,
  color: '$textSecondary',
});

export const Time = styled('time', {
  marginTop: 'auto',
  fontSize: '0.875rem',
  lineHeight: 2,
  color: '$textTertiary',
});
