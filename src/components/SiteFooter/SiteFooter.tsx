import { IconBrandGithub, IconHeartFilled } from '@tabler/icons-react';
import {
  CONTACT_BODY,
  CONTACT_HEADING,
  CONTACT_SECTION_ID,
  EXTERNAL_LINK_PROPS,
  FULL_NAME,
  HEART_LABEL,
  ICON_STROKE_WIDTH,
  SITE_REPO_URL,
  VIEW_SOURCE_LABEL,
} from '~/constants';
import { Separator } from '~/ui';
import { ContactLinks } from '../ContactLinks';
import { CopyrightYear } from '../CopyrightYear';
import { MotionToggle } from '../MotionToggle';
import { NewTabHint } from '../NewTabHint';

const FOOTER_LINK_CLASS =
  'inline-flex items-center justify-center gap-1.5 rounded-sm underline-offset-4 hover:underline max-sm:size-6';
const FOOTER_LINK_LABEL_CLASS = 'max-sm:sr-only';

export const SiteFooter = () => (
  <footer
    className='bg-inverse text-inverse-foreground mt-[clamp(32px,4vw,64px)] rounded-t-[48px] outline-none [--ring:var(--inverse-foreground)]'
    id={CONTACT_SECTION_ID}
    tabIndex={-1}
  >
    <div className='page-container pt-[clamp(64px,8vw,120px)] pb-10'>
      <h2
        className='max-w-[900px] font-serif text-[clamp(48px,9vw,128px)] leading-[0.95] font-semibold tracking-[-0.04em] text-balance'
        data-reveal
      >
        {CONTACT_HEADING}
      </h2>
      <p
        className='text-mist mt-7 max-w-[520px] text-[19px] text-pretty'
        data-reveal
      >
        {CONTACT_BODY}
      </p>
      <div className='mt-9' data-reveal>
        <ContactLinks tone='dark' />
      </div>
      <Separator className='bg-inverse-foreground/18 mt-[clamp(64px,8vw,104px)]' />
      <div className='text-mist max-narrow:gap-x-2 max-narrow:text-[11px] flex flex-wrap justify-between gap-x-3 gap-y-2 pt-6 text-xs whitespace-nowrap sm:gap-x-6 sm:text-sm'>
        <span className='inline-flex items-center gap-1 sm:gap-1.5'>
          © <CopyrightYear /> {FULL_NAME} · Made with
          <IconHeartFilled
            aria-label={HEART_LABEL}
            className='text-heart size-4'
            role='img'
          />
        </span>
        <div className='max-narrow:gap-x-1 flex items-center gap-x-2 sm:gap-x-6'>
          <MotionToggle
            className={FOOTER_LINK_CLASS}
            labelClassName={FOOTER_LINK_LABEL_CLASS}
          />
          <a
            className={FOOTER_LINK_CLASS}
            href={SITE_REPO_URL}
            {...EXTERNAL_LINK_PROPS}
          >
            <IconBrandGithub
              aria-hidden
              className='size-4'
              stroke={ICON_STROKE_WIDTH}
            />
            <span className={FOOTER_LINK_LABEL_CLASS}>{VIEW_SOURCE_LABEL}</span>
            <NewTabHint />
          </a>
        </div>
      </div>
    </div>
  </footer>
);
