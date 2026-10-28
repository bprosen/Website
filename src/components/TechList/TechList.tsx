import { BRANDS, type BrandName } from '~/constants';
import { cn } from '~/lib/ui';
import { Badge } from '~/ui';
import { BrandIcon } from '../BrandIcon';

type TechListProps = {
  className?: string;
  items: readonly BrandName[];
};

export const TechList = ({ className, items }: TechListProps) => (
  <ul
    aria-label='Tech used'
    className={cn('m-0 flex list-none flex-wrap gap-2 p-0', className)}
  >
    {items.map((name) => {
      const brand = BRANDS[name];

      return (
        <Badge asChild key={name} variant='tech'>
          <li>
            <BrandIcon name={name} />
            {'label' in brand ? brand.label : name}
          </li>
        </Badge>
      );
    })}
  </ul>
);
