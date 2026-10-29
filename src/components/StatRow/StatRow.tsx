import type { Stat } from '~/types';

type StatRowProps = {
  stats: readonly Stat[];
};

export const StatRow = ({ stats }: StatRowProps) => (
  <dl className='mt-7 mb-6 flex flex-wrap justify-center gap-x-4 gap-y-5 text-center sm:justify-start sm:gap-x-12 sm:text-left'>
    {stats.map(({ label, value }) => (
      <div
        className='flex flex-[1_1_8.5rem] flex-col-reverse sm:flex-none'
        key={label}
      >
        <dt className='mt-1.5 text-[13px] whitespace-nowrap text-muted-deep sm:text-[15px]'>
          {label}
        </dt>
        <dd className='m-0 font-serif text-[clamp(36px,4vw,48px)] leading-none font-semibold tracking-[-0.03em]'>
          {value}
        </dd>
      </div>
    ))}
  </dl>
);
