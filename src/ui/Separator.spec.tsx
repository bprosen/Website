import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Separator } from './Separator';

describe('Separator', () => {
  it('is decorative and horizontal by default', () => {
    const { container } = render(<Separator className='bg-ink/25' />);
    const separator = container.firstElementChild;

    expect(separator).toHaveAttribute('role', 'none');
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    expect(separator).toHaveClass('bg-ink/25');
  });

  it('is announced when not decorative', () => {
    const { getByRole } = render(<Separator decorative={false} />);

    expect(getByRole('separator')).toBeInTheDocument();
  });
});
