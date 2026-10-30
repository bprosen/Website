import {
  COLORS,
  DARK_BRAND_LUMINANCE_THRESHOLD,
  DARK_PAPER,
  DARK_SCHEME_QUERY,
  THEME_COLOR_SELECTOR,
  THEME_DARK_CLASS,
  THEME_STORAGE_KEY,
} from '~/constants';
import type { Theme } from '~/types';

export const isTheme = (value: unknown): value is Theme =>
  value === 'dark' || value === 'light';

const systemTheme = (prefersDark: boolean): Theme =>
  prefersDark ? 'dark' : 'light';

export const resolveTheme = (stored: unknown, prefersDark: boolean): Theme =>
  isTheme(stored) ? stored : systemTheme(prefersDark);

export const oppositeTheme = (theme: Theme): Theme =>
  theme === 'dark' ? 'light' : 'dark';

export const themeColorFor = (theme: Theme) =>
  theme === 'dark' ? DARK_PAPER : COLORS.paper;

export const themeInitScript = () =>
  `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});var d=t==='dark'||(t!=='light'&&matchMedia(${JSON.stringify(DARK_SCHEME_QUERY)}).matches);document.documentElement.classList.toggle(${JSON.stringify(THEME_DARK_CLASS)},d);document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll(${JSON.stringify(THEME_COLOR_SELECTOR)}).forEach(function(m){m.setAttribute('content',d?${JSON.stringify(themeColorFor('dark'))}:${JSON.stringify(themeColorFor('light'))})})})}catch(e){}`;

export const revealRadius = (
  x: number,
  y: number,
  width: number,
  height: number,
) => Math.hypot(Math.max(x, width - x), Math.max(y, height - y));

export const revealClipPath = (x: number, y: number, radius: number) => [
  `circle(0px at ${x}px ${y}px)`,
  `circle(${radius}px at ${x}px ${y}px)`,
];

const linearizeChannel = (hex: string, offset: number) => {
  const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

export const relativeLuminance = (hex: string) => {
  const clean = hex.replace('#', '');
  return (
    0.2126 * linearizeChannel(clean, 0) +
    0.7152 * linearizeChannel(clean, 2) +
    0.0722 * linearizeChannel(clean, 4)
  );
};

export const isDarkBrand = (hex: string) =>
  relativeLuminance(hex) < DARK_BRAND_LUMINANCE_THRESHOLD;
