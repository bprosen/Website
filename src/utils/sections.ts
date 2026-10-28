import { SECTIONS } from '~/constants';

export type SectionSlug = (typeof SECTIONS)[number]['slug'];

const SLUGS: readonly string[] = SECTIONS.map(({ slug }) => slug);

export const isSectionSlug = (value: unknown): value is SectionSlug =>
  typeof value === 'string' && SLUGS.includes(value);

export const sectionPath = (section: SectionSlug | null) =>
  section ? `/${section}` : '/';

export const sectionFromPath = (pathname: string): SectionSlug | null => {
  const slug = pathname.replace(/^\/+|\/+$/g, '');
  return isSectionSlug(slug) ? slug : null;
};

export const sectionFromParams = (
  segments: readonly string[] | undefined,
): SectionSlug | null | undefined => {
  if (!segments || segments.length === 0) {
    return null;
  }

  return segments.length === 1 && isSectionSlug(segments[0])
    ? segments[0]
    : undefined;
};

type ClickLike = {
  altKey: boolean;
  button: number;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
};

export const isPlainLeftClick = (event: ClickLike) =>
  event.button === 0 &&
  !event.altKey &&
  !event.ctrlKey &&
  !event.metaKey &&
  !event.shiftKey;

export const scrollToSection = (
  section: SectionSlug | null,
  behavior: ScrollBehavior = 'auto',
) => {
  if (!section) {
    window.scrollTo({ behavior, top: 0 });
    return true;
  }

  const target = document.getElementById(section);

  if (!target) {
    return false;
  }

  target.scrollIntoView({ behavior, block: 'start' });
  target.focus({ preventScroll: true });
  return true;
};
