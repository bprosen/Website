import { BRANDS, type BrandName } from '~/constants';
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
  const brand = BRANDS[name];

  return (
    <svg
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={className}
      role={label ? 'img' : undefined}
      viewBox='0 0 24 24'
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
