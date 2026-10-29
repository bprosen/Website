import {
  FIRST_NAME,
  HERO_NAME_ID,
  HERO_TAGLINE,
  LAST_NAME,
  NAME,
} from '~/constants';
import { ContactLinks } from '../ContactLinks';
import { GlobeCard } from '../GlobeCard';
import { Portrait } from '../Portrait';
import { SplitText } from '../SplitText';

const NAME_LINE = '-mb-[0.25em] block overflow-hidden pb-[0.25em]';
const TAGLINE_GAP = 'mt-[clamp(14px,2.5svh,24px)]';
const LINKS_GAP = 'mt-[clamp(20px,3.5svh,32px)]';

export const Hero = () => (
  <section className='mx-auto box-border grid max-w-[1240px] min-h-[min(calc(100svh-124px),1400px)] grid-cols-[minmax(0,1fr)_auto] content-center items-center gap-x-4 px-[clamp(20px,5vw,56px)] py-[clamp(24px,5svh,96px)] sm:flex sm:flex-wrap sm:justify-between sm:gap-[clamp(24px,4svh,48px)]'>
    <div className='contents sm:block sm:min-w-0 sm:flex-[1_1_420px]'>
      <h1
        aria-label={NAME}
        className='col-start-1 row-start-1 m-0 font-serif text-[min(44px,calc((68vw-56px)/6.4))] leading-[0.98] max-sm:whitespace-nowrap font-semibold tracking-[-0.035em] sm:text-[clamp(44px,7vw,96px)]'
        id={HERO_NAME_ID}
      >
        <span className={NAME_LINE}>
          <SplitText delayMs={80} text={FIRST_NAME} />
        </span>
        <span className={NAME_LINE}>
          <SplitText delayMs={160} text={LAST_NAME} />
        </span>
      </h1>
      <p
        className={`col-span-2 row-start-2 m-0 max-w-[580px] text-[clamp(18px,3.2svh,24px)] leading-[1.45] text-pretty motion-safe:animate-intro-rise motion-safe:[animation-delay:260ms] sm:mt-7 sm:text-[clamp(20px,2.2vw,26px)] sm:leading-[1.4] ${TAGLINE_GAP}`}
      >
        {HERO_TAGLINE}
      </p>
      <ContactLinks
        className={`col-span-2 row-start-3 motion-safe:animate-intro-rise motion-safe:[animation-delay:360ms] sm:mt-7 ${LINKS_GAP}`}
      />
    </div>
    <Portrait className='col-start-2 row-start-1 size-[clamp(96px,32vw,144px)] motion-safe:animate-intro-rise motion-safe:[animation-delay:120ms] sm:hidden' />
    <GlobeCard className='max-sm:hidden' />
  </section>
);
