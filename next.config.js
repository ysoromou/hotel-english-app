/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimisations pour smartphones bas de gamme
  reactStrictMode: true,
  // Les images passent par Next.js pour être optimisées automatiquement
  images: {
    formats: ['image/webp'],
  },
}

module.exports = nextConfig
