import { useEffect } from 'react';
import { SECTION_ACTIVE_LINE, SECTIONS } from '~/constants';
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
      const section = activeSection(
        readSectionTops(),
        window.innerHeight * SECTION_ACTIVE_LINE,
        isAtPageEnd(
          window.scrollY,
          window.innerHeight,
          document.documentElement.scrollHeight,
        ),
      );
      const path = sectionPath(section);

      if (path !== window.location.pathname) {
        window.history.replaceState(window.history.state, '', path);
        document.title = sectionTitle(section);
      }
    };

    const onScroll = () => {
      if (frame === 0) {
        frame = requestAnimationFrame(sync);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
};
