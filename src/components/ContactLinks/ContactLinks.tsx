import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconFileText,
  IconMail,
} from '@tabler/icons-react';
import {
  EMAIL,
  GITHUB,
  ICON_STROKE,
  LINKED_IN,
  MAILTO,
  RESUME_PATH,
} from '~/constants';
import { cn } from '~/lib/ui';
import { Button } from '~/ui';

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

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      <Button asChild size={size} variant={dark ? 'accent' : 'default'}>
        <a href={MAILTO}>
          <IconMail aria-hidden stroke={ICON_STROKE} />
          {dark ? EMAIL : 'Email me'}
        </a>
      </Button>
      <Button asChild size={size} variant={outline}>
        <a href={RESUME_PATH} rel='noopener' target='_blank'>
          <IconFileText aria-hidden className='size-5' stroke={ICON_STROKE} />
          Resume
        </a>
      </Button>
      <Button asChild size={iconSize} variant={outline}>
        <a aria-label='GitHub' href={GITHUB} title='GitHub'>
          <IconBrandGithub aria-hidden stroke={ICON_STROKE} />
        </a>
      </Button>
      <Button asChild size={iconSize} variant={outline}>
        <a aria-label='LinkedIn' href={LINKED_IN} title='LinkedIn'>
          <IconBrandLinkedin aria-hidden stroke={ICON_STROKE} />
        </a>
      </Button>
    </div>
  );
};
