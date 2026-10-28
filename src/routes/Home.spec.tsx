import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

  it('jumps to the requested section', () => {
    render(<Home section='about' />);

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('lets keyboard users skip straight to the content', () => {
    render(<Home />);
    const skip = screen.getByRole('link', { name: 'Skip to content' });

    expect(skip).toHaveAttribute('href', '#main');
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
  });
});
