import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BRANDS } from '~/constants';
import { BrandIcon } from './BrandIcon';

describe('BrandIcon', () => {
  it('is decorative and brand-coloured by default', () => {
    const { container } = render(<BrandIcon name='React' />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
    expect(container.querySelector('path')).toHaveAttribute(
      'fill',
      BRANDS.React.color,
    );
  });

  it('is a labelled image when given a label', () => {
    render(<BrandIcon label='Docker' name='Docker' tinted={false} />);
    const icon = screen.getByRole('img', { name: 'Docker' });

    expect(icon).not.toHaveAttribute('aria-hidden');
    expect(icon.querySelector('path')).not.toHaveAttribute('fill');
  });

  it('lets dark logos use the text colour in dark mode', () => {
    const { container } = render(<BrandIcon name='GitHub' />);

    expect(container.querySelector('path')).toHaveClass('dark:fill-current');
  });

  it('keeps light logos in their brand colour', () => {
    const { container } = render(<BrandIcon name='React' />);

    expect(container.querySelector('path')).not.toHaveClass(
      'dark:fill-current',
    );
  });
});
