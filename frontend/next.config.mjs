// import type { NextConfig } from 'next'

const nextConfig = {
  webpack: (config) => {
    // Handle TensorFlow.js WASM files
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    }
    
    // Handle TensorFlow.js specific modules
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    })
    
    return config
  },
  // Enable static file serving for TensorFlow.js models
  async headers() {
    return [
      {
        source: '/models/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig
