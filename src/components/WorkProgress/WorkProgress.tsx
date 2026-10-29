'use client';

import { useEffect, useRef } from 'react';
import { WORK, WORK_SECTION_ID } from '~/constants';
import { cn } from '~/lib/ui';
import { passedFraction, spansLine } from '~/utils';

type WorkProgressProps = {
  className?: string;
};

const entryElement = (id: string) =>
  document.querySelector(`[data-work-entry="${id}"]`);

export const WorkProgress = ({ className }: WorkProgressProps) => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const section = document.getElementById(WORK_SECTION_ID);

    if (!bar || !section) {
      return;
    }

    const entries = WORK.map(({ id }) => entryElement(id));
    const fills = [...bar.querySelectorAll<HTMLElement>('[data-fill]')];
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight / 2;
      const { bottom, top } = section.getBoundingClientRect();
      bar.dataset.active = String(spansLine(top, bottom, line));

      entries.forEach((entry, index) => {
        const fill = fills[index];
        if (!entry || !fill) {
          return;
        }
        const rect = entry.getBoundingClientRect();
        fill.style.transform = `scaleX(${passedFraction(rect.top, rect.height, line)})`;
      });
    };

    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none flex gap-1 opacity-0 transition-opacity duration-500 ease-out data-[active=true]:opacity-100 motion-reduce:transition-none',
        className,
      )}
      data-active='false'
      ref={barRef}
    >
      {WORK.map(({ id }) => (
        <span
          className='h-[3px] flex-1 overflow-hidden rounded-full bg-ink/15'
          key={id}
        >
          <span
            className='block h-full origin-left bg-coral'
            data-fill
            style={{ transform: 'scaleX(0)' }}
          />
        </span>
      ))}
    </div>
  );
};
