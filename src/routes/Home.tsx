import { UnderConstruction } from '~/components';
import { isMobile } from '~/lib/utils';
import { VantaNet } from '~/ui';

export const Home = async () => {
  const mobile = await isMobile();

  return (
    <VantaNet
      backgroundColor='var(--primary)'
      className='flex flex-col items-center justify-center h-screen'
      gyroControls={!mobile}
      maxDistance={mobile ? 20.0 : 18}
      mouseControls={!mobile}
      spacing={mobile ? 18.0 : 15.0}
      touchControls={!mobile}
    >
      <UnderConstruction />
    </VantaNet>
  );
};
