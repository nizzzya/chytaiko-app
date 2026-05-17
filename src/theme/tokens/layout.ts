import { spacing } from './spacing';

/** Layout tokens (DESIGN_CODE §25) */
export const layout = {
  screenPadding: spacing.space_4,
  sectionGap: spacing.space_8,
  cardGap: spacing.space_4,
  cardMinHeight: 120,
  bottomTabHeight: 56,
  readerHorizontalPadding: spacing.space_6,
  readerVerticalPadding: spacing.space_8,
} as const;

export type LayoutTokens = typeof layout;
