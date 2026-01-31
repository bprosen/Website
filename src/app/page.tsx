import { FullPageBlurScroll, UnderConstruction } from '~/components';
import { Home } from '~/routes';

const Page: React.FC = () => (
  <FullPageBlurScroll blur>
    <Home />
    <UnderConstruction />
  </FullPageBlurScroll>
);

export default Page;
