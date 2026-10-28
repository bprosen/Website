import { NAME, PAGE_END_TOLERANCE_PX, SECTIONS, SITE_TITLE } from '~/constants';

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

export type SectionTop = {
  slug: SectionSlug;
  top: number;
};

export const activeSection = (
  tops: readonly SectionTop[],
  line: number,
  atPageEnd = false,
): SectionSlug | null => {
  if (atPageEnd && tops.length > 0) {
    return tops[tops.length - 1].slug;
  }

  let active: SectionSlug | null = null;

  for (const { slug, top } of tops) {
    if (top <= line) {
      active = slug;
    }
  }

  return active;
};

export const sectionTitle = (section: SectionSlug | null) => {
  const match = SECTIONS.find(({ slug }) => slug === section);
  return match ? `${match.label} · ${NAME}` : SITE_TITLE;
};

export const isAtPageEnd = (
  scrollY: number,
  viewportHeight: number,
  pageHeight: number,
) => scrollY + viewportHeight >= pageHeight - PAGE_END_TOLERANCE_PX;
