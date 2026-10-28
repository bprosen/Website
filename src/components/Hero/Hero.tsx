import { FIRST_NAME, HERO_TAGLINE, LAST_NAME } from '~/constants';
import { ContactLinks } from '../ContactLinks';
import { GlobeCard } from '../GlobeCard';

export const Hero = () => (
  <section className='mx-auto box-border flex min-h-[min(calc(100svh-124px),1400px)] max-w-[1240px] flex-wrap content-center items-center justify-between gap-[clamp(24px,4svh,48px)] px-[clamp(20px,5vw,56px)] py-[clamp(24px,5svh,96px)]'>
    <div className='min-w-0 flex-[1_1_420px]'>
      <h1 className='hero-name m-0 font-serif text-[clamp(44px,7vw,96px)] leading-[0.98] font-semibold tracking-[-0.035em]'>
        {FIRST_NAME}
        <br />
        {LAST_NAME}
      </h1>
      <p className='mt-7 mb-0 max-w-[580px] text-[clamp(20px,2.2vw,26px)] leading-[1.4] text-pretty'>
        {HERO_TAGLINE}
      </p>
      <ContactLinks className='mt-7' />
    </div>
    <GlobeCard />
  </section>
);
