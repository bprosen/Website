import { WORK_HEADING, WORK_HISTORY_LABEL } from '~/constants';
import { cn } from '~/lib/ui';
import type { Job } from '~/types';
import { Card } from '~/ui';
import { timelineLinkClass } from '~/utils';

type WorkNavProps = {
  className?: string;
  entries: readonly Job[];
};

export const WorkNav = ({ className, entries }: WorkNavProps) => (
  <div className={cn('min-w-0 flex-[0_0_268px]', className)}>
    <Card className='sticky top-28 gap-0 p-6'>
      <nav aria-label={WORK_HISTORY_LABEL}>
        <h2 className='mb-6 font-serif text-xl font-semibold'>
          {WORK_HEADING}
        </h2>
        <div className='relative pl-[22px]'>
          <span
            aria-hidden
            className='bg-ink/20 absolute top-7 bottom-7 left-0 w-0.5'
          >
            <span className='timeline-fill bg-ink absolute inset-x-0 top-0 h-0' />
            <span className='timeline-head' />
          </span>
          <ol className='flex flex-col gap-2'>
            {entries.map(({ company, id, period }) => (
              <li className='relative' key={id}>
                <span aria-hidden className='timeline-dot' />
                <a
                  className={cn(
                    timelineLinkClass(id),
                    'flex min-h-14 flex-col justify-center',
                  )}
                  href={`#${id}`}
                >
                  <span className='font-serif text-[22px] leading-[1.2] font-semibold'>
                    {company}
                  </span>
                  <span className='text-muted-deep text-sm'>{period}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </Card>
  </div>
);
