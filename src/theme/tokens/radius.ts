/** Border radius tokens (DESIGN_CODE §21) */
export const radius = {
  radius_sm: 6,
  radius_md: 12,
  radius_lg: 16,
  radius_xl: 20,
  radius_2xl: 24,
  radius_full: 9999,
} as const;

export type RadiusTokens = typeof radius;
