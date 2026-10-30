import type { CSSProperties } from 'react';
import {
  BRANDS,
  EXTERNAL_LINK_PROPS,
  STACK_BRANDS,
  STACK_HEADING,
} from '~/constants';
import { cn } from '~/lib/ui';
import { Card, CardContent, CardHeader, CardTitle } from '~/ui';
import { isDarkBrand } from '~/utils';
import { BrandIcon } from '../BrandIcon';
import { NewTabHint } from '../NewTabHint';

type StackCardProps = {
  className?: string;
};

export const StackCard = ({ className }: StackCardProps) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle className='text-forest'>{STACK_HEADING}</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className='grid grid-cols-4 gap-x-3 gap-y-5'>
        {STACK_BRANDS.map((name) => {
          const brand = BRANDS[name];

          return (
            <li
              className={cn(
                '[--logo-fill:var(--brand-color)]',
                isDarkBrand(brand.color) && 'dark:[--logo-fill:var(--ink)]',
              )}
              key={name}
              style={{ '--brand-color': brand.color } as CSSProperties}
            >
              <a
                className='group flex flex-col items-center gap-2 rounded-lg text-center'
                href={brand.url}
                {...EXTERNAL_LINK_PROPS}
              >
                <BrandIcon
                  className='size-10 fill-(--logo-fill) transition-[translate,scale] duration-200 group-hover:-translate-y-[3px] group-hover:scale-110 group-focus-visible:-translate-y-[3px] group-focus-visible:scale-110'
                  name={name}
                  tinted={false}
                />
                <span className='text-muted-foreground text-xs leading-tight'>
                  {name}
                </span>
                <NewTabHint />
              </a>
            </li>
          );
        })}
      </ul>
    </CardContent>
  </Card>
);
