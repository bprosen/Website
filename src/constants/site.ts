import type { LatLon, Section } from '~/types';

export const FIRST_NAME = 'Ben';
export const LAST_NAME = 'Edgar-Prosen';
export const NAME = `${FIRST_NAME} ${LAST_NAME}`;
export const SITE_URL = 'https://bprosen.dev';
export const SITE_DOMAIN = 'bprosen.dev';
export const SITE_TITLE = `${NAME} · Software Developer`;
export const SITE_DESCRIPTION =
  'Ben Edgar-Prosen is a Software Developer at Taiv in Winnipeg who takes products from first idea to launch.';
export const OG_IMAGE = {
  alt: SITE_TITLE,
  height: 630,
  url: '/opengraph-image',
  width: 1200,
};

export const OG_DESCRIPTION =
  'Software Developer at Taiv in Winnipeg. I take products from first idea to launch.';

export const EMAIL = 'benedgarprosen@gmail.com';
export const MAILTO = `mailto:${EMAIL}`;
export const GITHUB = 'https://github.com/bprosen';
export const LINKED_IN = 'https://www.linkedin.com/in/ben-edgar-prosen/';
export const RESUME_PATH = '/Ben-Edgar-Prosen-Resume.pdf';
export const MOMENTUM_REPO = 'https://github.com/bprosen/Momentum';
export const SITE_REPO = 'https://github.com/bprosen/Website';
export const GITHUB_LINK_CONTEXT = 'on GitHub';

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
  'Software Developer at Taiv. I take products from first idea to launch, and before that I built and ran a game server for 2M+ players.';

export const CONTACT_HEADING = "Let's talk";
export const CONTACT_COPY =
  "Whether it's a question, an idea or just to say hi, my inbox is always open.";

export const SECTION_ACTIVE_LINE = 1 / 3;
export const PAGE_END_TOLERANCE_PX = 2;

export const NOT_FOUND_TITLE = "This page doesn't exist.";
export const NOT_FOUND_COPY =
  'It may have moved, or the link might be mistyped.';
export const NOT_FOUND_ACTION = 'Back to the home page';

export const SKIP_LINK_LABEL = 'Skip to content';
export const MAIN_CONTENT_ID = 'main';

export const EMPLOYER = 'Taiv';
export const JOB_TITLE = 'Software Developer';
export const SCHOOL = 'University of Manitoba';
export const HOME_REGION = 'MB';
export const HOME_COUNTRY = 'CA';
export const COPY_EMAIL_LABEL = 'Copy email address';
export const COPIED_EMAIL_LABEL = 'Email address copied';
export const COPY_RESET_MS = 2000;

export const HERO_NAME_ID = 'hero-name';
export const SITE_HEADER_ID = 'site-header';
export const PHOTO_STRIP_SPEED_PX_PER_S = 17;
export const AUTO_SCROLL_RESUME_MS = 1500;
export const SCROLL_SYNC_TOLERANCE_PX = 1;
export const ENLARGE_MEDIA_LABEL = 'Enlarge';
export const CLOSE_DIALOG_LABEL = 'Close';
export const LIGHTBOX_MAX_VW = 92;
export const LIGHTBOX_MAX_SVH = 85;
export const REVEAL_SELECTOR = '[data-reveal], [data-reveal-group] > *';
export const REVEALED_ATTRIBUTE = 'data-revealed';
export const REVEAL_READY_CLASS = 'reveal-ready';
export const REVEAL_ROOT_MARGIN = '0px 0px -4% 0px';
export const WORK_SECTION_ID = 'work';
