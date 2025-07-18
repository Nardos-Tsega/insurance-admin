import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@gradio/client'],
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
};

export default nextConfig;