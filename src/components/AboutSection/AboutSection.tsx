import { ABOUT_BIO, JAPAN_NOTE } from '~/constants';
import { PhotoStrip } from '../PhotoStrip';
import { Portrait } from '../Portrait';
import { StackCard } from '../StackCard';

type AboutSectionProps = {
  bio?: readonly string[];
  japanNote?: string;
};

export const AboutSection = ({
  bio = ABOUT_BIO,
  japanNote = JAPAN_NOTE,
}: AboutSectionProps) => (
  <section
    className='mx-auto max-w-[1240px] scroll-mt-[72px] outline-none px-[clamp(20px,5vw,56px)] py-[clamp(72px,9vw,128px)]'
    id='about'
    tabIndex={-1}
  >
    <p className='m-0 mb-8 font-serif text-xl font-semibold' data-reveal>
      About
    </p>
    <div className='mb-12 flex items-center gap-4 sm:gap-6' data-reveal>
      <h2 className='m-0 font-serif text-[clamp(40px,6vw,80px)] leading-none font-semibold tracking-[-0.035em]'>
        <span className='box-decoration-clone rounded-[14px] bg-accent px-3.5'>
          Get to know me
        </span>
      </h2>
      <Portrait className='shrink-0 max-sm:hidden' />
    </div>
    <div className='flex flex-wrap items-start justify-between gap-x-20 gap-y-12'>
      <div className='min-w-0 max-w-[560px] flex-[1_1_360px]'>
        <div className='flex flex-col gap-4 text-pretty' data-reveal-group>
          {bio.map((paragraph) => (
            <p className='m-0' key={paragraph}>
              {paragraph}
            </p>
          ))}
          {japanNote && <p className='m-0'>{japanNote}</p>}
        </div>
        <div className='mt-10' data-reveal>
          <PhotoStrip />
        </div>
      </div>
      <div
        className='min-w-0 flex-[0_1_340px] max-[880px]:basis-full'
        data-reveal
      >
        <StackCard />
      </div>
    </div>
  </section>
);
