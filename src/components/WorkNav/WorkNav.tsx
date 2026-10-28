import { cn } from '~/lib/ui';
import type { WorkEntry } from '~/types';

type WorkNavProps = {
  className?: string;
  entries: readonly WorkEntry[];
};

export const WorkNav = ({ className, entries }: WorkNavProps) => (
  <div className={cn('min-w-0 flex-[0_0_220px]', className)}>
    <nav aria-label='Work history' className='sticky top-28'>
      <h2 className='m-0 mb-6 font-serif text-xl font-semibold'>Work</h2>
      <div className='relative pl-[22px]'>
        <span
          aria-hidden
          className='absolute top-7 bottom-7 left-0 w-0.5 bg-ink/20'
        >
          <span className='spy-fill absolute inset-x-0 top-0 h-0 bg-ink' />
          <span className='spy-head' />
        </span>
        <ol className='m-0 flex list-none flex-col gap-2 p-0'>
          {entries.map(({ company, id, period }) => (
            <li className='relative' key={id}>
              <span aria-hidden className='spy-dot' />
              <a
                className={cn(
                  `spy-${id}`,
                  'box-border flex h-14 flex-col justify-center no-underline',
                )}
                href={`#${id}`}
              >
                <span className='font-serif text-[22px] leading-[1.2] font-semibold'>
                  {company}
                </span>
                <span className='text-sm text-muted-deep'>{period}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  </div>
);
