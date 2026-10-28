import {
  EMPLOYER,
  GITHUB,
  HOME_CITY_SHORT,
  HOME_COUNTRY,
  HOME_REGION,
  JOB_TITLE,
  LINKED_IN,
  NAME,
  PORTRAIT,
  SCHOOL,
  SITE_URL,
} from '~/constants';

export const personStructuredData = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  address: {
    '@type': 'PostalAddress',
    addressCountry: HOME_COUNTRY,
    addressLocality: HOME_CITY_SHORT,
    addressRegion: HOME_REGION,
  },
  alumniOf: { '@type': 'CollegeOrUniversity', name: SCHOOL },
  image: `${SITE_URL}${PORTRAIT.src}`,
  jobTitle: JOB_TITLE,
  name: NAME,
  sameAs: [GITHUB, LINKED_IN],
  url: SITE_URL,
  worksFor: { '@type': 'Organization', name: EMPLOYER },
});

export const serializeStructuredData = (data: unknown) =>
  JSON.stringify(data).replace(/</g, '\\u003c');
