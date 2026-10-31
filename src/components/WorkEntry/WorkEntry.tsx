import { IconArrowUpRight, IconBrandGithub } from '@tabler/icons-react';
import {
  COLLAGE_LABEL_SUFFIX,
  EXTERNAL_LINK_PROPS,
  GITHUB_LINK_LABEL_SUFFIX,
  ICON_STROKE_WIDTH,
  NEW_TAB_HINT,
} from '~/constants';
import { cn } from '~/lib/ui';
import type { Job } from '~/types';
import { Button } from '~/ui';
import { timelineClass } from '~/utils';
import { Collage } from '../Collage';
import { StatRow } from '../StatRow';
import { TechList } from '../TechList';

type WorkEntryProps = {
  entry: Job;
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

  return (
    <article className={first ? undefined : 'pt-16'}>
      <span
        aria-hidden
        className='invisible relative -top-12 block h-0'
        id={id}
      />
      <div
        className={cn(timelineClass(id), !last && 'pb-16')}
        data-reveal-group
        data-work-entry={id}
      >
        <p className='text-muted-deep text-base'>{period}</p>
        <h3 className='mt-1.5 font-serif text-[clamp(40px,5vw,64px)] leading-none font-semibold tracking-[-0.035em]'>
          {company}
        </h3>
        <p className='mt-3.5 text-pretty'>
          <strong className='font-semibold'>{role}</strong>{' '}
          <span className='text-muted-deep'>
            <span aria-hidden>·{'\u00a0'}</span>
            {roleNote}
          </span>
        </p>
        {stats && <StatRow stats={stats} />}
        <p className='mt-3 max-w-[620px] text-pretty'>{summary}</p>
        <TechList className='mt-5' items={tech} />
        {link && (
          <Button
            asChild
            className='hover:bg-paper mt-5'
            size='nav'
            variant='outline'
          >
            <a
              aria-label={`${link.label} ${GITHUB_LINK_LABEL_SUFFIX} ${NEW_TAB_HINT}`}
              href={link.href}
              {...EXTERNAL_LINK_PROPS}
            >
              <IconBrandGithub
                aria-hidden
                className='size-5'
                stroke={ICON_STROKE_WIDTH}
              />
              {link.label}
              <IconArrowUpRight
                aria-hidden
                className='size-4'
                stroke={ICON_STROKE_WIDTH}
              />
            </a>
          </Button>
        )}
        {collage && (
          <Collage
            className='mt-7'
            label={`${company} ${COLLAGE_LABEL_SUFFIX}`}
            slots={collage}
          />
        )}
      </div>
    </article>
  );
};
