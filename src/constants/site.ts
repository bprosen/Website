import type { LatLon, Section } from '~/types';

export const FIRST_NAME = 'Ben';
export const LAST_NAME = 'Edgar-Prosen';
export const NAME = `${FIRST_NAME} ${LAST_NAME}`;
export const SITE_URL = 'https://bprosen.dev';
export const SITE_TITLE = `${NAME} · Software Developer`;
export const SITE_DESCRIPTION =
  'Ben Edgar-Prosen is a software developer at Taiv in Winnipeg, building fast, well-tested apps.';
export const OG_DESCRIPTION =
  'Software developer at Taiv in Winnipeg, building fast, well-tested apps.';

export const EMAIL = 'benedgarprosen@gmail.com';
export const MAILTO = `mailto:${EMAIL}`;
export const GITHUB = 'https://github.com/bprosen';
export const LINKED_IN = 'https://www.linkedin.com/in/ben-edgar-prosen/';
export const RESUME_PATH = '/resume.pdf';

export const HOME_CITY_SHORT = 'Winnipeg';
export const HOME_CITY = `${HOME_CITY_SHORT}, Canada`;
export const HOME_TZ = 'America/Winnipeg';
export const HOME_COORDS: LatLon = [49.9, -97.14];

export const SECTIONS = [
  { label: 'Work', slug: 'work' },
  { label: 'About', slug: 'about' },
  { label: 'Contact', slug: 'contact' },
] as const satisfies readonly Section[];

export const HERO_TAGLINE =
  "Software developer at Taiv. I build fast, well-tested apps, and I've been shipping to real users since 2019.";

export const CONTACT_HEADING = "Let's talk";
export const CONTACT_COPY =
  "Whether it's a question, an idea or just to say hi, my inbox is always open.";
