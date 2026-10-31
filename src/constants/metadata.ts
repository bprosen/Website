import { EMPLOYER, FULL_NAME, HOME_CITY_SHORT, JOB_TITLE } from './profile';

export const TITLE_SEPARATOR = ' · ';
export const SITE_TITLE = `${FULL_NAME}${TITLE_SEPARATOR}${JOB_TITLE}`;
export const SITE_DESCRIPTION = `${FULL_NAME} is a ${JOB_TITLE} at ${EMPLOYER} in ${HOME_CITY_SHORT} who takes products from first idea to launch.`;
export const OG_DESCRIPTION = `${JOB_TITLE} at ${EMPLOYER} in ${HOME_CITY_SHORT}. I\u00a0take products from first idea to launch.`;
export const OG_IMAGE = {
  alt: SITE_TITLE,
  height: 630,
  url: '/opengraph-image',
  width: 1200,
} as const;
