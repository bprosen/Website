import {
  AboutSection,
  Hero,
  ScrollReveal,
  SectionScroller,
  SiteFooter,
  SiteHeader,
  SkipLink,
  WorkSection,
} from '~/components';
import { MAIN_CONTENT_ID } from '~/constants';
import type { SectionSlug } from '~/types';

type HomeProps = {
  section?: SectionSlug | null;
};

export const Home = ({ section = null }: HomeProps) => (
  <div className='min-h-screen'>
    <SkipLink />
    <SiteHeader />
    <main className='outline-none' id={MAIN_CONTENT_ID} tabIndex={-1}>
      <Hero />
      <WorkSection />
      <AboutSection photoLoading={section === 'about' ? 'eager' : 'lazy'} />
    </main>
    <SiteFooter />
    <SectionScroller section={section} />
    <ScrollReveal />
  </div>
);
