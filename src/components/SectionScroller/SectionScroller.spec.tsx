import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SectionScroller } from './SectionScroller';

const scrollIntoView = vi.fn<Element['scrollIntoView']>();

beforeEach(() => {
  scrollIntoView.mockReset();
  Element.prototype.scrollIntoView = scrollIntoView;
  document.body.innerHTML =
    '<section id="work" tabindex="-1"></section><section id="about" tabindex="-1"></section>';
});

afterEach(() => {
  window.history.replaceState(null, '', '/');
  vi.restoreAllMocks();
});

describe('SectionScroller', () => {
  it('jumps straight to the route section on load', () => {
    render(<SectionScroller section='about' />);

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'instant',
      block: 'start',
    });
  });

  it('does nothing on the home route', () => {
    render(<SectionScroller section={null} />);

    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('follows back and forward between section URLs', () => {
    render(<SectionScroller section={null} />);
    window.history.replaceState(null, '', '/work');

    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'auto',
      block: 'start',
    });
  });

  it('stops listening when unmounted', () => {
    const { unmount } = render(<SectionScroller section={null} />);
    unmount();

    window.dispatchEvent(new PopStateEvent('popstate'));

    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('leaves fragment links to the browser on load', () => {
    window.history.replaceState(null, '', '/work#w3');
    render(<SectionScroller section='work' />);

    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('keeps a scroll position the browser restored', () => {
    const scrollY = vi.spyOn(window, 'scrollY', 'get').mockReturnValue(400);
    render(<SectionScroller section='work' />);

    expect(scrollIntoView).not.toHaveBeenCalled();
    scrollY.mockRestore();
  });

  it('ignores popstate from fragment navigation', () => {
    render(<SectionScroller section={null} />);
    window.history.replaceState(null, '', '/#w2');

    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
