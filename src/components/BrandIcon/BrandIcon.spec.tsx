import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BRAND_VIEW_BOX, BRANDS, DEVICON_VIEW_BOX } from '~/constants';
import { BrandIcon } from './BrandIcon';

describe('BrandIcon', () => {
  it('is decorative and brand-colored by default', () => {
    const { container } = render(<BrandIcon name='React' />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
    expect(container.querySelector('path')).toHaveAttribute(
      'fill',
      BRANDS.React.color,
    );
  });

  it('is a labeled image when given a label', () => {
    render(<BrandIcon label='Docker' name='Docker' tinted={false} />);
    const icon = screen.getByRole('img', { name: 'Docker' });

    expect(icon).not.toHaveAttribute('aria-hidden');
    expect(icon.querySelector('path')).not.toHaveAttribute('fill');
  });

  it('lets dark logos use the text color in dark mode', () => {
    const { container } = render(<BrandIcon name='GitHub' />);

    expect(container.querySelector('path')).toHaveClass('dark:fill-current');
  });

  it('keeps light logos in their brand color', () => {
    const { container } = render(<BrandIcon name='React' />);

    expect(container.querySelector('path')).not.toHaveClass(
      'dark:fill-current',
    );
  });

  it('draws on the default canvas unless the brand sets its own', () => {
    const { container } = render(
      <>
        <BrandIcon name='React' />
        <BrandIcon name='MySQL' />
      </>,
    );
    const [react, mysql] = container.querySelectorAll('svg');

    expect(react).toHaveAttribute('viewBox', BRAND_VIEW_BOX);
    expect(mysql).toHaveAttribute('viewBox', DEVICON_VIEW_BOX);
  });
});
