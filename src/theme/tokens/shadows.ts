import type { ViewStyle } from 'react-native';

export type ShadowToken = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

export type ShadowTokens = {
  shadow_none: ShadowToken;
  shadow_sm: ShadowToken;
  shadow_md: ShadowToken;
  shadow_lg: ShadowToken;
};

const SHADOW_COLOR_LIGHT = 'rgb(58, 56, 52)';
const SHADOW_COLOR_DARK = '#000000';

function createShadow(
  offsetY: number,
  radius: number,
  color: string,
  shadowOpacity: number,
  elevation: number,
): ShadowToken {
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity,
    shadowRadius: radius,
    elevation,
  };
}

const shadowNone: ShadowToken = {
  shadowColor: 'transparent',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0,
  shadowRadius: 0,
  elevation: 0,
};

/** Nordic Paper shadows (DESIGN_CODE §23) */
export const nordicPaperShadows: ShadowTokens = {
  shadow_none: shadowNone,
  shadow_sm: createShadow(1, 3, SHADOW_COLOR_LIGHT, 0.06, 1),
  shadow_md: createShadow(2, 8, SHADOW_COLOR_LIGHT, 0.08, 2),
  shadow_lg: createShadow(4, 16, SHADOW_COLOR_LIGHT, 0.1, 4),
};

/** Night Story shadows (DESIGN_CODE §23) */
export const nightStoryShadows: ShadowTokens = {
  shadow_none: shadowNone,
  shadow_sm: createShadow(1, 3, SHADOW_COLOR_DARK, 0.2, 1),
  shadow_md: createShadow(2, 8, SHADOW_COLOR_DARK, 0.24, 2),
  shadow_lg: createShadow(4, 16, SHADOW_COLOR_DARK, 0.28, 4),
};
