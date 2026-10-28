import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SectionLink } from './SectionLink';

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

const renderWithSection = () =>
  render(
    <>
      <SectionLink section='work'>Work</SectionLink>
      <section id='work' tabIndex={-1} />
    </>,
  );

describe('SectionLink', () => {
  it('links to the section URL', () => {
    renderWithSection();

    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute(
      'href',
      '/work',
    );
  });

  it('scrolls in place and updates the URL on a plain click', () => {
    renderWithSection();
    const link = screen.getByRole('link', { name: 'Work' });

    const allowed = fireEvent.click(link);

    expect(allowed).toBe(false);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    expect(window.location.pathname).toBe('/work');
  });

  it("doesn't push a duplicate history entry", () => {
    renderWithSection();
    const push = vi.spyOn(window.history, 'pushState');
    window.history.replaceState(null, '', '/work');

    fireEvent.click(screen.getByRole('link', { name: 'Work' }));

    expect(push).not.toHaveBeenCalled();
  });

  it('leaves modifier clicks to the browser', () => {
    renderWithSection();

    expect(
      fireEvent.click(screen.getByRole('link', { name: 'Work' }), {
        metaKey: true,
      }),
    ).toBe(true);
    expect(window.location.pathname).toBe('/');
  });

  it('navigates normally when the section is not on the page', () => {
    render(<SectionLink section='about'>About</SectionLink>);

    expect(fireEvent.click(screen.getByRole('link', { name: 'About' }))).toBe(
      true,
    );
  });

  it('respects a caller that prevents the click', () => {
    renderWithSection();
    const onClick = vi.fn((event: { preventDefault: () => void }) =>
      event.preventDefault(),
    );
    render(
      <SectionLink onClick={onClick} section='work'>
        Again
      </SectionLink>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Again' }));

    expect(onClick).toHaveBeenCalled();
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  it('scrolls to the top for the home link', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    window.history.replaceState(null, '', '/about');
    render(<SectionLink section={null}>Home</SectionLink>);

    fireEvent.click(screen.getByRole('link', { name: 'Home' }));

    expect(scrollTo).toHaveBeenCalledWith({ behavior: 'auto', top: 0 });
    expect(window.location.pathname).toBe('/');
  });
});
