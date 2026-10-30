import {
  COLORS,
  DISPLAY_FONT,
  FIRST_NAME,
  MONOGRAM_BASELINE_NUDGE_RATIO,
  MONOGRAM_CORNER_RATIO,
  MONOGRAM_LETTER_RATIO,
} from '~/constants';

type MonogramProps = {
  rounded?: boolean;
  size: number;
};

export const Monogram = ({ rounded = true, size }: MonogramProps) => (
  <div
    style={{
      alignItems: 'center',
      background: COLORS.ink,
      borderRadius: rounded ? size * MONOGRAM_CORNER_RATIO : 0,
      color: COLORS.paper,
      display: 'flex',
      fontFamily: DISPLAY_FONT.name,
      fontSize: size * MONOGRAM_LETTER_RATIO,
      fontWeight: DISPLAY_FONT.weight,
      height: size,
      justifyContent: 'center',
      lineHeight: 1,
      paddingBottom: size * MONOGRAM_BASELINE_NUDGE_RATIO,
      width: size,
    }}
  >
    {FIRST_NAME[0]}
  </div>
);
