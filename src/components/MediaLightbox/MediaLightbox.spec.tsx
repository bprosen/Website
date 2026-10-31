import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  CLOSE_DIALOG_LABEL,
  ENLARGE_MEDIA_LABEL,
  NEXT_MEDIA_LABEL,
  PREVIOUS_MEDIA_LABEL,
} from '~/constants';
import { stubReducedMotion } from '~/lib/testing';
import { MediaLightbox } from './MediaLightbox';

const ALT = 'Mt. Fuji above the town';
const TRIGGER = `${ENLARGE_MEDIA_LABEL}: ${ALT}`;

const FUJI = { alt: ALT, height: 1600, src: '/fuji.jpg', width: 1200 };
const CASTLE = {
  alt: 'Osaka Castle',
  height: 900,
  src: '/castle.jpg',
  width: 1600,
};
const CLIP = {
  alt: 'Parkour clip',
  height: 450,
  src: '/clip.jpg',
  video: '/clip.mp4',
  width: 800,
};
const GALLERY = [FUJI, CASTLE, CLIP];

const renderLightbox = ({
  focusable,
  video,
}: {
  focusable?: boolean;
  video?: string;
} = {}) =>
  render(
    <MediaLightbox focusable={focusable} item={{ ...FUJI, video }}>
      <span>thumbnail</span>
    </MediaLightbox>,
  );

const openGallery = async (item = FUJI) => {
  const user = userEvent.setup();
  render(
    <MediaLightbox gallery={GALLERY} item={item}>
      <span>thumbnail</span>
    </MediaLightbox>,
  );
  await user.click(
    screen.getByRole('button', { name: `${ENLARGE_MEDIA_LABEL}: ${item.alt}` }),
  );

  return user;
};

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

    const image = within(dialog).getByRole('presentation');

    expect(image.getAttribute('src')).toContain('fuji.jpg');
    expect(image).toHaveStyle({ aspectRatio: '1200 / 1600' });
  });

  it('plays videos muted and looping, with controls to pause them', async () => {
    const user = userEvent.setup();
    renderLightbox({ video: '/clip.mp4' });

    await user.click(screen.getByRole('button', { name: TRIGGER }));
    const video = screen
      .getByRole('dialog', { name: ALT })
      .querySelector('video');

    expect(video).toHaveAttribute('src', '/clip.mp4');
    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('loop');
    expect(video).toHaveAttribute('playsinline');
    expect(video).toHaveAttribute('disablepictureinpicture');
    expect(video).toHaveProperty('muted', true);
    expect(video).toHaveAttribute('controls');
  });

  it('leaves videos paused with controls when reduced motion is preferred', async () => {
    stubReducedMotion(true);
    const user = userEvent.setup();
    renderLightbox({ video: '/clip.mp4' });

    await user.click(screen.getByRole('button', { name: TRIGGER }));
    const video = screen
      .getByRole('dialog', { name: ALT })
      .querySelector('video');

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

  it('shows no arrows for a single photo', async () => {
    const user = userEvent.setup();
    renderLightbox();

    await user.click(screen.getByRole('button', { name: TRIGGER }));

    expect(
      screen.queryByRole('button', { name: NEXT_MEDIA_LABEL }),
    ).not.toBeInTheDocument();
  });

  it('steps to the next and previous item with the arrow buttons', async () => {
    const user = await openGallery();

    await user.click(screen.getByRole('button', { name: NEXT_MEDIA_LABEL }));
    expect(
      screen.getByRole('dialog', { name: CASTLE.alt }),
    ).toBeInTheDocument();
    expect(screen.getByText('2 of 3')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: PREVIOUS_MEDIA_LABEL }),
    );
    expect(screen.getByRole('dialog', { name: ALT })).toBeInTheDocument();
  });

  it('wraps around at either end', async () => {
    const user = await openGallery();

    await user.click(
      screen.getByRole('button', { name: PREVIOUS_MEDIA_LABEL }),
    );
    const dialog = screen.getByRole('dialog', { name: CLIP.alt });

    expect(dialog.querySelector('video')).toHaveAttribute('src', CLIP.video);
  });

  it('steps with the left and right arrow keys', async () => {
    const user = await openGallery(CASTLE);

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('dialog', { name: CLIP.alt })).toBeInTheDocument();

    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(screen.getByRole('dialog', { name: ALT })).toBeInTheDocument();
  });

  it('steps when swiped sideways', async () => {
    await openGallery();
    const dialog = screen.getByRole('dialog');

    const startTouch = [{ clientX: 300, clientY: 200 }];
    fireEvent.touchStart(dialog, {
      changedTouches: startTouch,
      touches: startTouch,
    });
    fireEvent.touchEnd(dialog, {
      changedTouches: [{ clientX: 100, clientY: 210 }],
    });

    expect(
      screen.getByRole('dialog', { name: CASTLE.alt }),
    ).toBeInTheDocument();
  });

  it('reopens on the item that was clicked', async () => {
    const user = await openGallery();

    await user.click(screen.getByRole('button', { name: NEXT_MEDIA_LABEL }));
    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: TRIGGER }));

    expect(screen.getByRole('dialog', { name: ALT })).toBeInTheDocument();
  });
});
