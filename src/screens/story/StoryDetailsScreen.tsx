import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppButton,
  AppErrorState,
  AppImage,
  AppLoadingState,
  AppScreen,
  AppText,
} from '../../components/ui';
import {
  isHydrated,
  subscribeHydration,
} from '../../features/app/services/appHydrationService';
import {
  addFavorite,
  isFavorite,
  removeFavorite,
} from '../../features/favorites';
import { getProgress } from '../../features/reader';
import { STORY_CATEGORY_LABELS } from '../../features/stories/constants';
import { useStoryImageSource } from '../../features/stories/hooks/useStoryImageSource';
import { getStoryById } from '../../features/stories/services/storiesService';
import type { RootStackParamList } from '../../navigation/types';
import type { ReadingProgress } from '../../types/readingProgress';
import { useAppTheme, type AppTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StoryDetails'>;

function getReadButtonLabel(progress: ReadingProgress | null): string {
  if (progress && !progress.completed) {
    return 'Продовжити читання';
  }

  return 'Читати';
}

export function StoryDetailsScreen({ navigation, route }: Props) {
  const { storyId } = route.params;
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const story = getStoryById(storyId);
  const coverImage = useStoryImageSource(story?.coverImage);
  const [isStoryFavorite, setIsStoryFavorite] = useState(false);
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [hydrationReady, setHydrationReady] = useState(isHydrated());

  useEffect(() => subscribeHydration(() => setHydrationReady(true)), []);

  const refreshScreenState = useCallback(() => {
    setIsStoryFavorite(isFavorite(storyId));

    const progressResult = getProgress(storyId);
    setProgress(progressResult.success ? progressResult.data : null);
  }, [storyId]);

  useEffect(() => {
    if (!hydrationReady) {
      return;
    }

    refreshScreenState();
  }, [hydrationReady, refreshScreenState]);

  useFocusEffect(
    useCallback(() => {
      if (!hydrationReady) {
        return;
      }

      refreshScreenState();
    }, [hydrationReady, refreshScreenState]),
  );

  const handleToggleFavorite = () => {
    if (isStoryFavorite) {
      removeFavorite(storyId);
    } else {
      addFavorite(storyId);
    }

    refreshScreenState();
  };

  const handleRead = () => {
    if (!story) {
      return;
    }

    navigation.navigate('Reader', { storyId: story.id });
  };

  if (!story) {
    return (
      <AppScreen centered>
        <AppErrorState
          title="Казку не знайдено"
          message="Можливо, її більше немає в каталозі."
          actionLabel="До каталогу"
          onRetry={() => navigation.navigate('Home')}
        />
      </AppScreen>
    );
  }

  if (!hydrationReady) {
    return (
      <AppScreen>
        <AppLoadingState variant="bar" />
      </AppScreen>
    );
  }

  const categoryLabel = STORY_CATEGORY_LABELS[story.category];
  const hasProgress = progress !== null;
  const isCompleted = progress?.completed === true;
  const readButtonLabel = getReadButtonLabel(progress);

  return (
    <AppScreen padded={false}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.coverSection}>
          <View style={styles.coverFrame}>
            <AppImage
              source={coverImage.source}
              fallbackLabel="Обкладинка"
              aspectRatio={3 / 4}
              resizeMode="cover"
              style={styles.coverImage}
            />
          </View>
        </View>

        <View style={styles.content}>
          <AppText variant="h1" style={styles.title}>
            {story.title}
          </AppText>

          <AppText variant="caption" color="muted" style={styles.meta}>
            {story.ageGroup} · {categoryLabel} · {story.pageCount} стор.
          </AppText>

          {isStoryFavorite || (hasProgress && !isCompleted) || isCompleted ? (
            <View style={styles.statusNotes}>
              {isStoryFavorite ? (
                <AppText variant="caption" color="secondary" style={styles.statusNote}>
                  Ця казка збережена в обраній поличці.
                </AppText>
              ) : null}

              {hasProgress && !isCompleted ? (
                <AppText variant="caption" color="secondary" style={styles.statusNote}>
                  Ви зупинилися на сторінці {progress.lastPage} — можемо
                  продовжити разом.
                </AppText>
              ) : null}

              {isCompleted ? (
                <AppText variant="caption" color="secondary" style={styles.statusNote}>
                  Ви вже прочитали цю казку разом.
                </AppText>
              ) : null}
            </View>
          ) : null}

          <AppText variant="bodyLarge" color="secondary" style={styles.description}>
            {story.description}
          </AppText>

          <View style={styles.readAction}>
            <AppButton label={readButtonLabel} onPress={handleRead} />
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isStoryFavorite ? 'Прибрати з обраного' : 'Додати в обране'
            }
            onPress={handleToggleFavorite}
            style={({ pressed }) => [
              styles.favoriteAction,
              pressed && styles.favoriteActionPressed,
            ]}
          >
            <AppText variant="caption" color="muted" style={styles.favoriteActionLabel}>
              {isStoryFavorite ? 'Прибрати з обраної полички' : 'Зберегти в обраному'}
            </AppText>
          </Pressable>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    scroll: {
      paddingBottom: theme.spacing.space_16,
    },
    coverSection: {
      paddingTop: theme.spacing.space_5,
      paddingHorizontal: theme.layout.screenPadding,
      alignItems: 'center',
    },
    coverFrame: {
      width: '54%',
      maxWidth: 220,
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.radius_md,
      padding: theme.spacing.space_2,
    },
    coverImage: {
      width: '100%',
      borderRadius: theme.radius.radius_sm,
      backgroundColor: theme.colors.surface,
    },
    content: {
      paddingHorizontal: theme.layout.screenPadding,
      paddingTop: theme.spacing.space_6,
      gap: theme.spacing.space_3,
    },
    title: {
      fontWeight: '600',
      letterSpacing: -0.3,
      lineHeight: theme.typography.h1.lineHeight,
    },
    meta: {
      fontSize: 11,
      lineHeight: 14,
      opacity: 0.36,
      letterSpacing: 0.2,
    },
    statusNotes: {
      marginTop: theme.spacing.space_2,
      gap: theme.spacing.space_2,
    },
    statusNote: {
      opacity: 0.62,
      lineHeight: theme.typography.caption.lineHeight + 4,
    },
    description: {
      marginTop: theme.spacing.space_4,
      lineHeight: theme.typography.bodyLarge.lineHeight + 6,
      opacity: 0.82,
    },
    readAction: {
      marginTop: theme.spacing.space_8,
    },
    favoriteAction: {
      alignSelf: 'center',
      minHeight: 44,
      marginTop: theme.spacing.space_4,
      paddingHorizontal: theme.spacing.space_4,
      paddingVertical: theme.spacing.space_2,
      justifyContent: 'center',
    },
    favoriteActionPressed: {
      opacity: theme.opacity.pressed,
    },
    favoriteActionLabel: {
      opacity: 0.58,
      letterSpacing: 0.15,
    },
  });
}
