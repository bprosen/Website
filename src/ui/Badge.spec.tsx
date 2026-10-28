import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders a span with the default variant', () => {
    render(<Badge>New</Badge>);

    expect(screen.getByText('New').tagName).toBe('SPAN');
    expect(screen.getByText('New')).toHaveClass('bg-primary');
  });

  it('styles tech pills and renders as its child', () => {
    render(
      <ul>
        <Badge asChild variant='tech'>
          <li>React</li>
        </Badge>
      </ul>,
    );
    const pill = screen.getByRole('listitem');

    expect(pill).toHaveTextContent('React');
    expect(pill).toHaveClass('bg-background', 'text-sm');
    expect(pill).not.toHaveClass('text-xs');
  });
});
