import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

describe('Card', () => {
  it('renders a titled card', () => {
    render(
      <Card className='extra'>
        <CardHeader>
          <CardTitle>Stack</CardTitle>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>,
    );

    expect(
      screen.getByRole('heading', { level: 3, name: 'Stack' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Body')).toHaveAttribute(
      'data-slot',
      'card-content',
    );
    expect(screen.getByText('Body').closest('[data-slot="card"]')).toHaveClass(
      'extra',
      'bg-card',
    );
  });
});
