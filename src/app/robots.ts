import type { MetadataRoute } from 'next';
import { SITE_URL } from '~/constants';

const robots = (): MetadataRoute.Robots => ({
  rules: { allow: '/', disallow: '/api/', userAgent: '*' },
  sitemap: `${SITE_URL}/sitemap.xml`,
});

export default robots;
