import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconFileText,
  IconMail,
} from '@tabler/icons-react';
import {
  EMAIL_HREF,
  EMAIL_ME_LABEL,
  EXTERNAL_LINK_PROPS,
  GITHUB_URL,
  ICON_STROKE_WIDTH,
  LINKEDIN_URL,
  NEW_TAB_HINT,
  PDF_NEW_TAB_HINT,
  RESUME_LABEL,
  RESUME_PATH,
} from '~/constants';
import { cn } from '~/lib/ui';
import { Button } from '~/ui';
import { EmailPill } from '../EmailPill';
import { NewTabHint } from '../NewTabHint';

const COMPACT_ROW_CLASS = 'max-sm:flex-nowrap max-sm:gap-[clamp(6px,2vw,8px)]';
const COMPACT_TEXT_BUTTON_CLASS =
  'max-sm:h-11 max-sm:min-w-0 max-sm:gap-2 max-sm:px-[clamp(10px,3vw,12px)] max-sm:text-base max-compact:[&_svg]:hidden';
const COMPACT_ICON_BUTTON_CLASS = 'max-sm:size-11';

const SOCIAL_LINKS = [
  { href: GITHUB_URL, Icon: IconBrandGithub, label: 'GitHub' },
  { href: LINKEDIN_URL, Icon: IconBrandLinkedin, label: 'LinkedIn' },
] as const;

type ContactLinksProps = {
  className?: string;
  tone?: 'dark' | 'light';
};

export const ContactLinks = ({
  className,
  tone = 'light',
}: ContactLinksProps) => {
  const dark = tone === 'dark';
  const buttonVariant = dark ? 'outlineInverse' : 'outline';
  const textButtonSize = dark ? 'lg' : 'default';
  const iconButtonSize = dark ? 'iconLg' : 'icon';
  const textButtonClassName = cn(
    COMPACT_TEXT_BUTTON_CLASS,
    !dark && 'max-sm:flex-1',
  );

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3',
        COMPACT_ROW_CLASS,
        className,
      )}
    >
      {dark ? (
        <EmailPill />
      ) : (
        <Button asChild className={textButtonClassName} size={textButtonSize}>
          <a href={EMAIL_HREF}>
            <IconMail aria-hidden stroke={ICON_STROKE_WIDTH} />
            {EMAIL_ME_LABEL}
          </a>
        </Button>
      )}
      <Button
        asChild
        className={textButtonClassName}
        size={textButtonSize}
        variant={buttonVariant}
      >
        <a href={RESUME_PATH} {...EXTERNAL_LINK_PROPS}>
          <IconFileText
            aria-hidden
            className='size-5'
            stroke={ICON_STROKE_WIDTH}
          />
          {RESUME_LABEL}
          <NewTabHint hint={PDF_NEW_TAB_HINT} />
        </a>
      </Button>
      {SOCIAL_LINKS.map(({ href, Icon, label }) => (
        <Button
          asChild
          className={COMPACT_ICON_BUTTON_CLASS}
          key={label}
          size={iconButtonSize}
          variant={buttonVariant}
        >
          <a
            aria-label={`${label} ${NEW_TAB_HINT}`}
            href={href}
            title={label}
            {...EXTERNAL_LINK_PROPS}
          >
            <Icon aria-hidden stroke={ICON_STROKE_WIDTH} />
          </a>
        </Button>
      ))}
    </div>
  );
};
