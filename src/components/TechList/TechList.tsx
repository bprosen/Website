import {
  BRANDS,
  type BrandName,
  EXTERNAL_LINK_PROPS,
  TECH_LIST_LABEL,
} from '~/constants';
import { cn } from '~/lib/ui';
import { Badge } from '~/ui';
import { BrandIcon } from '../BrandIcon';
import { NewTabHint } from '../NewTabHint';

type TechListProps = {
  className?: string;
  items: readonly BrandName[];
};

export const TechList = ({ className, items }: TechListProps) => (
  <ul
    aria-label={TECH_LIST_LABEL}
    className={cn('flex flex-wrap gap-2', className)}
  >
    {items.map((name) => {
      const brand = BRANDS[name];

      return (
        <li key={name}>
          <Badge asChild variant='tech'>
            <a href={brand.url} {...EXTERNAL_LINK_PROPS}>
              <BrandIcon name={name} />
              {'label' in brand ? brand.label : name}
              <NewTabHint />
            </a>
          </Badge>
        </li>
      );
    })}
  </ul>
);
