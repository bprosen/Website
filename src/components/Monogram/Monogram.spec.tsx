import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FIRST_NAME } from '~/constants';
import { Monogram } from './Monogram';

describe('Monogram', () => {
  it('shows the first initial on a rounded tile', () => {
    const { container } = render(<Monogram size={100} />);
    const tile = container.firstElementChild as HTMLElement;

    expect(tile).toHaveTextContent(FIRST_NAME[0]);
    expect(tile.style.borderRadius).toBe('22px');
    expect(tile.style.width).toBe('100px');
  });

  it('can fill a square for platforms that round icons themselves', () => {
    const { container } = render(<Monogram rounded={false} size={180} />);

    expect(
      (container.firstElementChild as HTMLElement).style.borderRadius,
    ).toBe('0px');
  });
});
