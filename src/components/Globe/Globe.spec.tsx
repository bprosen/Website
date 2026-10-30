import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Globe } from './Globe';

const renderGlobe = (selectedMarker: 'home' | null = null) =>
  render(
    <Globe
      onSelect={vi.fn()}
      selectedMarker={selectedMarker}
      tooltip={selectedMarker && 'Tooltip text'}
      tooltipId='globe-tooltip'
      visitorCoords={null}
      visitorDots={[]}
    />,
  );

describe('Globe', () => {
  it('is a focusable, labeled widget', () => {
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
    renderGlobe('home');
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

  it('only tints the home marker coral when it is shared with the visitor', () => {
    const { container, rerender } = renderGlobe();

    expect(container.querySelector('[data-shared]')).toBeNull();

    rerender(
      <Globe
        onSelect={vi.fn()}
        selectedMarker={null}
        sharedHome
        tooltip={null}
        tooltipId='globe-tooltip'
        visitorCoords={null}
        visitorDots={[]}
      />,
    );

    expect(container.querySelector('[data-shared]')).toHaveClass(
      'border-coral-deep',
    );
  });
});
