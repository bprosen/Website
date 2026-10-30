import {
  EMPLOYER,
  FULL_NAME,
  GITHUB_URL,
  HOME_CITY_SHORT,
  HOME_COUNTRY,
  HOME_REGION,
  JOB_TITLE,
  LINKEDIN_URL,
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
  name: FULL_NAME,
  sameAs: [GITHUB_URL, LINKEDIN_URL],
  url: SITE_URL,
  worksFor: { '@type': 'Organization', name: EMPLOYER },
});

export const serializeStructuredData = (data: unknown) =>
  JSON.stringify(data).replaceAll('<', '\\u003c');
