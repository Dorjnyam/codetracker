import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  
  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Fix multiple lockfiles warning
  outputFileTracingRoot: __dirname,
  
  // Server external packages (moved from experimental in Next.js 14)
  serverExternalPackages: ['@prisma/client'],
  
  // Image optimization
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com', 'cdn.discordapp.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Webpack configuration for Monaco Editor (only when not using Turbopack)
  webpack: (config, { isServer, dev }) => {
    // Only apply webpack config when not using Turbopack
    if (!dev || process.env.TURBOPACK !== '1') {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
        };
      }
    }
    return config;
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Redirects for better UX
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/overview',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
