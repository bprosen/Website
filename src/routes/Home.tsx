import {
  AboutSection,
  Hero,
  ScrollReveal,
  SectionScroller,
  SiteFooter,
  SiteHeader,
  WorkSection,
} from '~/components';
import { MAIN_CONTENT_ID, SKIP_LINK_LABEL } from '~/constants';
import type { SectionSlug } from '~/utils';

type HomeProps = {
  section?: SectionSlug | null;
};

export const Home = ({ section = null }: HomeProps) => (
  <div className='min-h-screen'>
    <a
      className='sr-only rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground no-underline focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60'
      href={`#${MAIN_CONTENT_ID}`}
    >
      {SKIP_LINK_LABEL}
    </a>
    <SiteHeader />
    <main className='outline-none' id={MAIN_CONTENT_ID} tabIndex={-1}>
      <Hero />
      <WorkSection />
      <AboutSection eagerPhotos={section === 'about'} />
    </main>
    <SiteFooter />
    <SectionScroller section={section} />
    <ScrollReveal />
  </div>
);
