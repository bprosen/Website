import { FIRST_NAME, HERO_TAGLINE, LAST_NAME, NAME } from '~/constants';
import { ContactLinks } from '../ContactLinks';
import { GlobeCard } from '../GlobeCard';
import { SplitText } from '../SplitText';

export const Hero = () => (
  <section className='mx-auto box-border grid max-w-[1240px] min-h-[min(calc(100svh-124px),1400px)] grid-cols-[minmax(0,1fr)_auto] content-center items-center gap-x-3 gap-y-5 px-[clamp(20px,5vw,56px)] py-[clamp(24px,5svh,96px)] sm:flex sm:flex-wrap sm:justify-between sm:gap-[clamp(24px,4svh,48px)]'>
    <div className='contents sm:block sm:min-w-0 sm:flex-[1_1_420px]'>
      <h1
        aria-label={NAME}
        className='hero-name col-start-1 row-start-1 m-0 self-end font-serif text-[clamp(28px,8.6vw,44px)] leading-[0.98] font-semibold tracking-[-0.035em] sm:text-[clamp(44px,7vw,96px)]'
      >
        <span className='-mb-[0.25em] block overflow-hidden pb-[0.25em]'>
          <SplitText delayMs={80} text={FIRST_NAME} />
        </span>
        <span className='-mb-[0.25em] block overflow-hidden pb-[0.25em]'>
          <SplitText delayMs={160} text={LAST_NAME} />
        </span>
      </h1>
      <p className='col-start-1 row-start-2 m-0 max-w-[580px] self-start text-lg leading-[1.45] text-pretty motion-safe:animate-intro-rise motion-safe:[animation-delay:260ms] sm:mt-7 sm:text-[clamp(20px,2.2vw,26px)] sm:leading-[1.4]'>
        {HERO_TAGLINE}
      </p>
      <ContactLinks className='col-span-2 row-start-3 motion-safe:animate-intro-rise motion-safe:[animation-delay:360ms] sm:mt-7' />
    </div>
    <GlobeCard className='col-start-2 row-span-2 row-start-1' />
  </section>
);
