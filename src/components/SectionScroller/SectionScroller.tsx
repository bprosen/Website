'use client';

import { useEffect } from 'react';
import { useSectionUrlSync } from '~/hooks';
import type { SectionSlug } from '~/types';
import { scrollToSection, sectionFromPath, sectionTitle } from '~/utils';

type SectionScrollerProps = {
  section: SectionSlug | null;
};

const browserHandlesScroll = () =>
  window.location.hash !== '' || window.scrollY !== 0;

export const SectionScroller = ({ section }: SectionScrollerProps) => {
  useSectionUrlSync();

  useEffect(() => {
    if (section && !browserHandlesScroll()) {
      scrollToSection(section, 'instant');
    }
  }, [section]);

  useEffect(() => {
    const onPopState = () => {
      if (window.location.hash !== '') {
        return;
      }

      const section = sectionFromPath(window.location.pathname);
      document.title = sectionTitle(section);
      scrollToSection(section);
    };

    window.addEventListener('popstate', onPopState);

    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return null;
};
