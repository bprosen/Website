import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Globe } from './Globe';

const renderGlobe = (tip: 'me' | null = null) =>
  render(
    <Globe
      dots={[]}
      onSelect={vi.fn()}
      tip={tip}
      tooltip={tip && 'Tooltip text'}
      tooltipId='globe-tooltip'
      visitorCoords={null}
    />,
  );

describe('Globe', () => {
  it('is a focusable, labelled widget', () => {
    renderGlobe();
    const globe = screen.getByRole('application');

    expect(globe).toHaveAttribute('tabindex', '0');
    expect(globe).toHaveAccessibleName(/globe with a marker on Winnipeg/);
  });

  it('hides the drawing from assistive tech', () => {
    const { container } = renderGlobe();

    expect(
      container.querySelector('canvas')?.closest('[aria-hidden="true"]'),
    ).not.toBeNull();
  });

  it('shows and describes the open tooltip', () => {
    renderGlobe('me');
    const tooltip = screen.getByRole('tooltip');

    expect(tooltip).toHaveTextContent('Tooltip text');
    expect(screen.getByRole('application')).toHaveAccessibleDescription(
      'Tooltip text',
    );
  });

  it('renders no tooltip when none is open', () => {
    renderGlobe();

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
