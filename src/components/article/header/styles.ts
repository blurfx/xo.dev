import { styled } from '~/stitches.config';

export const Container = styled('div', {
  marginBottom: '2rem',
});

export const Title = styled('h1', {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '$textPrimary',
});

export const Time = styled('time', {
  fontSize: '0.875rem',
  lineHeight: 2,
  color: '$textTertiary',
});
