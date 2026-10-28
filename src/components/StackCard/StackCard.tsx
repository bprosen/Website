import type { CSSProperties } from 'react';
import { BRANDS, STACK_GRID } from '~/constants';
import { cn } from '~/lib/ui';
import { Card, CardContent, CardHeader, CardTitle } from '~/ui';
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
      <ul className='m-0 grid list-none grid-cols-4 gap-x-3 gap-y-6 p-0'>
        {STACK_GRID.map((name) => (
          <li
            className={cn(
              'group flex aspect-square items-center justify-center',
              'transition-[translate,scale] duration-200 hover:-translate-y-[3px] hover:scale-110',
            )}
            key={name}
            style={{ '--c': BRANDS[name].color } as CSSProperties}
            title={name}
          >
            <BrandIcon
              className='size-10 fill-ink transition-[fill] duration-200 group-hover:fill-(--c)'
              label={name}
              name={name}
              tinted={false}
            />
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);
