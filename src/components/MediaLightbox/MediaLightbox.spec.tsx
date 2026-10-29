import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CLOSE_DIALOG_LABEL, ENLARGE_MEDIA_LABEL } from '~/constants';
import { MediaLightbox } from './MediaLightbox';

const ALT = 'Mt. Fuji above the town';
const TRIGGER = `${ENLARGE_MEDIA_LABEL}: ${ALT}`;

const renderLightbox = (props: { focusable?: boolean; video?: string } = {}) =>
  render(
    <MediaLightbox
      alt={ALT}
      height={1600}
      src='/fuji.jpg'
      width={1200}
      {...props}
    >
      <span>thumbnail</span>
    </MediaLightbox>,
  );

describe('MediaLightbox', () => {
  it('renders the thumbnail inside an enlarge button', () => {
    renderLightbox();

    expect(screen.getByRole('button', { name: TRIGGER })).toHaveTextContent(
      'thumbnail',
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens a dialog with the enlarged image', async () => {
    const user = userEvent.setup();
    renderLightbox();

    await user.click(screen.getByRole('button', { name: TRIGGER }));
    const dialog = screen.getByRole('dialog', { name: ALT });

    const image = within(dialog).getByRole('img', { name: ALT });

    expect(image.getAttribute('src')).toContain('fuji.jpg');
    expect(image).toHaveStyle({ aspectRatio: '1200 / 1600' });
  });

  it('plays videos muted and looping with no controls', async () => {
    const user = userEvent.setup();
    renderLightbox({ video: '/clip.mp4' });

    await user.click(screen.getByRole('button', { name: TRIGGER }));
    const video = within(screen.getByRole('dialog')).getByLabelText(
      ALT,
    ) as HTMLVideoElement;

    expect(video).toHaveAttribute('src', '/clip.mp4');
    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('loop');
    expect(video).toHaveAttribute('playsinline');
    expect(video).toHaveAttribute('disablepictureinpicture');
    expect(video.muted).toBe(true);
    expect(video).not.toHaveAttribute('controls');
  });

  it('leaves videos paused with controls when reduced motion is preferred', async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        addEventListener: vi.fn(),
        matches: true,
        removeEventListener: vi.fn(),
      })),
    );
    const user = userEvent.setup();
    renderLightbox({ video: '/clip.mp4' });

    await user.click(screen.getByRole('button', { name: TRIGGER }));
    const video = within(screen.getByRole('dialog')).getByLabelText(ALT);

    expect(video).not.toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('controls');
  });

  it('closes from the X button and returns focus to the thumbnail', async () => {
    const user = userEvent.setup();
    renderLightbox();
    const trigger = screen.getByRole('button', { name: TRIGGER });

    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: CLOSE_DIALOG_LABEL }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes with the Escape key', async () => {
    const user = userEvent.setup();
    renderLightbox();

    await user.click(screen.getByRole('button', { name: TRIGGER }));
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('can be taken out of the tab order for decorative copies', () => {
    renderLightbox({ focusable: false });

    expect(screen.getByRole('button', { name: TRIGGER })).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });
});
