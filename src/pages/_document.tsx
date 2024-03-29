import { Html, Head, Main, NextScript } from 'next/document';

import { getCssText } from '~/stitches.config';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel={'icon'} sizes='32x32' href={'/favicon32.png'} />
        <link rel={'icon'} sizes='96x96' href={'/favicon96.png'} />
        <style dangerouslySetInnerHTML={{ __html: getCssText() }} />
        <link rel='stylesheet'
          href='https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css'
          crossOrigin='anonymous'
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
