import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders a button with the default variant', () => {
    render(<Button>Send</Button>);
    const button = screen.getByRole('button', { name: 'Send' });

    expect(button).toHaveAttribute('data-variant', 'default');
    expect(button).toHaveAttribute('data-size', 'default');
    expect(button).toHaveClass('bg-primary', 'h-12', 'rounded-full');
  });

  it('renders its child as the element with asChild', () => {
    render(
      <Button asChild variant='outline'>
        <a href='/resume.pdf'>Resume</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Resume' });

    expect(link).toHaveAttribute('href', '/resume.pdf');
    expect(link).toHaveClass('border-foreground');
  });

  it('lets callers override classes', () => {
    render(<Button className='px-1'>Save</Button>);

    expect(screen.getByRole('button')).not.toHaveClass('px-[22px]');
  });

  it.each([
    ['ghost', 'hover:bg-accent'],
    ['outlineInverse', 'border-inverse-foreground/50'],
  ] as const)('applies the %s variant', (variant, className) => {
    render(<Button variant={variant}>Save</Button>);

    expect(screen.getByRole('button')).toHaveClass(className);
  });

  it.each([
    ['icon', 'size-12'],
    ['iconLg', 'size-13'],
    ['lg', 'h-13'],
    ['nav', 'min-h-11'],
  ] as const)('applies the %s size', (size, className) => {
    render(<Button size={size}>Save</Button>);

    expect(screen.getByRole('button')).toHaveClass(className);
  });

  it('animates the hover lift instead of jumping', () => {
    render(<Button>Lift</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('hover:-translate-y-0.5');
    expect(button.className).toMatch(/transition-\[[^\]]*translate[^\]]*\]/);
  });
});
