import { describe, expect, it } from 'vitest';
import robots from './robots';

describe('robots', () => {
  it('allows the site, hides the API and points to the sitemap', () => {
    expect(robots()).toEqual({
      rules: { allow: '/', disallow: '/api/', userAgent: '*' },
      sitemap: 'https://bprosen.dev/sitemap.xml',
    });
  });
});
