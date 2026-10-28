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
});
