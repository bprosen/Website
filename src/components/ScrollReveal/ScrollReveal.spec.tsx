import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { REVEAL_READY_CLASS } from '~/constants';
import { ScrollReveal } from './ScrollReveal';

describe('ScrollReveal', () => {
  it('renders nothing and switches the page into reveal mode', () => {
    const { container } = render(<ScrollReveal />);

    expect(container).toBeEmptyDOMElement();
    expect(document.documentElement).toHaveClass(REVEAL_READY_CLASS);
  });
});
