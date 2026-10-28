import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  isPlainLeftClick,
  isSectionSlug,
  scrollToSection,
  sectionFromParams,
  sectionFromPath,
  sectionPath,
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
