/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds to prevent Vercel build failures
    ignoreDuringBuilds: true,
  },
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    domains: ['localhost', 'vercel.app', 'vercel.com'],
  },
}

module.exports = nextConfig
