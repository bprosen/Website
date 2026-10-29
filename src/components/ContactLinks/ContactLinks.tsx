import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconFileText,
  IconMail,
} from '@tabler/icons-react';
import {
  GITHUB,
  ICON_STROKE,
  LINKED_IN,
  MAILTO,
  RESUME_PATH,
} from '~/constants';
import { cn } from '~/lib/ui';
import { Button } from '~/ui';
import { EmailPill } from '../EmailPill';

const COMPACT_ROW = 'max-sm:flex-nowrap max-sm:gap-[clamp(6px,2vw,8px)]';
const COMPACT_TEXT_BUTTON =
  'max-sm:h-11 max-sm:min-w-0 max-sm:gap-2 max-sm:px-[clamp(10px,3vw,12px)] max-sm:text-base max-[379px]:[&_svg]:hidden';
const COMPACT_ICON_BUTTON = 'max-sm:size-11';

type ContactLinksProps = {
  className?: string;
  tone?: 'dark' | 'light';
};

export const ContactLinks = ({
  className,
  tone = 'light',
}: ContactLinksProps) => {
  const dark = tone === 'dark';
  const outline = dark ? 'outlineDark' : 'outline';
  const size = dark ? 'lg' : 'default';
  const iconSize = dark ? 'iconLg' : 'icon';
  const compactText = cn(COMPACT_TEXT_BUTTON, !dark && 'max-sm:flex-1');

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3',
        COMPACT_ROW,
        className,
      )}
    >
      {dark ? (
        <EmailPill />
      ) : (
        <Button asChild className={compactText} size={size}>
          <a href={MAILTO}>
            <IconMail aria-hidden stroke={ICON_STROKE} />
            Email me
          </a>
        </Button>
      )}
      <Button asChild className={compactText} size={size} variant={outline}>
        <a href={RESUME_PATH} rel='noopener' target='_blank'>
          <IconFileText aria-hidden className='size-5' stroke={ICON_STROKE} />
          Resume
        </a>
      </Button>
      <Button
        asChild
        className={COMPACT_ICON_BUTTON}
        size={iconSize}
        variant={outline}
      >
        <a aria-label='GitHub' href={GITHUB} title='GitHub'>
          <IconBrandGithub aria-hidden stroke={ICON_STROKE} />
        </a>
      </Button>
      <Button
        asChild
        className={COMPACT_ICON_BUTTON}
        size={iconSize}
        variant={outline}
      >
        <a aria-label='LinkedIn' href={LINKED_IN} title='LinkedIn'>
          <IconBrandLinkedin aria-hidden stroke={ICON_STROKE} />
        </a>
      </Button>
    </div>
  );
};
