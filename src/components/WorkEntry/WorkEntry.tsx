import { cn } from '~/lib/ui';
import type { WorkEntry as WorkEntryData } from '~/types';
import { Collage } from '../Collage';
import { StatRow } from '../StatRow';
import { TechList } from '../TechList';

type WorkEntryProps = {
  entry: WorkEntryData;
  first?: boolean;
  last?: boolean;
};

export const WorkEntry = ({ entry, first, last }: WorkEntryProps) => {
  const { collage, company, id, period, role, roleNote, stats, summary, tech } =
    entry;
  const scrollSpyTimeline = id;

  return (
    <article className={first ? undefined : 'pt-16'}>
      <span
        aria-hidden
        className='invisible relative -top-[120px] block h-0'
        id={id}
      />
      <div className={cn(scrollSpyTimeline, !last && 'pb-16')}>
        <p className='m-0 text-base text-muted-deep'>{period}</p>
        <h3 className='mt-1.5 mb-0 font-serif text-[clamp(40px,5vw,64px)] leading-none font-semibold tracking-[-0.035em]'>
          {company}
        </h3>
        <p className='mt-3.5 mb-0'>
          <strong className='font-semibold'>{role}</strong>{' '}
          <span className='text-muted-deep'>· {roleNote}</span>
        </p>
        {stats && <StatRow stats={stats} />}
        <p className='mt-3 mb-0 max-w-[620px] text-pretty'>{summary}</p>
        <TechList className='mt-5' items={tech} />
        {collage && (
          <Collage
            className='mt-7'
            label={`${company} collage`}
            slots={collage}
          />
        )}
      </div>
    </article>
  );
};
