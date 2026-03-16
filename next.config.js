/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Increase header size limits
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
      ],
    },
  ],
  // Add allowed hosts/domains for dev
  basePath: '',
  // Suppress experimental warnings if needed
};

module.exports = nextConfig;

module.exports = nextConfig;

