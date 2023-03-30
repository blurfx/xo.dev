import { useTheme } from 'next-themes';
import { createRef, useEffect } from 'react';

import { BlogConfig } from '../../../blog.config';

const src = 'https://utteranc.es/client.js';
const branch = 'master';

const sendMessage = (message: Record<string, unknown>) => {
  const iframe: HTMLIFrameElement | null = document.querySelector(
    'iframe.utterances-frame',
  );
  iframe?.contentWindow?.postMessage(message, 'https://utteranc.es');
};

const Utterances = () => {
  const ref = createRef<HTMLDivElement>();
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'light' ? 'github-light' : 'github-dark';

  useEffect(() => {
    const script = document.createElement('script');
    const config = {
      src,
      branch,
      theme,
      repo: BlogConfig.comment?.repo,
      label: 'comment',
      async: true,
      crossorigin: 'anonymous',
      'issue-term': 'pathname',
    };

    Object.entries(config).forEach(([key, value]) => {
      script.setAttribute(key, `${value}`);
    });

    ref.current?.childNodes.forEach((children) => {
      ref.current?.removeChild(children);
    });

    ref.current?.appendChild(script);

    return () => {
      ref.current?.childNodes.forEach((children) => {
        ref.current?.removeChild(children);
      });
    };
  }, []);

  useEffect(() => {
    sendMessage({
      type: 'set-theme',
      theme,
    });
  }, [theme]);

  if (BlogConfig.comment?.type !== 'utterances') {
    return null;
  }
  return <div className='utterances' ref={ref} />;
};

export default Utterances;
