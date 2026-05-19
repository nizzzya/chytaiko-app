/** Opacity tokens (DESIGN_CODE §24) */
export const opacity = {
  disabled: 0.4,
  pressed: 0.72,
  overlaySoft: 0.24,
  overlayMedium: 0.48,
  overlayStrong: 0.64,
} as const;

export type OpacityTokens = typeof opacity;
