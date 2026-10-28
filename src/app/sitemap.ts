import type { MetadataRoute } from 'next';
import { SECTIONS, SITE_URL } from '~/constants';
import { sectionPath } from '~/utils';

const sitemap = (): MetadataRoute.Sitemap =>
  [null, ...SECTIONS.map(({ slug }) => slug)].map((section) => ({
    url: `${SITE_URL}${sectionPath(section)}`,
  }));

export default sitemap;
