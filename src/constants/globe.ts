import { HOME_CITY_SHORT } from './profile';

export const GLOBE_RADIUS = 90;
export const GLOBE_VIEWBOX_SIZE = 200;
export const GLOBE_MIN_VISIBLE_COSINE = 0.02;
export const GLOBE_MAX_DPR = 2;
export const EARTH_DIAMETER_KM = 12742;

export const GLOBE_INITIAL_VIEW = { lat: 24, lon: -97.1 };
export const GLOBE_AUTO_SPIN_DEG_PER_SECOND = 9;
export const GLOBE_INTRO_SPIN_DEG_PER_SECOND = 300;
export const GLOBE_LON_DAMPING = 0.9;
export const GLOBE_LAT_DAMPING = 1.6;
export const GLOBE_LAT_LIMIT = 70;
export const GLOBE_REST_SPEED = 0.01;
export const GLOBE_SEEK_RATE_PER_SECOND = 4;
export const GLOBE_MAX_STEP_SECONDS = 0.2;

export const GLOBE_DRAG_THRESHOLD_PX = 4;
export const GLOBE_DRAG_LON_PER_PX = 0.6;
export const GLOBE_DRAG_LAT_PER_PX = 0.4;
export const GLOBE_MIN_DRAG_STEP_SECONDS = 0.008;
export const GLOBE_FLING_NEWEST_WEIGHT = 0.35;
export const GLOBE_MAX_FLING_SPEED = 500;
export const GLOBE_FLING_WINDOW_MS = 90;

export const GLOBE_KEY_STEP_LON = 10;
export const GLOBE_KEY_STEP_LAT = 8;

export const GLOBE_LAND_DOT_RADIUS = 1.3;
export const GLOBE_VISITOR_DOT_RADIUS = 2;
export const GLOBE_VISITOR_DOT_ALPHA = 0.7;
export const GLOBE_HIT_RADIUS = 13;
export const GLOBE_TOOLTIP_VIEWPORT_MARGIN = 12;

export const GLOBE_CARD_QUERY = '(min-width: 40rem)';

export const GLOBE_LABEL = `A globe with a marker on ${HOME_CITY_SHORT}. Drag it, or use the arrow keys, to spin it.`;
