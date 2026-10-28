'use client';

import { useEffect } from 'react';
import { type SectionSlug, scrollToSection, sectionFromPath } from '~/utils';

type SectionScrollerProps = {
  section: SectionSlug | null;
};

const browserHandlesScroll = () =>
  window.location.hash !== '' || window.scrollY !== 0;

export const SectionScroller = ({ section }: SectionScrollerProps) => {
  useEffect(() => {
    if (section && !browserHandlesScroll()) {
      scrollToSection(section, 'instant');
    }
  }, [section]);

  useEffect(() => {
    const onPopState = () => {
      if (window.location.hash === '') {
        scrollToSection(sectionFromPath(window.location.pathname));
      }
    };

    window.addEventListener('popstate', onPopState);

    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return null;
};
