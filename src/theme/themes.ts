import {
  layout,
  nordicPaperColors,
  nordicPaperShadows,
  nightStoryColors,
  nightStoryShadows,
  opacity,
  radius,
  spacing,
  typography,
  type ColorTokens,
  type LayoutTokens,
  type OpacityTokens,
  type RadiusTokens,
  type ShadowTokens,
  type SpacingTokens,
  type TypographyTokens,
} from './tokens';

export type ThemeName = 'nordicPaper' | 'nightStory';

export type ColorScheme = 'light' | 'dark';

export type AppTheme = {
  name: ThemeName;
  colorScheme: ColorScheme;
  displayName: string;
  colors: ColorTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  typography: TypographyTokens;
  shadows: ShadowTokens;
  opacity: OpacityTokens;
  layout: LayoutTokens;
};

const sharedTokens = {
  spacing,
  radius,
  typography,
  opacity,
  layout,
} as const;

/** Nordic Paper — light theme */
export const nordicPaperTheme: AppTheme = {
  name: 'nordicPaper',
  colorScheme: 'light',
  displayName: 'Nordic Paper',
  colors: nordicPaperColors,
  shadows: nordicPaperShadows,
  ...sharedTokens,
};

/** Night Story — dark theme */
export const nightStoryTheme: AppTheme = {
  name: 'nightStory',
  colorScheme: 'dark',
  displayName: 'Night Story',
  colors: nightStoryColors,
  shadows: nightStoryShadows,
  ...sharedTokens,
};

export const themes = {
  nordicPaper: nordicPaperTheme,
  nightStory: nightStoryTheme,
} as const;

export function getThemeForColorScheme(
  colorScheme: ColorScheme | null | undefined,
): AppTheme {
  return colorScheme === 'dark' ? nightStoryTheme : nordicPaperTheme;
}
