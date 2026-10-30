'use client';

import type { ComponentProps, MouseEvent } from 'react';
import type { SectionSlug } from '~/types';
import {
  hasSectionTarget,
  isPlainLeftClick,
  scrollToSection,
  sectionPath,
  sectionTitle,
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

    if (
      event.defaultPrevented ||
      !isPlainLeftClick(event) ||
      !hasSectionTarget(section)
    ) {
      return;
    }

    event.preventDefault();

    if (window.location.pathname !== href) {
      window.history.pushState(null, '', `${href}${window.location.search}`);
    }

    document.title = sectionTitle(section);
    scrollToSection(section);
  };

  return <a href={href} onClick={handleClick} {...props} />;
};
