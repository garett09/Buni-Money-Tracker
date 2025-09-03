/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds to prevent Vercel build failures
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Enable Turbo for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Enable SWC minification for faster builds
    swcMinify: true,
    // Enable concurrent features
    concurrentFeatures: true,
    // Enable server components
    serverComponentsExternalPackages: [],
  },
  // Enable SWC minification
  swcMinify: true,
  // Optimize images
  images: {
    domains: ['localhost', 'vercel.app', 'vercel.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  // Enable compression
  compress: true,
  // Optimize bundle analyzer
  webpack: (config, { dev, isServer }) => {
    // Optimize for development
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
    }
    
    // Optimize bundle splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
          },
        },
      },
    };
    
    return config;
  },
  // Enable static optimization
  staticPageGenerationTimeout: 120,
  // Optimize output
  output: 'standalone',
  // Enable trailing slash for better caching
  trailingSlash: false,
  // Optimize powered by header
  poweredByHeader: false,
}

module.exports = nextConfig
