import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CLOSE_DIALOG_LABEL } from '~/constants';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './Dialog';

const renderDialog = () =>
  render(
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogTitle>Preview</DialogTitle>
        <p>Body</p>
      </DialogContent>
    </Dialog>,
  );

describe('Dialog', () => {
  it('opens a titled dialog with a labeled close button', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(screen.getByRole('dialog', { name: 'Preview' })).toHaveTextContent(
      'Body',
    );
    expect(
      screen.getByRole('button', { name: CLOSE_DIALOG_LABEL }),
    ).toBeInTheDocument();
  });

  it('closes when the blurred backdrop is clicked', async () => {
    const user = userEvent.setup();
    const { baseElement } = renderDialog();

    await user.click(screen.getByRole('button', { name: 'Open' }));
    const backdrop = baseElement.querySelector('[data-slot=dialog-backdrop]');
    if (!(backdrop instanceof HTMLElement)) {
      throw new Error('backdrop missing');
    }
    await user.click(backdrop);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('keeps the backdrop out of the tab order and away from screen readers', async () => {
    const user = userEvent.setup();
    const { baseElement } = renderDialog();

    await user.click(screen.getByRole('button', { name: 'Open' }));
    const backdrop = baseElement.querySelector('[data-slot=dialog-backdrop]');

    expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    expect(backdrop).toHaveAttribute('tabindex', '-1');
  });
});
