import { Header, UnderConstruction } from '~/components';
import { VantaNet } from '~/ui';
import { isMobile } from '~/utils/utils';

export const Home = async () => {
  const mobile = await isMobile();

  return (
    <VantaNet
      backgroundColor='var(--primary)'
      className='flex flex-col h-screen relative'
      gyroControls={mobile}
      maxDistance={mobile ? 20.0 : 18}
      mouseControls={!mobile}
      spacing={mobile ? 18.0 : 15.0}
      touchControls={mobile}
    >
      <Header />
      <div className='flex flex-col items-center justify-center h-screen'>
        <UnderConstruction />
      </div>
    </VantaNet>
  );
};
