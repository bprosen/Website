import { Fragment } from 'react';
import { WORK } from '~/constants';
import { Separator } from '~/ui';
import { WorkEntry } from '../WorkEntry';
import { WorkNav } from '../WorkNav';

export const WorkSection = () => (
  <section
    className='tl-spy mx-[clamp(12px,2vw,24px)] scroll-mt-[72px] outline-none rounded-[40px] bg-accent pt-[clamp(64px,6vw,88px)] pb-[clamp(40px,6vw,88px)]'
    id='work'
    tabIndex={-1}
  >
    <div className='mx-auto flex max-w-[1240px] flex-wrap gap-x-20 gap-y-10 px-[clamp(20px,5vw,56px)]'>
      <h2 className='sr-only min-[761px]:hidden'>Work</h2>
      <WorkNav className='max-[761px]:hidden' entries={WORK} />
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
