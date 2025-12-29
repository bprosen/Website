import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UnderConstruction } from './UnderConstruction';

describe('UnderConstruction', () => {
  it('renders', () => {
    render(<UnderConstruction />);

    expect(screen.getByText('Hold on a second!')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This page is under construction, please come back soon',
      ),
    ).toBeInTheDocument();
  });
});
