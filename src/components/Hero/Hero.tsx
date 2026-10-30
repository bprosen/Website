import {
  FIRST_NAME,
  FULL_NAME,
  HERO_NAME_ID,
  HERO_TAGLINE,
  INTRO_FIRST_NAME_DELAY_MS,
  INTRO_LAST_NAME_DELAY_MS,
  LAST_NAME,
} from '~/constants';
import { cn } from '~/lib/ui';
import { ContactLinks } from '../ContactLinks';
import { GlobeCard } from '../GlobeCard';
import { Portrait } from '../Portrait';
import { SplitText } from '../SplitText';

const NAME_LINE_CLASS =
  '-mb-[0.25em] block overflow-x-visible overflow-y-clip pb-[0.25em]';
const TAGLINE_OFFSET_CLASS = 'mt-[clamp(14px,2.5svh,24px)]';
const LINKS_OFFSET_CLASS = 'mt-[clamp(20px,3.5svh,32px)]';

export const Hero = () => (
  <section className='page-container grid min-h-[min(calc(100svh-124px),1400px)] grid-cols-[minmax(0,1fr)_auto] content-center items-center gap-x-4 py-[clamp(24px,5svh,96px)] sm:flex sm:flex-wrap sm:justify-between sm:gap-[clamp(24px,4svh,48px)]'>
    <div className='contents sm:block sm:min-w-0 sm:flex-[1_1_420px]'>
      <h1
        aria-label={FULL_NAME}
        className='col-start-1 row-start-1 font-serif text-[min(44px,calc((68vw-56px)/6.4))] leading-[0.98] font-semibold tracking-[-0.035em] max-sm:whitespace-nowrap sm:text-[clamp(44px,7vw,96px)]'
        id={HERO_NAME_ID}
      >
        <span className={NAME_LINE_CLASS}>
          <SplitText delayMs={INTRO_FIRST_NAME_DELAY_MS} text={FIRST_NAME} />
        </span>
        <span className={NAME_LINE_CLASS}>
          <SplitText delayMs={INTRO_LAST_NAME_DELAY_MS} text={LAST_NAME} />
        </span>
      </h1>
      <p
        className={cn(
          'motion-safe:animate-intro-rise col-span-2 row-start-2 max-w-[580px] text-[clamp(17px,2.5svh,20px)] leading-[1.45] text-pretty motion-safe:[animation-delay:260ms] sm:mt-7 sm:text-[clamp(20px,2.2vw,26px)] sm:leading-[1.4]',
          TAGLINE_OFFSET_CLASS,
        )}
      >
        {HERO_TAGLINE}
      </p>
      <ContactLinks
        className={cn(
          'motion-safe:animate-intro-rise col-span-2 row-start-3 motion-safe:[animation-delay:360ms] sm:mt-7',
          LINKS_OFFSET_CLASS,
        )}
      />
    </div>
    <Portrait className='motion-safe:animate-intro-rise col-start-2 row-start-1 size-[clamp(96px,32vw,144px)] motion-safe:[animation-delay:120ms] sm:hidden' />
    <GlobeCard className='sm:max-split:mx-auto max-sm:hidden' />
  </section>
);
