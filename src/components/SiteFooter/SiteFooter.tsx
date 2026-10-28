import { IconHeartFilled } from '@tabler/icons-react';
import { CONTACT_COPY, CONTACT_HEADING, NAME } from '~/constants';
import { Separator } from '~/ui';
import { ContactLinks } from '../ContactLinks';

const YEAR = new Date().getFullYear();

export const SiteFooter = () => (
  <footer
    className='mt-[clamp(32px,4vw,64px)] scroll-mt-[72px] outline-none rounded-t-[48px] bg-ink text-paper'
    id='contact'
    tabIndex={-1}
  >
    <div className='mx-auto max-w-[1240px] px-[clamp(20px,5vw,56px)] pt-[clamp(64px,8vw,120px)] pb-10'>
      <h2 className='rise m-0 max-w-[900px] font-serif text-[clamp(48px,9vw,128px)] leading-[0.95] font-semibold tracking-[-0.04em] text-balance'>
        {CONTACT_HEADING}
      </h2>
      <p className='mt-7 mb-0 max-w-[520px] text-[19px] text-mist'>
        {CONTACT_COPY}
      </p>
      <ContactLinks className='mt-9' tone='dark' />
      <Separator className='mt-[clamp(64px,8vw,104px)] bg-paper/18' />
      <div className='flex flex-wrap justify-between gap-x-6 gap-y-2 pt-6 text-sm text-mist'>
        <span className='inline-flex flex-wrap items-center gap-1.5'>
          © {YEAR} {NAME} · Made with
          <IconHeartFilled
            aria-label='love'
            className='size-4 text-love'
            role='img'
          />
        </span>
      </div>
    </div>
  </footer>
);
