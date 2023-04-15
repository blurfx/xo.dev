import { styled } from '~/stitches.config';

const Content = styled('div', {
  wordBreak: 'keep-all',
  a: {
    textDecorationColor: '$textSecondary',
    textDecoration: 'underline',
    '&:hover': {
      textDecorationThickness: '2px',
    },
  },
  blockquote: {
    borderLeft: '2px solid $blockquoteBorder',
    paddingLeft: '1rem',
    color: '$textSecondary',
  },
  h1: {
    marginBottom: '0.75rem',

    fontSize: '1.25rem',
    fontWeight: '600',
    '&:not(:first-child)': {
      marginTop: '1.75rem',
    },
  },
  'h2, h3, h4, h5, h6': {
    marginBottom: '0.5rem',
    fontSize: '1rem',
    '&:is(h2)': {
      fontSize: '1.125rem',
    },
    fontWeight: 500,
    '&:not(:first-child)': {
      marginTop: '1.5rem',
    },
  },
  ':is(h3, h4, h5, h6):not(:first-child)': {
    marginTop: '1.25rem',
  },
  'pre, code': {
    fontSize: '1rem',
    overflow: 'auto',
  },
  'ul, ol': {
    marginLeft: '1rem',

    'ul, ol': {
      marginLeft: '1.5rem',
    },

    li: {
      my: '0.75rem',

      p: {
        margin: 0,
      },
    },
  },
  table: {
    width: '100%',
    marginTop: '0.75rem',
    marginBottom: '0.75rem',
    borderCollapse: 'collapse',

    lineHeight: 1.75,
  },
  tr: {
    borderBottom: '1px solid $tableBorder',
  },
  th: {
    py: '0.75rem',

    textAlign: 'justify',
  },
  td: {
    py: '0.75rem',
  },
  p: {
    lineHeight: 1.75,
    marginBottom: '1.25rem',
    code: {
      whiteSpace: 'pre-wrap',
    },
  },
  code: {
    'span.line': {
      lineHeight: 1.5,
    },
  },
  hr: {
    border: 0,
    borderTop: '1px solid $hr',
    my: '0.5rem',
  },
  pre: {
    my: '1rem',
    padding: '1rem',
    borderRadius: '$xs',
    backgroundColor: '$codeBlockBg',
  },
  ':not(pre) > code': {
    padding: '0.25rem',
    borderRadius: '$xs',
    backgroundColor: '$inlineCodeBg',
  },
});

export default Content;
