import {
  AboutSection,
  Hero,
  SectionScroller,
  SiteFooter,
  SiteHeader,
  WorkSection,
} from '~/components';
import type { SectionSlug } from '~/utils';

type HomeProps = {
  section?: SectionSlug | null;
};

export const Home = ({ section = null }: HomeProps) => (
  <div className='tl-root min-h-screen'>
    <SiteHeader />
    <main>
      <Hero />
      <WorkSection />
      <AboutSection />
    </main>
    <SiteFooter />
    <SectionScroller section={section} />
  </div>
);
