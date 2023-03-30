import { createStitches } from '@stitches/react';
export const { getCssText, globalCss, styled, createTheme, css, keyframes } =
  createStitches({
    theme: {
      colors: {
        gray1: '#fff',
        gray2: '#f1f1f1',
        gray3: '#ececec',
        gray4: '#bdbdbd',
        gray5: '#949494',
        gray6: '#71717a',
        gray7: '#52525b',
        gray8: '#383838',
        gray9: '#161616',
        gray10: '#080808',

        blue1: '#c3c4cd',

        primaryGradient1: 'hsl(300 95% 80%)',
        primaryGradient2: 'hsl(346 96% 77%)',
        primaryGradient3: 'hsl(358 97% 60%)',
        secondaryGradient1: 'hsl(191 96% 89%)',
        secondaryGradient2: 'hsl(232 96% 89%)',
        secondaryGradient3: 'hsl(282 97% 88%)',
        cardGradient1: 'rgba(148, 152, 240, 0.1)',
        cardGradient2: 'rgba(223, 92, 208, 0.1)',
        cardGradient3: 'rgba(232, 98, 98, 0.1)',

        textPrimary: '$gray10',
        textSecondary: '$gray7',
        textTertiary: '$gray6',

        bgColor: '$gray1',
        headerContainerBg: 'rgba(255, 255, 255, 0.6)',
        separator: '$blue1',
        inlineCodeBg: '$gray3',
        codeBlockBg: '$gray2',
        tableBorder: '$gray4',
        blockquoteBorder: '$gray6',
        hr: '$gray4',
        tooltipColor: '$primaryGradient2',
        tooltipBg: '$gray1',
      },
      zIndices: {
        texture: 100,
      },
      sizes: {
        contentWidth: '700px',
        navItemSize: '2.5rem',
      },
      radii: {
        xs: '4px',
        sm: '6px',
      },
    },
    media: {
      sm: '(max-width: 767.98px)',
      md: '(max-width: 991.98px)',
      lg: '(max-width: 1199.98px)',
      xl: '(max-width: 1399.98px)',
    },
    utils: {
      py: (value: string | number) => ({
        paddingTop: value,
        paddingBottom: value,
      }),
      px: (value: string | number) => ({
        paddingLeft: value,
        paddingRight: value,
      }),
      my: (value: string | number) => ({
        marginTop: value,
        marginBottom: value,
      }),
    },
  });

export const darkTheme = createTheme('dark', {
  colors: {
    textPrimary: '$gray3',
    textSecondary: '$gray4',
    textTertiary: '$gray5',
    bgColor: '$gray9',
    headerContainerBg: 'rgba(22,22,22, 0.6)',
    inlineCodeBg: '$gray8',
    codeBlockBg: '$gray10',
    hr: '$gray7',
    blockquoteBorder: '$gray5',
    tooltipColor: '$secondaryGradient3',
    tooltipBg: '$gray10',
  },
});
