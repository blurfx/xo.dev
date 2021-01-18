/** @jsx jsx */

const lessThan = (breakpoint: string): string => `@media (max-width: ${breakpoint})`;

const greaterThan = (breakpoint: string): string => `@media (min-width: ${breakpoint})`;

const between = (minBreakpoint: string, maxBreakpoint: string) : string => `@media (min-width: ${minBreakpoint}) and (max-width: ${maxBreakpoint})`;

export const media = {
  lessThan,
  greaterThan,
  between,
};

export const breakpoints = {
  large: '1170px',
  medium: '768px',
  small: '575.98px',
};
