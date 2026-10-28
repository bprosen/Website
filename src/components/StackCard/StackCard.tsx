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
              'group flex flex-col items-center gap-2 text-center',
              isDarkBrand(BRANDS[name].color) && 'dark:[--c:var(--ink)]',
            )}
            key={name}
            style={{ '--c': BRANDS[name].color } as CSSProperties}
          >
            <BrandIcon
              className='size-10 fill-ink transition-[fill,translate,scale] duration-200 group-hover:-translate-y-[3px] group-hover:scale-110 group-hover:fill-(--c)'
              name={name}
              tinted={false}
            />
            <span className='text-xs leading-tight text-muted-foreground'>
              {name}
            </span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);
