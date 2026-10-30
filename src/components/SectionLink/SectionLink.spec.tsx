import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sectionTitle } from '~/utils';
import { SectionLink } from './SectionLink';

const scrollIntoView = vi.fn<Element['scrollIntoView']>();

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  document.title = '';
  scrollIntoView.mockReset();
  Element.prototype.scrollIntoView = scrollIntoView;
});

const clickWouldNavigate = async (link: HTMLElement, keys?: string) => {
  const user = userEvent.setup();
  let navigates = false;
  const record = (event: Event) => {
    navigates = !event.defaultPrevented;
    event.preventDefault();
  };
  document.addEventListener('click', record);

  if (keys) {
    await user.keyboard(`{${keys}>}`);
  }
  await user.click(link);
  if (keys) {
    await user.keyboard(`{/${keys}}`);
  }

  document.removeEventListener('click', record);
  return navigates;
};

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

  it('scrolls in place and updates the URL on a plain click', async () => {
    renderWithSection();

    expect(
      await clickWouldNavigate(screen.getByRole('link', { name: 'Work' })),
    ).toBe(false);
    expect(scrollIntoView).toHaveBeenCalled();
    expect(window.location.pathname).toBe('/work');
  });

  it('keeps the query string', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/?ref=resume');
    renderWithSection();

    await user.click(screen.getByRole('link', { name: 'Work' }));

    expect(window.location.pathname).toBe('/work');
    expect(window.location.search).toBe('?ref=resume');
  });

  it('updates the tab title to match the section', async () => {
    const user = userEvent.setup();
    renderWithSection();

    await user.click(screen.getByRole('link', { name: 'Work' }));

    expect(document.title).toBe(sectionTitle('work'));
  });

  it('records the history entry before scrolling, so Back returns to where the reader was', async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    vi.spyOn(window.history, 'pushState').mockImplementation(() => {
      calls.push('pushState');
    });
    scrollIntoView.mockImplementation(() => {
      calls.push('scroll');
    });
    renderWithSection();

    await user.click(screen.getByRole('link', { name: 'Work' }));

    expect(calls).toEqual(['pushState', 'scroll']);
  });

  it("doesn't push a duplicate history entry", async () => {
    const user = userEvent.setup();
    renderWithSection();
    const push = vi.spyOn(window.history, 'pushState');
    window.history.replaceState(null, '', '/work');

    await user.click(screen.getByRole('link', { name: 'Work' }));

    expect(push).not.toHaveBeenCalled();
  });

  it('leaves modifier clicks to the browser', async () => {
    renderWithSection();

    expect(
      await clickWouldNavigate(
        screen.getByRole('link', { name: 'Work' }),
        'Meta',
      ),
    ).toBe(true);
    expect(window.location.pathname).toBe('/');
  });

  it('navigates normally when the section is not on the page', async () => {
    render(<SectionLink section='about'>About</SectionLink>);

    expect(
      await clickWouldNavigate(screen.getByRole('link', { name: 'About' })),
    ).toBe(true);
    expect(window.location.pathname).toBe('/');
  });

  it('respects a caller that prevents the click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: { preventDefault: () => void }) =>
      event.preventDefault(),
    );
    render(
      <>
        <SectionLink onClick={onClick} section='work'>
          Again
        </SectionLink>
        <section id='work' tabIndex={-1} />
      </>,
    );

    await user.click(screen.getByRole('link', { name: 'Again' }));

    expect(onClick).toHaveBeenCalled();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('scrolls to the top for the home link', async () => {
    const user = userEvent.setup();
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    window.history.replaceState(null, '', '/about');
    render(<SectionLink section={null}>Home</SectionLink>);

    await user.click(screen.getByRole('link', { name: 'Home' }));

    expect(scrollTo).toHaveBeenCalledWith({ behavior: 'auto', top: 0 });
    expect(window.location.pathname).toBe('/');
    expect(document.title).toBe(sectionTitle(null));
  });
});
