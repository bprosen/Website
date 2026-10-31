import { useEffect } from 'react';
import { SECTION_ACTIVE_LINE_VIEWPORT_RATIO, SECTIONS } from '~/constants';
import { activeSection, isAtPageEnd, sectionPath, sectionTitle } from '~/utils';

const readSectionTops = () =>
  SECTIONS.flatMap(({ slug }) => {
    const element = document.getElementById(slug);
    return element ? [{ slug, top: element.getBoundingClientRect().top }] : [];
  });

export const useSectionUrlSync = () => {
  useEffect(() => {
    let frame = 0;

    const sync = () => {
      frame = 0;
      const activeLineY =
        window.innerHeight * SECTION_ACTIVE_LINE_VIEWPORT_RATIO;
      const atPageEnd = isAtPageEnd(
        window.scrollY,
        window.innerHeight,
        document.documentElement.scrollHeight,
      );
      const section = activeSection(readSectionTops(), activeLineY, atPageEnd);
      const path = sectionPath(section);

      if (path !== window.location.pathname) {
        window.history.replaceState(
          null,
          '',
          `${path}${window.location.search}`,
        );
        document.title = sectionTitle(section);
      }
    };

    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(sync);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
};
