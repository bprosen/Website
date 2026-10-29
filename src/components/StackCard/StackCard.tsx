import type { CSSProperties } from 'react';
import { BRANDS, STACK_GRID } from '~/constants';
import { cn } from '~/lib/ui';
import { Card, CardContent, CardHeader, CardTitle } from '~/ui';
import { isDarkBrand } from '~/utils';
import { BrandIcon } from '../BrandIcon';

type StackCardProps = {
  className?: string;
};

export const StackCard = ({ className }: StackCardProps) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle className='text-forest'>What I work with most</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className='m-0 grid list-none grid-cols-4 gap-x-3 gap-y-5 p-0'>
        {STACK_GRID.map((name) => (
          <li
            className={cn(
              '[--c:var(--brand)]',
              isDarkBrand(BRANDS[name].color) && 'dark:[--c:var(--ink)]',
            )}
            key={name}
            style={{ '--brand': BRANDS[name].color } as CSSProperties}
          >
            <a
              className='group flex flex-col items-center gap-2 rounded-lg text-center no-underline outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50'
              href={BRANDS[name].url}
              rel='noopener'
              target='_blank'
            >
              <BrandIcon
                className='size-10 fill-(--c) transition-[translate,scale] duration-200 group-hover:-translate-y-[3px] group-hover:scale-110 group-focus-visible:-translate-y-[3px] group-focus-visible:scale-110'
                name={name}
                tinted={false}
              />
              <span className='text-xs leading-tight text-muted-foreground'>
                {name}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);
