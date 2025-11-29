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
  },
  // Оптимизация минификации
  swcMinify: true,
  // Оптимизация импортов (только легкие библиотеки)
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
