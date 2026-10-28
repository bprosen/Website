import { COLORS, DISPLAY_FONT, FIRST_NAME } from '~/constants';

type MonogramProps = {
  rounded?: boolean;
  size: number;
};

export const Monogram = ({ rounded = true, size }: MonogramProps) => (
  <div
    style={{
      alignItems: 'center',
      background: COLORS.ink,
      borderRadius: rounded ? size * 0.22 : 0,
      color: COLORS.paper,
      display: 'flex',
      fontFamily: DISPLAY_FONT.name,
      fontSize: size * 0.78,
      fontWeight: DISPLAY_FONT.weight,
      height: size,
      justifyContent: 'center',
      lineHeight: 1,
      paddingBottom: size * 0.06,
      width: size,
    }}
  >
    {FIRST_NAME[0]}
  </div>
);
