/** Minimum width (dp) for tablet reader layout (portrait-oriented). */
export const READER_TABLET_BREAKPOINT = 768;

/** Image height as share of screen height — phone: 35–45%, tablet: 55–65%. */
const PHONE_IMAGE_HEIGHT_RATIO = 0.4;
const TABLET_IMAGE_HEIGHT_RATIO = 0.6;

/** Max text column width on tablet for readable line length. */
const TABLET_TEXT_MAX_WIDTH = 640;

export type ReaderDeviceType = 'phone' | 'tablet';
export type ReaderLayoutMode = 'compact' | 'expanded';

export type ReaderLayoutMetrics = {
  deviceType: ReaderDeviceType;
  layoutMode: ReaderLayoutMode;
  isTablet: boolean;
  imageHeight: number;
  textMaxWidth: number;
  contentPadding: number;
};

export type ReaderLayoutInput = {
  screenWidth: number;
  screenHeight: number;
  contentPadding: number;
  tabletContentPadding?: number;
};

export function getReaderDeviceType(screenWidth: number): ReaderDeviceType {
  return screenWidth >= READER_TABLET_BREAKPOINT ? 'tablet' : 'phone';
}

export function getReaderLayoutMode(deviceType: ReaderDeviceType): ReaderLayoutMode {
  return deviceType === 'tablet' ? 'expanded' : 'compact';
}

/**
 * Resolves reader layout metrics from screen size.
 * Phone: text priority (lower image share). Tablet: illustration priority (higher image share).
 */
export function resolveReaderLayout(input: ReaderLayoutInput): ReaderLayoutMetrics {
  const deviceType = getReaderDeviceType(input.screenWidth);
  const layoutMode = getReaderLayoutMode(deviceType);
  const isTablet = deviceType === 'tablet';

  const contentPadding = isTablet
    ? (input.tabletContentPadding ?? input.contentPadding)
    : input.contentPadding;

  const imageRatio = isTablet ? TABLET_IMAGE_HEIGHT_RATIO : PHONE_IMAGE_HEIGHT_RATIO;
  const imageHeight = Math.round(input.screenHeight * imageRatio);

  const availableWidth = Math.max(input.screenWidth - contentPadding * 2, 0);
  const textMaxWidth = isTablet
    ? Math.min(TABLET_TEXT_MAX_WIDTH, availableWidth)
    : availableWidth;

  return {
    deviceType,
    layoutMode,
    isTablet,
    imageHeight,
    textMaxWidth,
    contentPadding,
  };
}
