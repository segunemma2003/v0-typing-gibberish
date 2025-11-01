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
  // Uncomment below for standalone output (better for VPS, but requires PM2 script update)
  // output: 'standalone',
  // Explicitly configure CSS processing to use cssnano to bypass lightningcss issues
  webpack: (config, { isServer, defaultLoaders }) => {
    // Only apply this customization for CSS minification during the build process
    if (!isServer && config.optimization && config.optimization.minimizer) {
      const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
      config.optimization.minimizer = config.optimization.minimizer.map((minimizer) => {
        if (minimizer.constructor.name === 'CssMinimizerPlugin') {
          return new CssMinimizerPlugin({
            minimizerOptions: {
              preset: 'default',
            },
          });
        }
        return minimizer;
      });
    }
    return config;
  },
}

export default nextConfig
