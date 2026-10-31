import type { NextConfig } from 'next';

const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), geolocation=(), microphone=()',
  },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.*.*.*', '192.168.*.*', '*.local'],
  headers: async () => [{ headers: SECURITY_HEADERS, source: '/:path*' }],
  poweredByHeader: false,
};

export default nextConfig;
