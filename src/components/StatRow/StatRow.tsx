import type { Stat } from '~/types';

type StatRowProps = {
  stats: readonly Stat[];
};

export const StatRow = ({ stats }: StatRowProps) => (
  <ul className='mt-7 mb-6 flex flex-wrap justify-center gap-x-4 gap-y-5 text-center sm:justify-start sm:gap-x-12 sm:text-left'>
    {stats.map(({ label, value }) => (
      <li className='flex flex-[1_1_8.5rem] flex-col sm:flex-none' key={label}>
        <span className='font-serif text-[clamp(36px,4vw,48px)] leading-none font-semibold tracking-[-0.03em]'>
          {value}
        </span>
        <span className='text-muted-deep mt-1.5 text-[13px] whitespace-nowrap sm:text-[15px]'>
          {label}
        </span>
      </li>
    ))}
  </ul>
);
