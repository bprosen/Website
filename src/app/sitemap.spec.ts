import { describe, expect, it } from 'vitest';
import sitemap from './sitemap';

describe('sitemap', () => {
  it('lists only the canonical home page, since sections are the same page', () => {
    expect(sitemap().map(({ url }) => url)).toEqual(['https://bprosen.dev/']);
  });
});
