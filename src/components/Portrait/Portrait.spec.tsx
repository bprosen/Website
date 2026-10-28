import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PORTRAIT } from '~/constants';
import { Portrait } from './Portrait';

describe('Portrait', () => {
  it('shows the portrait with its alt text', () => {
    render(<Portrait className='extra' />);
    const image = screen.getByRole('img', { name: PORTRAIT.alt });

    expect(image).toHaveClass('rounded-full', 'extra');
    expect(image).toHaveAttribute('width', String(PORTRAIT.size));
  });
});
