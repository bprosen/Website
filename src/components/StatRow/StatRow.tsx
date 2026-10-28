import type { Stat } from '~/types';

type StatRowProps = {
  stats: readonly Stat[];
};

export const StatRow = ({ stats }: StatRowProps) => (
  <dl className='mt-7 mb-6 flex flex-wrap gap-x-12 gap-y-5'>
    {stats.map(({ label, value }) => (
      <div className='flex flex-col-reverse' key={label}>
        <dt className='mt-1.5 text-[15px] text-muted-deep'>{label}</dt>
        <dd className='m-0 font-serif text-[clamp(36px,4vw,48px)] leading-none font-semibold tracking-[-0.03em]'>
          {value}
        </dd>
      </div>
    ))}
  </dl>
);
