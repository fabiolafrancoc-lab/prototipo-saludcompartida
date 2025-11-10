import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://saludcompartida.com',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://saludcompartida.com https://*.saludcompartida.com https://*.vercel.app",
          },
        ],
      },
    ];
  },
};

export default nextConfig;