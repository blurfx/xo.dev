import * as Tooltip from '@radix-ui/react-tooltip';

import { keyframes, styled } from '~/stitches.config';

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

export const TooltipContent = styled(Tooltip.Content, {
  borderRadius: 4,
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  lineHeight: 1,
  color: '$tooltipColor',
  backgroundColor: '$tooltipBg',
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  userSelect: 'none',
  animationDuration: '300ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',
  '&[data-state="delayed-open"]': {
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
  },
});
