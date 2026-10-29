import { IconBrandGithub, IconHeartFilled } from '@tabler/icons-react';
import {
  CONTACT_COPY,
  CONTACT_HEADING,
  ICON_STROKE,
  NAME,
  SITE_REPO,
} from '~/constants';
import { Separator } from '~/ui';
import { ContactLinks } from '../ContactLinks';

const YEAR = new Date().getFullYear();

export const SiteFooter = () => (
  <footer
    className='mt-[clamp(32px,4vw,64px)] scroll-mt-[72px] outline-none rounded-t-[48px] bg-inverse text-inverse-foreground'
    id='contact'
    tabIndex={-1}
  >
    <div className='mx-auto max-w-[1240px] px-[clamp(20px,5vw,56px)] pt-[clamp(64px,8vw,120px)] pb-10'>
      <h2
        className='m-0 max-w-[900px] font-serif text-[clamp(48px,9vw,128px)] leading-[0.95] font-semibold tracking-[-0.04em] text-balance'
        data-reveal
      >
        {CONTACT_HEADING}
      </h2>
      <p className='mt-7 mb-0 max-w-[520px] text-[19px] text-mist' data-reveal>
        {CONTACT_COPY}
      </p>
      <div className='mt-9' data-reveal>
        <ContactLinks tone='dark' />
      </div>
      <Separator className='mt-[clamp(64px,8vw,104px)] bg-inverse-foreground/18' />
      <div className='flex flex-wrap justify-between gap-x-3 gap-y-2 pt-6 text-xs whitespace-nowrap text-mist sm:gap-x-6 sm:text-sm'>
        <span className='inline-flex items-center gap-1 sm:gap-1.5'>
          © {YEAR} {NAME} · Made with
          <IconHeartFilled
            aria-label='love'
            className='size-4 text-love'
            role='img'
          />
        </span>
        <a
          className='inline-flex items-center gap-1 rounded-sm text-inherit sm:gap-1.5 underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-inverse-foreground/60'
          href={SITE_REPO}
          rel='noopener'
          target='_blank'
        >
          <IconBrandGithub
            aria-hidden
            className='size-4 max-[379px]:hidden'
            stroke={ICON_STROKE}
          />
          View source
        </a>
      </div>
    </div>
  </footer>
);
