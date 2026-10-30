import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ABOUT_PHOTOS,
  MAIN_CONTENT_ID,
  SECTIONS,
  SKIP_LINK_LABEL,
} from '~/constants';
import { Home } from './Home';

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe('Home', () => {
  it('composes the header, sections and footer', () => {
    render(<Home />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  it('renders a target for every section, in navigation order', () => {
    render(<Home />);

    const targets = SECTIONS.map(({ slug }) =>
      document.getElementById(slug),
    ).filter((target) => target !== null);

    expect(targets).toHaveLength(SECTIONS.length);
    for (const [index, target] of targets.slice(1).entries()) {
      expect(targets[index].compareDocumentPosition(target)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }
  });

  it('jumps to the requested section', () => {
    render(<Home section='about' />);

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('loads the Japan photos eagerly only when opening on the about section', () => {
    const { unmount } = render(<Home />);
    const fuji = () =>
      screen.getAllByRole('img', { name: ABOUT_PHOTOS[0].alt })[0];

    expect(fuji()).toHaveAttribute('loading', 'lazy');

    unmount();
    render(<Home section='about' />);

    expect(fuji()).toHaveAttribute('loading', 'eager');
  });

  it('lets keyboard users skip straight to the content', () => {
    render(<Home />);
    const skip = screen.getByRole('link', { name: SKIP_LINK_LABEL });

    expect(skip).toHaveAttribute('href', `#${MAIN_CONTENT_ID}`);
    expect(screen.getByRole('main')).toHaveAttribute('id', MAIN_CONTENT_ID);
  });
});
