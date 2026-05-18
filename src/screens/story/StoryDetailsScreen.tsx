import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppButton,
  AppCard,
  AppErrorState,
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
        <AppCard style={styles.coverCard}>
          <AppText variant="caption" color="muted">
            Обкладинка
          </AppText>
        </AppCard>

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
            <AppText variant="caption" color="primary" style={styles.favoriteNote}>
              В обраному
            </AppText>
          ) : null}

          {hasProgress && !isCompleted ? (
            <AppText variant="body" color="secondary" style={styles.progressNote}>
              Сторінка {progress.lastPage} з {story.pageCount}
            </AppText>
          ) : null}

          {isCompleted ? (
            <AppText variant="body" color="secondary" style={styles.completedNote}>
              Казку прочитано
            </AppText>
          ) : null}

          <AppText variant="bodyLarge" color="secondary" style={styles.description}>
            {story.description}
          </AppText>

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
    coverCard: {
      minHeight: 200,
      marginHorizontal: theme.layout.screenPadding,
      marginTop: theme.spacing.space_4,
      backgroundColor: theme.colors.surfaceMuted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      paddingHorizontal: theme.layout.screenPadding,
      paddingTop: theme.spacing.space_6,
      gap: theme.spacing.space_3,
    },
    meta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.space_3,
      marginTop: theme.spacing.space_2,
    },
    favoriteNote: {
      marginTop: theme.spacing.space_1,
    },
    progressNote: {
      marginTop: theme.spacing.space_1,
    },
    completedNote: {
      marginTop: theme.spacing.space_1,
    },
    description: {
      marginTop: theme.spacing.space_3,
    },
    actions: {
      marginTop: theme.spacing.space_6,
      gap: theme.spacing.space_3,
    },
  });
}
