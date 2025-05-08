import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['embed.permit.io',
      'cdn-icons-png.flaticon.com'
    ],
  },
  poweredByHeader: false,
};

export default nextConfig;
