import type { MetadataRoute } from 'next';
import { SITE_URL } from '~/constants';
import { sectionPath } from '~/utils';

const sitemap = (): MetadataRoute.Sitemap => [
  { url: `${SITE_URL}${sectionPath(null)}` },
];

export default sitemap;
