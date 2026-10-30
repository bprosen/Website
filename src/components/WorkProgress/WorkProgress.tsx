'use client';

import { useEffect, useRef } from 'react';
import { WORK_SECTION_ID } from '~/constants';
import { cn } from '~/lib/ui';
import { passedFraction, spansLine } from '~/utils';

const entryElement = (id: string) =>
  document.querySelector(`[data-work-entry="${id}"]`);

type WorkProgressProps = {
  className?: string;
  entryIds: readonly string[];
};

export const WorkProgress = ({ className, entryIds }: WorkProgressProps) => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const section = document.getElementById(WORK_SECTION_ID);

    if (!bar || !section) {
      return;
    }

    const entryElements = entryIds.map(entryElement);
    const fills = [...bar.querySelectorAll<HTMLElement>('[data-fill]')];
    let frame = 0;

    const update = () => {
      frame = 0;
      const readingLineY = window.innerHeight / 2;
      const { bottom, top } = section.getBoundingClientRect();
      const entryRects = entryElements.map((entry) =>
        entry ? entry.getBoundingClientRect() : null,
      );

      bar.dataset.active = String(spansLine(top, bottom, readingLineY));

      for (const [index, rect] of entryRects.entries()) {
        const fill = fills[index];

        if (rect && fill) {
          fill.style.transform = `scaleX(${passedFraction(rect.top, rect.height, readingLineY)})`;
        }
      }
    };

    const scheduleUpdate = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('scroll', scheduleUpdate);
      cancelAnimationFrame(frame);
    };
  }, [entryIds]);

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
      {entryIds.map((id) => (
        <span
          className='bg-ink/15 h-[3px] flex-1 overflow-hidden rounded-full'
          key={id}
        >
          <span
            className='bg-coral block h-full origin-left'
            data-fill
            style={{ transform: 'scaleX(0)' }}
          />
        </span>
      ))}
    </div>
  );
};
