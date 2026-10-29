import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { BODY_FONT, DISPLAY_FONT, PORTRAIT } from '~/constants';

type FontSpec = typeof BODY_FONT | typeof DISPLAY_FONT;

const loadFont = async ({ file, name, weight }: FontSpec) => ({
  data: await readFile(join(process.cwd(), 'src', 'assets', 'fonts', file)),
  name,
  style: 'normal' as const,
  weight,
});

export const loadDisplayFont = () => loadFont(DISPLAY_FONT);

export const loadBodyFont = () => loadFont(BODY_FONT);

export const loadPortraitDataUrl = async () => {
  const data = await readFile(join(process.cwd(), 'public', PORTRAIT.src));
  return `data:image/jpeg;base64,${data.toString('base64')}`;
};
