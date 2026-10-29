import { IconArrowUpRight, IconBrandGithub } from '@tabler/icons-react';
import { GITHUB_LINK_CONTEXT, ICON_STROKE } from '~/constants';
import { cn } from '~/lib/ui';
import type { WorkEntry as WorkEntryData } from '~/types';
import { Button } from '~/ui';
import { Collage } from '../Collage';
import { StatRow } from '../StatRow';
import { TechList } from '../TechList';

type WorkEntryProps = {
  entry: WorkEntryData;
  first?: boolean;
  last?: boolean;
};

export const WorkEntry = ({ entry, first, last }: WorkEntryProps) => {
  const {
    collage,
    company,
    id,
    link,
    period,
    role,
    roleNote,
    stats,
    summary,
    tech,
  } = entry;
  const scrollSpyTimeline = id;

  return (
    <article className={first ? undefined : 'pt-16'}>
      <span
        aria-hidden
        className='invisible relative -top-[120px] block h-0'
        id={id}
      />
      <div
        className={cn(scrollSpyTimeline, !last && 'pb-16')}
        data-reveal-group
        data-work-entry={id}
      >
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
        {link && (
          <Button
            asChild
            className='mt-5 hover:bg-paper'
            size='nav'
            variant='outline'
          >
            <a
              aria-label={`${link.label} ${GITHUB_LINK_CONTEXT}`}
              href={link.href}
              rel='noopener'
              target='_blank'
            >
              <IconBrandGithub
                aria-hidden
                className='size-5'
                stroke={ICON_STROKE}
              />
              {link.label}
              <IconArrowUpRight
                aria-hidden
                className='size-4'
                stroke={ICON_STROKE}
              />
            </a>
          </Button>
        )}
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
