import { describe, expect, it } from 'vitest';
import {
  personStructuredData,
  serializeStructuredData,
} from './structuredData';

describe('personStructuredData', () => {
  it('describes the site owner as a schema.org Person', () => {
    expect(personStructuredData()).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Person',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'CA',
        addressLocality: 'Winnipeg',
        addressRegion: 'MB',
      },
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'University of Manitoba',
      },
      image: 'https://bprosen.dev/photos/portrait.jpg',
      jobTitle: 'Software Developer',
      name: 'Ben Edgar-Prosen',
      sameAs: [
        'https://github.com/bprosen',
        'https://www.linkedin.com/in/ben-edgar-prosen/',
      ],
      url: 'https://bprosen.dev',
      worksFor: { '@type': 'Organization', name: 'Taiv' },
    });
  });
});

describe('serializeStructuredData', () => {
  it('escapes angle brackets so the JSON cannot close its script tag', () => {
    const json = serializeStructuredData({ name: '</script><b>' });

    expect(json).not.toContain('<');
    expect(JSON.parse(json)).toEqual({ name: '</script><b>' });
  });
});
