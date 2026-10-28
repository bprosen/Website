import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  activeSection,
  isAtPageEnd,
  isPlainLeftClick,
  isSectionSlug,
  scrollToSection,
  sectionFromParams,
  sectionFromPath,
  sectionPath,
  sectionTitle,
} from './sections';

const click = {
  altKey: false,
  button: 0,
  ctrlKey: false,
  metaKey: false,
  shiftKey: false,
};

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('isSectionSlug', () => {
  it('accepts known sections only', () => {
    expect(isSectionSlug('work')).toBe(true);
    expect(isSectionSlug('about')).toBe(true);
    expect(isSectionSlug('contact')).toBe(true);
    expect(isSectionSlug('blog')).toBe(false);
    expect(isSectionSlug(undefined)).toBe(false);
  });
});

describe('sectionPath', () => {
  it('maps sections to their URL and null to home', () => {
    expect(sectionPath('work')).toBe('/work');
    expect(sectionPath(null)).toBe('/');
  });
});

describe('sectionFromPath', () => {
  it('reads the section from a pathname', () => {
    expect(sectionFromPath('/about')).toBe('about');
    expect(sectionFromPath('/about/')).toBe('about');
  });

  it('is null for home and unknown paths', () => {
    expect(sectionFromPath('/')).toBeNull();
    expect(sectionFromPath('/work/w1')).toBeNull();
    expect(sectionFromPath('/nope')).toBeNull();
  });
});

describe('sectionFromParams', () => {
  it('treats no segments as home', () => {
    expect(sectionFromParams(undefined)).toBeNull();
    expect(sectionFromParams([])).toBeNull();
  });

  it('resolves one known segment', () => {
    expect(sectionFromParams(['contact'])).toBe('contact');
  });

  it('is undefined for anything else, so the route 404s', () => {
    expect(sectionFromParams(['blog'])).toBeUndefined();
    expect(sectionFromParams(['work', 'w1'])).toBeUndefined();
  });
});

describe('isPlainLeftClick', () => {
  it('accepts an unmodified primary click', () => {
    expect(isPlainLeftClick(click)).toBe(true);
  });

  it('rejects other buttons and modifier clicks', () => {
    expect(isPlainLeftClick({ ...click, button: 1 })).toBe(false);
    expect(isPlainLeftClick({ ...click, metaKey: true })).toBe(false);
    expect(isPlainLeftClick({ ...click, ctrlKey: true })).toBe(false);
    expect(isPlainLeftClick({ ...click, shiftKey: true })).toBe(false);
    expect(isPlainLeftClick({ ...click, altKey: true })).toBe(false);
  });
});

describe('scrollToSection', () => {
  it('scrolls to and focuses the section', () => {
    document.body.innerHTML = '<section id="work" tabindex="-1"></section>';
    const section = document.getElementById('work') as HTMLElement;
    section.scrollIntoView = vi.fn();
    const focus = vi.spyOn(section, 'focus');

    expect(scrollToSection('work', 'instant')).toBe(true);
    expect(section.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'instant',
      block: 'start',
    });
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('scrolls to the top for home', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    expect(scrollToSection(null)).toBe(true);
    expect(scrollTo).toHaveBeenCalledWith({ behavior: 'auto', top: 0 });
  });

  it('reports a missing section', () => {
    expect(scrollToSection('about')).toBe(false);
  });
});

describe('activeSection', () => {
  const tops = (work: number, about: number, contact: number) => [
    { slug: 'work' as const, top: work },
    { slug: 'about' as const, top: about },
    { slug: 'contact' as const, top: contact },
  ];

  it('is home while every section is below the line', () => {
    expect(activeSection(tops(500, 2000, 4000), 300)).toBeNull();
  });

  it('picks the last section whose top has passed the line', () => {
    expect(activeSection(tops(-100, 900, 3000), 300)).toBe('work');
    expect(activeSection(tops(-2000, 300, 2000), 300)).toBe('about');
    expect(activeSection(tops(-5000, -2000, 100), 300)).toBe('contact');
  });

  it('handles missing sections', () => {
    expect(activeSection([], 300)).toBeNull();
  });
});

describe('activeSection at the end of the page', () => {
  it('picks the last section once the page is scrolled to the bottom', () => {
    const tops = [
      { slug: 'work' as const, top: -3000 },
      { slug: 'about' as const, top: -900 },
      { slug: 'contact' as const, top: 500 },
    ];

    expect(activeSection(tops, 300)).toBe('about');
    expect(activeSection(tops, 300, true)).toBe('contact');
  });

  it('is home when there are no sections', () => {
    expect(activeSection([], 300, true)).toBeNull();
  });
});

describe('isAtPageEnd', () => {
  it('detects the bottom of the page with a little tolerance', () => {
    expect(isAtPageEnd(1000, 800, 1800)).toBe(true);
    expect(isAtPageEnd(999, 800, 1800)).toBe(true);
    expect(isAtPageEnd(900, 800, 1800)).toBe(false);
  });
});

describe('sectionTitle', () => {
  it('titles each section and falls back to the site title', () => {
    expect(sectionTitle('contact')).toBe('Contact · Ben Edgar-Prosen');
    expect(sectionTitle(null)).toBe('Ben Edgar-Prosen · Software Developer');
  });
});
