import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WORK } from '~/constants';
import { WorkSection } from './WorkSection';

describe('WorkSection', () => {
  it('renders every entry from the constants', () => {
    render(<WorkSection />);

    expect(screen.getAllByRole('article')).toHaveLength(WORK.length);
    for (const { company } of WORK) {
      expect(
        screen.getByRole('heading', { level: 3, name: company }),
      ).toBeInTheDocument();
    }
  });

  it('is the #work target and keeps a heading on small screens', () => {
    const { container } = render(<WorkSection />);

    expect(container.querySelector('section#work')).toHaveAttribute(
      'tabindex',
      '-1',
    );
    expect(
      screen.getAllByRole('heading', { level: 2, name: 'Work' }),
    ).toHaveLength(2);
  });
});
