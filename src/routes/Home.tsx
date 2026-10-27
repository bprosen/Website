import { Intro, ScrollDownIndicator } from '~/components';

export const Home = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex-1 flex items-center justify-center'>
        <Intro />
      </div>
      <ScrollDownIndicator />
    </div>
  );
};
