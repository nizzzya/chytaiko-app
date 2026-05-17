/** Spacing scale — 4px base (DESIGN_CODE §20) */
export const spacing = {
  space_0: 0,
  space_1: 4,
  space_2: 8,
  space_3: 12,
  space_4: 16,
  space_5: 20,
  space_6: 24,
  space_8: 32,
  space_10: 40,
  space_12: 48,
  space_16: 64,
} as const;

export type SpacingTokens = typeof spacing;
