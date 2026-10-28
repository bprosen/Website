export const COLORS = {
  coral: '#e4704f',
  ink: '#17201a',
  paper: '#f4f1e8',
  sage: '#bfe0b8',
} as const;

export const ICON_STROKE = 1.8;
export const PLACEHOLDER_ICON_STROKE = 1.5;
export const CLOCK_TICK_MS = 1000;
export const CLOCK_TICK_SLACK_MS = 5;

export const INTRO_LETTER_STEP_MS = 40;

export const DARK_PAPER = '#121914';
export const THEME_STORAGE_KEY = 'theme';
export const THEME_DARK_CLASS = 'dark';
export const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';
export const THEME_REVEAL_MS = 650;
export const THEME_REVEAL_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
export const DARK_BRAND_LUMINANCE = 0.05;

export const DISPLAY_FONT = {
  file: 'src/assets/fonts/Fraunces-Bold.ttf',
  name: 'Fraunces',
  weight: 700,
} as const;

export const BODY_FONT = {
  file: 'src/assets/fonts/DMSans-Regular.ttf',
  name: 'DM Sans',
  weight: 400,
} as const;
