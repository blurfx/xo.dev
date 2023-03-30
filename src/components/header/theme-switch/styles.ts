import { NavItemStyle } from '~/components/header/styles';
import { styled } from '~/stitches.config';

export const Container = styled('div', NavItemStyle, {
  marginLeft: 'auto',
});

export const Button = styled('button', NavItemStyle, {
  border: 0,

  appearance: 'none',
  background: 'transparent',
});
