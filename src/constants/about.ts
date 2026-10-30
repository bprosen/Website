import type { MediaSlot } from '~/types';
import { FULL_NAME, HOME_CITY_SHORT, SCHOOL } from './profile';

export const PORTRAIT = {
  alt: `Portrait of ${FULL_NAME}`,
  height: 480,
  sizes:
    '(max-width: 300px) 96px, (max-width: 450px) 32vw, (max-width: 639px) 144px, 88px',
  src: '/photos/portrait.jpg',
  width: 480,
} as const;

export const ABOUT_BIO: readonly string[] = [
  `I’m a software developer in ${HOME_CITY_SHORT}, and I graduated with distinction in Computer Science from the ${SCHOOL}. I like building interfaces that feel clean and quick, and I care about testing and tooling as much as the pixels.`,
  'Before I wrote software for a living, I spent seven years building Renatus Network, a Minecraft server that grew to over 2\u00a0million players. I taught myself to code on the fly to keep it running, with no formal training, and learned to lead a team of 30+ along the way.',
];

export const ABOUT_TRAVEL_NOTE =
  'In my downtime I love trying new things. Earlier in 2026 I traveled to Japan, where I bullet-hiked Mt. Fuji and tried a whole bunch of new experiences.';

export const ABOUT_PHOTOS: readonly MediaSlot[] = [
  {
    alt: 'Mt. Fuji rising above the rooftops of a nearby town',
    height: 1600,
    label: 'Mt. Fuji',
    src: '/photos/mt-fuji.jpg',
    tint: 'var(--color-accent)',
    width: 1200,
  },
  {
    alt: 'Osaka Castle against a clear blue sky',
    height: 1600,
    label: 'Osaka Castle',
    src: '/photos/osaka-castle.jpg',
    tint: 'var(--color-tint-stone)',
    width: 1232,
  },
  {
    alt: 'The five-story pagoda at Senso-ji lit up at night',
    focus: 'top',
    height: 1600,
    label: 'Senso-ji',
    src: '/photos/sensoji-pagoda.jpg',
    tint: 'var(--color-tint-leaf)',
    width: 1024,
  },
  {
    alt: 'The Snorlax statue with Pikachu and Mew at Pokémon Center Tokyo DX',
    height: 1600,
    label: 'Pokémon Center',
    src: '/photos/pokemon-center.jpg',
    tint: 'var(--color-tint-sand)',
    width: 1200,
  },
];
