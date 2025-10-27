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
  // Ensure trailing slashes are handled correctly
  trailingSlash: false,
  // Let Netlify handle the output format
  // output: undefined, // Removing this line
  // Disable Lightning CSS for CSS minification to resolve native module issues
  experimental: {
    optimizeCss: false, // This often disables lightningcss usage for css minification
  },
  webpack: (config, { isServer }) => {
    // Additional webpack configurations if needed
    return config;
  },
}

export default nextConfig
