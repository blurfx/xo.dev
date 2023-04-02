const { withContentlayer } = require('next-contentlayer');

module.exports = withContentlayer({
  async redirects() {
    return [
      {
      // What the user typed in the browser
        source: '/:path((?!articles|feed|sitemap)[^./]+)',
        // Where the user will be redirected to
        destination: '/articles/:path*',
        // If the destination is a permanent redirect (308)
        permanent: true
      }
    ];
  }
});
