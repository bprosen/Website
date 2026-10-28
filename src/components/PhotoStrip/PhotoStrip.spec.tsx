import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PhotoStrip } from './PhotoStrip';

describe('PhotoStrip', () => {
  it('repeats the photos for a seamless loop but announces them once', () => {
    render(<PhotoStrip photos={[{ label: 'One' }, { label: 'Two' }]} />);
    const list = screen.getByRole('list', { name: 'Photos' });

    expect(list.querySelectorAll('li')).toHaveLength(4);
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
  });
});
