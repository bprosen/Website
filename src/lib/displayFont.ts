import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { BODY_FONT, DISPLAY_FONT } from '~/constants';

type FontSpec = typeof BODY_FONT | typeof DISPLAY_FONT;

const loadFont = async ({ file, name, weight }: FontSpec) => ({
  data: await readFile(join(process.cwd(), file)),
  name,
  style: 'normal' as const,
  weight,
});

export const loadDisplayFont = () => loadFont(DISPLAY_FONT);

export const loadBodyFont = () => loadFont(BODY_FONT);
