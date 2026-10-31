import type { Section } from '~/types';

export const SECTIONS = [
  { label: 'Work', slug: 'work' },
  { label: 'About', slug: 'about' },
  { label: 'Contact', slug: 'contact' },
] as const satisfies readonly Section[];

type SectionId = (typeof SECTIONS)[number]['slug'];

export const WORK_SECTION_ID = 'work' satisfies SectionId;
export const ABOUT_SECTION_ID = 'about' satisfies SectionId;
export const CONTACT_SECTION_ID = 'contact' satisfies SectionId;

export const MAIN_CONTENT_ID = 'main';
export const HERO_NAME_ID = 'hero-name';
export const SITE_HEADER_ID = 'site-header';

export const SECTION_ACTIVE_LINE_VIEWPORT_RATIO = 1 / 3;
export const PAGE_END_TOLERANCE_PX = 2;
