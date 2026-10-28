import {
  AboutSection,
  Hero,
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
  <div className='tl-root min-h-screen'>
  </div>
);
