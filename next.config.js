/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },

  images: {
    formats: ['image/avif', 'image/webp', "image/png", "image/jpg", "image/jpeg", "image/gif"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/livfieapp.appspot.com/o/**',
      },
    ],
  },
}

module.exports = nextConfig

module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
};
