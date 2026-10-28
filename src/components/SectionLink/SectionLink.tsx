'use client';

import type { ComponentProps, MouseEvent } from 'react';
import {
  isPlainLeftClick,
  type SectionSlug,
  scrollToSection,
  sectionPath,
} from '~/utils';

type SectionLinkProps = Omit<ComponentProps<'a'>, 'href'> & {
  section: SectionSlug | null;
};

export const SectionLink = ({
  onClick,
  section,
  ...props
}: SectionLinkProps) => {
  const href = sectionPath(section);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || !isPlainLeftClick(event)) {
      return;
    }

    if (!scrollToSection(section)) {
      return;
    }

    event.preventDefault();

    if (window.location.pathname !== href) {
      window.history.pushState(null, '', href);
    }
  };

  return <a href={href} onClick={handleClick} {...props} />;
};
