import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
        <View style={styles.coverFrame}>
          <AppImage
            source={coverImage.source}
            fallbackLabel="Обкладинка"
            height={156}
            style={styles.coverImage}
          />
        </View>

        <View style={styles.content}>
          <AppText variant="h1">{story.title}</AppText>

          <View style={styles.meta}>
            <AppText variant="caption" color="muted">
              Вік {story.ageGroup}
            </AppText>
            <AppText variant="caption" color="muted">
              {categoryLabel}
            </AppText>
            <AppText variant="caption" color="muted">
              {story.pageCount} сторінок
            </AppText>
          </View>

          {isStoryFavorite ? (
            <AppText variant="caption" color="secondary" style={styles.favoriteNote}>
              В обраному
            </AppText>
          ) : null}

          {hasProgress && !isCompleted ? (
            <AppText variant="caption" color="secondary" style={styles.progressNote}>
              Сторінка {progress.lastPage} з {story.pageCount}
            </AppText>
          ) : null}

          {isCompleted ? (
            <AppText variant="caption" color="secondary" style={styles.completedNote}>
              Казку прочитано
            </AppText>
          ) : null}

          <View style={styles.descriptionBlock}>
            <AppText variant="bodyLarge" color="secondary" style={styles.description}>
              {story.description}
            </AppText>
          </View>

          <View style={styles.actions}>
            <AppButton label={readButtonLabel} onPress={handleRead} />
            <AppButton
              label={
                isStoryFavorite ? 'Прибрати з обраного' : 'Додати в обране'
              }
              variant="secondary"
              onPress={handleToggleFavorite}
            />
          </View>
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
    coverFrame: {
      marginHorizontal: theme.layout.screenPadding,
      marginTop: theme.spacing.space_4,
      alignSelf: 'center',
      width: '88%',
    },
    coverImage: {
      borderRadius: theme.radius.radius_lg,
    },
    content: {
      paddingHorizontal: theme.layout.screenPadding,
      paddingTop: theme.spacing.space_5,
      gap: theme.spacing.space_2,
    },
    meta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.space_2,
      marginTop: theme.spacing.space_2,
      opacity: 0.82,
    },
    favoriteNote: {
      marginTop: theme.spacing.space_2,
      opacity: 0.78,
    },
    progressNote: {
      marginTop: theme.spacing.space_1,
      opacity: 0.78,
    },
    completedNote: {
      marginTop: theme.spacing.space_1,
      opacity: 0.78,
    },
    descriptionBlock: {
      marginTop: theme.spacing.space_4,
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.radius_md,
      paddingHorizontal: theme.spacing.space_4,
      paddingVertical: theme.spacing.space_4,
    },
    description: {
      lineHeight: theme.typography.bodyLarge.lineHeight,
    },
    actions: {
      marginTop: theme.spacing.space_5,
      gap: theme.spacing.space_3,
    },
  });
}
