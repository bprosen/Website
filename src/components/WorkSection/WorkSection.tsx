import { Fragment } from 'react';
import { WORK, WORK_HEADING, WORK_SECTION_ID } from '~/constants';
import { Separator } from '~/ui';
import { WorkEntry } from '../WorkEntry';
import { WorkNav } from '../WorkNav';

export const WorkSection = () => (
  <section
    className='work-timeline bg-accent mx-[clamp(12px,2vw,24px)] rounded-[40px] pt-[clamp(64px,6vw,88px)] pb-[clamp(40px,6vw,88px)] outline-none'
    id={WORK_SECTION_ID}
    tabIndex={-1}
  >
    <div className='page-container flex flex-wrap gap-x-20 gap-y-10'>
      <h2 className='sr-only lg:hidden'>{WORK_HEADING}</h2>
      <WorkNav className='max-lg:hidden' entries={WORK} />
      <div className='min-w-0 flex-[1_1_520px]'>
        {WORK.map((entry, index) => (
          <Fragment key={entry.id}>
            {index > 0 && <Separator className='bg-ink/25' />}
            <WorkEntry
              entry={entry}
              first={index === 0}
              last={index === WORK.length - 1}
            />
          </Fragment>
        ))}
      </div>
    </div>
  </section>
);
