import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import { useAppTheme } from '../../../theme';
import {
  resolveReaderLayout,
  type ReaderLayoutMetrics,
} from '../services/readerLayoutService';

export type { ReaderDeviceType, ReaderLayoutMetrics, ReaderLayoutMode } from '../services/readerLayoutService';

export function useReaderLayout(): ReaderLayoutMetrics {
  const { width, height } = useWindowDimensions();
  const { theme } = useAppTheme();

  return useMemo(
    () =>
      resolveReaderLayout({
        screenWidth: width,
        screenHeight: height,
        contentPadding: theme.layout.readerHorizontalPadding,
        tabletContentPadding: theme.spacing.space_8,
      }),
    [width, height, theme.layout.readerHorizontalPadding, theme.spacing.space_8],
  );
}
