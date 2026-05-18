import { useEffect, useMemo, useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  type ImageResizeMode,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useAppTheme, type AppTheme } from '../../theme';
import { AppProgress } from './AppProgress';
import { AppText } from './AppText';

type AppImageStatus = 'loading' | 'loaded' | 'error';

export type AppImageProps = {
  source: ImageSourcePropType | null | undefined;
  fallbackLabel: string;
  height?: number;
  aspectRatio?: number;
  collapseWhenUnavailable?: boolean;
  resizeMode?: ImageResizeMode;
  style?: StyleProp<ViewStyle>;
};

export function AppImage({
  source,
  fallbackLabel,
  height,
  aspectRatio,
  collapseWhenUnavailable = false,
  resizeMode = 'contain',
  style,
}: AppImageProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [status, setStatus] = useState<AppImageStatus>(
    source ? 'loading' : 'error',
  );

  useEffect(() => {
    setStatus(source ? 'loading' : 'error');
  }, [source]);

  const frameStyle = useMemo(
    () => [
      styles.frame,
      height != null ? { height } : null,
      aspectRatio != null ? { aspectRatio } : null,
      style,
    ],
    [styles.frame, height, aspectRatio, style],
  );

  const isUnavailable = !source || status === 'error';

  if (isUnavailable && collapseWhenUnavailable) {
    return null;
  }

  if (isUnavailable) {
    return (
      <View style={frameStyle}>
        <View style={styles.stateLayer}>
          <AppText variant="caption" color="muted" style={styles.fallbackLabel}>
            {fallbackLabel}
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={frameStyle}>
      {status === 'loading' ? (
        <View style={styles.stateLayer}>
          <View style={styles.loadingBar}>
            <AppProgress variant="bar" indeterminate />
          </View>
        </View>
      ) : null}
      <Image
        accessibilityIgnoresInvertColors
        source={source}
        style={[styles.image, status !== 'loaded' && styles.imageHidden]}
        resizeMode={resizeMode}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    frame: {
      width: '100%',
      overflow: 'hidden',
      borderRadius: theme.radius.radius_md,
      backgroundColor: theme.colors.surfaceMuted,
    },
    stateLayer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.space_4,
    },
    loadingBar: {
      width: '40%',
      alignSelf: 'center',
    },
    fallbackLabel: {
      textAlign: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    imageHidden: {
      opacity: 0,
    },
  });
}
