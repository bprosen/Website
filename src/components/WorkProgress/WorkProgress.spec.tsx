import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WORK, WORK_SECTION_ID } from '~/constants';
import { WorkProgress } from './WorkProgress';

const READING_LINE = window.innerHeight / 2;
const ENTRY_HEIGHT = 400;

let scrollY = 0;

const place = (element: Element, top: number, height: number) =>
  vi.spyOn(element, 'getBoundingClientRect').mockImplementation(
    () =>
      ({
        bottom: top - scrollY + height,
        height,
        top: top - scrollY,
      }) as DOMRect,
  );

const buildPage = () => {
  const section = document.createElement('section');
  section.id = WORK_SECTION_ID;
  place(section, 1000, ENTRY_HEIGHT * WORK.length);

  WORK.forEach(({ id }, index) => {
    const entry = document.createElement('div');
    entry.dataset.workEntry = id;
    place(entry, 1000 + index * ENTRY_HEIGHT, ENTRY_HEIGHT);
    section.append(entry);
  });

  document.body.append(section);
};

const scrollTo = (y: number) =>
  act(() => {
    scrollY = y;
    window.dispatchEvent(new Event('scroll'));
  });

const renderBar = () => {
  const { container } = render(<WorkProgress />);
  const bar = container.firstElementChild as HTMLElement;
  const fills = [...bar.querySelectorAll<HTMLElement>('[data-fill]')];
  return { bar, fills };
};

describe('WorkProgress', () => {
  beforeEach(() => {
    scrollY = 0;
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
    buildPage();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('draws one hidden segment per role at the top of the page', () => {
    const { bar, fills } = renderBar();

    expect(bar).toHaveAttribute('aria-hidden', 'true');
    expect(bar).toHaveAttribute('data-active', 'false');
    expect(fills).toHaveLength(WORK.length);
    expect(fills.map((fill) => fill.style.transform)).toEqual(
      WORK.map(() => 'scaleX(0)'),
    );
  });

  it('fills completed roles and part of the current one while in Work', () => {
    const { bar, fills } = renderBar();

    scrollTo(1000 - READING_LINE + ENTRY_HEIGHT * 1.5);

    expect(bar).toHaveAttribute('data-active', 'true');
    expect(fills.map((fill) => fill.style.transform)).toEqual([
      'scaleX(1)',
      'scaleX(0.5)',
      'scaleX(0)',
      'scaleX(0)',
    ]);
  });

  it('completes the last role while it is still being read, then hides', () => {
    const { bar, fills } = renderBar();
    const workEnd = 1000 + ENTRY_HEIGHT * WORK.length;

    scrollTo(workEnd - READING_LINE - 1);
    expect(bar).toHaveAttribute('data-active', 'true');
    expect(fills.at(-1)?.style.transform).toBe(
      `scaleX(${(ENTRY_HEIGHT - 1) / ENTRY_HEIGHT})`,
    );

    scrollTo(workEnd - READING_LINE + 1);
    expect(bar).toHaveAttribute('data-active', 'false');
  });

  it('stops listening on unmount', () => {
    const removeListener = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<WorkProgress />);

    unmount();

    expect(removeListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
