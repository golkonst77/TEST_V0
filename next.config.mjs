/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    formats: ['image/webp'], // WebP для меньшего размера
  },
  // Оптимизация минификации
  swcMinify: true,
  // Компрессия
  compress: true,
  // Оптимизация импортов
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Powering up Next.js
  poweredByHeader: false, // Убрать X-Powered-By header
  // Оптимизация production
  productionBrowserSourceMaps: false,
  // Настройки webpack для production
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Оптимизации для клиента
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk для библиотек
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk для переиспользуемого кода
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      }
    }
    return config
  },
}

export default nextConfig
