import { BRAND_VIEW_BOX, BRANDS, type BrandName } from '~/constants';
import type { Brand } from '~/types';
import { isDarkBrand } from '~/utils';

type BrandIconProps = {
  className?: string;
  label?: string;
  name: BrandName;
  tinted?: boolean;
};

export const BrandIcon = ({
  className,
  label,
  name,
  tinted = true,
}: BrandIconProps) => {
  const brand: Brand = BRANDS[name];

  return (
    <svg
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={className}
      role={label ? 'img' : undefined}
      viewBox={brand.viewBox ?? BRAND_VIEW_BOX}
    >
      <path
        className={
          tinted && isDarkBrand(brand.color) ? 'dark:fill-current' : undefined
        }
        d={brand.path}
        fill={tinted ? brand.color : undefined}
      />
    </svg>
  );
};
