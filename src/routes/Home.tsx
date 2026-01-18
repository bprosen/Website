import { UnderConstruction } from '~/components';
import { VantaNet } from '~/ui';

export const Home = () => {
  return (
    <VantaNet
      backgroundColor='var(--primary)'
      className='flex flex-col items-center justify-center h-screen'
      maxDistance={20.0}
      spacing={15.0}
    >
      <UnderConstruction />
    </VantaNet>
  );
};
