import Script from 'next/script';

import { BlogConfig } from '../../blog.config';

const GoogleAnalytics = () => {
  if (BlogConfig.googleAnalyticsId == null) {
    return null;
  }
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${BlogConfig.googleAnalyticsId}`}
        strategy='afterInteractive'
      />
      <Script id='google-analytics' strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${BlogConfig.googleAnalyticsId}');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
