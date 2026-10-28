import { describe, expect, it } from 'vitest';
import robots from './robots';
import sitemap from './sitemap';

describe('robots', () => {
  it('allows the site, hides the API and points to the sitemap', () => {
    expect(robots()).toEqual({
      rules: { allow: '/', disallow: '/api/', userAgent: '*' },
      sitemap: 'https://bprosen.dev/sitemap.xml',
    });
  });
});

describe('sitemap', () => {
  it('lists home and every section URL', () => {
    expect(sitemap().map(({ url }) => url)).toEqual([
      'https://bprosen.dev/',
      'https://bprosen.dev/work',
      'https://bprosen.dev/about',
      'https://bprosen.dev/contact',
    ]);
  });
});
