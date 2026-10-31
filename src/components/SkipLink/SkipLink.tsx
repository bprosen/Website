import { MAIN_CONTENT_ID, SKIP_LINK_LABEL } from '~/constants';

export const SkipLink = () => (
  <a
    className='bg-primary text-primary-foreground sr-only rounded-full font-medium focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60 focus:px-5 focus:py-3'
    href={`#${MAIN_CONTENT_ID}`}
  >
    {SKIP_LINK_LABEL}
  </a>
);
