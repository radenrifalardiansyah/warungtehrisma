import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  experimental: {
    outputFileTracingIncludes: {
      '/api/admin/invoice-pdf': ['./src/assets/images/**'],
    },
  },
};

export default nextConfig;
