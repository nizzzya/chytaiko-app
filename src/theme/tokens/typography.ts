import type { TextStyle } from 'react-native';

export type TypographyToken = Pick<TextStyle, 'fontSize' | 'lineHeight' | 'fontWeight'>;

export type TypographyTokens = {
  display: TypographyToken;
  h1: TypographyToken;
  h2: TypographyToken;
  h3: TypographyToken;
  bodyLarge: TypographyToken;
  body: TypographyToken;
  caption: TypographyToken;
  reader: TypographyToken;
};

/** System sans-serif — SF Pro, Roboto, Segoe UI (DESIGN_CODE §22) */
export const typography: TypographyTokens = {
  display: { fontSize: 32, lineHeight: 40, fontWeight: '600' },
  h1: { fontSize: 28, lineHeight: 36, fontWeight: '600' },
  h2: { fontSize: 22, lineHeight: 30, fontWeight: '600' },
  h3: { fontSize: 18, lineHeight: 26, fontWeight: '500' },
  bodyLarge: { fontSize: 17, lineHeight: 26, fontWeight: '400' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  reader: { fontSize: 20, lineHeight: 34, fontWeight: '400' },
};
