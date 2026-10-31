import type { ImageProps } from 'next/image';
import {
  ABOUT_BIO,
  ABOUT_EYEBROW,
  ABOUT_HEADING,
  ABOUT_SECTION_ID,
  ABOUT_TRAVEL_NOTE,
} from '~/constants';
import { PhotoStrip } from '../PhotoStrip';
import { Portrait } from '../Portrait';
import { StackCard } from '../StackCard';

type AboutSectionProps = {
  bio?: readonly string[];
  photoLoading?: ImageProps['loading'];
  travelNote?: string;
};

export const AboutSection = ({
  bio = ABOUT_BIO,
  photoLoading = 'lazy',
  travelNote = ABOUT_TRAVEL_NOTE,
}: AboutSectionProps) => (
  <section
    className='page-container py-[clamp(72px,9vw,128px)] outline-none'
    id={ABOUT_SECTION_ID}
    tabIndex={-1}
  >
    <p className='mb-8 font-serif text-xl font-semibold' data-reveal>
      {ABOUT_EYEBROW}
    </p>
    <div className='mb-12 flex items-center gap-4 sm:gap-6' data-reveal>
      <h2 className='font-serif text-[clamp(40px,6vw,80px)] leading-none font-semibold tracking-[-0.035em]'>
        <span className='bg-accent rounded-[14px] box-decoration-clone px-3.5'>
          {ABOUT_HEADING}
        </span>
      </h2>
      <Portrait className='shrink-0 max-sm:hidden' />
    </div>
    <div className='flex flex-wrap items-start justify-between gap-x-20 gap-y-12'>
      <div className='max-w-[560px] min-w-0 flex-[1_1_360px]'>
        <div className='flex flex-col gap-4 text-pretty' data-reveal-group>
          {bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {travelNote !== '' && <p>{travelNote}</p>}
        </div>
        <div className='mt-10' data-reveal>
          <PhotoStrip loading={photoLoading} />
        </div>
      </div>
      <div
        className='max-split:basis-full min-w-0 flex-[0_1_340px]'
        data-reveal
      >
        <StackCard />
      </div>
    </div>
  </section>
);
