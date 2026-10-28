import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.*.*.*', '192.168.*.*', '*.local'],
};

export default nextConfig;
