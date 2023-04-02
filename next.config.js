const { withContentlayer } = require('next-contentlayer');

module.exports = withContentlayer({
  async redirects() {
    return [
      {
        source: '/:path((?!^articles$)[^/]+)',
        destination: '/articles/:path*',
        permanent: true,
      },
    ];
  },
});
