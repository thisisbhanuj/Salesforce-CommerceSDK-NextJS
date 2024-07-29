/* eslint-disable @typescript-eslint/no-var-requires */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  generateEtags: true,
  reactStrictMode: true,
  optimizeFonts: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  experimental: {
    instrumentationHook: false,
    serverMinification: true,
    serverSourceMaps: false,
    webpackBuildWorker: true,
    workerThreads: true,
    parallelServerCompiles: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        'mongodb-client-encryption': false,
        aws4: false, //https://stackoverflow.com/questions/68610456/module-not-found-cant-resolve-aws4
      };
    }

    return config;
  },
  eslint: {
    ignoreDuringBuilds: false,
    dirs: [
      'app',
      'actions',
      'pages',
      'components',
      'utils',
      'hooks',
      'utility',
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

module.exports = withBundleAnalyzer(nextConfig);
