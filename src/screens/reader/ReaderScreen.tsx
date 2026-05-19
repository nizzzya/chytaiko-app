import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppButton,
  AppErrorState,
  AppImage,
  AppLoadingState,
  AppProgress,
  AppScreen,
  AppText,
} from '../../components/ui';
import {
  isHydrated,
  subscribeHydration,
} from '../../features/app/services/appHydrationService';
import {
  getProgress,
  markCompleted,
  saveProgress,
} from '../../features/reader';
import { useStoryImageSource } from '../../features/stories/hooks/useStoryImageSource';
import {
  getStoryById,
  getStoryPages,
} from '../../features/stories/services/storiesService';
import type { RootStackParamList } from '../../navigation/types';
import type { StoryPage } from '../../types/story';
import { useAppTheme, type AppTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Reader'>;

export function ReaderScreen({ navigation, route }: Props) {
  const { storyId } = route.params;
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const story = getStoryById(storyId);
  const pages = getStoryPages(storyId);
  const [hydrationReady, setHydrationReady] = useState(isHydrated());
  const [progressInitialized, setProgressInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => subscribeHydration(() => setHydrationReady(true)), []);

  const restoreProgress = useCallback(() => {
    const result = getProgress(storyId);

    if (!result.success || !result.data) {
      setCurrentPage(1);
      setIsCompleted(false);
      return;
    }

    const lastPage = Math.min(
      Math.max(result.data.lastPage, 1),
      Math.max(pages.length, 1),
    );

    setCurrentPage(lastPage);
    setIsCompleted(result.data.completed);
  }, [storyId, pages.length]);

  useEffect(() => {
    if (!hydrationReady || progressInitialized) {
      return;
    }

    restoreProgress();
    setProgressInitialized(true);
  }, [hydrationReady, progressInitialized, restoreProgress]);

  const goToStoryDetails = () => {
    navigation.navigate('StoryDetails', { storyId });
  };

  if (!story) {
    return (
      <AppScreen centered>
        <AppErrorState
          title="Казку не знайдено"
          message="Не вдалося відкрити цю казку для читання."
          actionLabel="До казки"
          onRetry={goToStoryDetails}
        />
      </AppScreen>
    );
  }

  if (pages.length === 0) {
    return (
      <AppScreen centered>
        <AppErrorState
          title="Немає сторінок"
          message="Ця казка ще не готова до читання."
          actionLabel="До казки"
          onRetry={goToStoryDetails}
        />
      </AppScreen>
    );
  }

  if (!hydrationReady || !progressInitialized) {
    return (
      <AppScreen>
        <AppLoadingState variant="bar" />
      </AppScreen>
    );
  }

  if (isCompleted) {
    return (
      <ReaderCompletedView
        storyTitle={story.title}
        styles={styles}
        onBackToStory={goToStoryDetails}
      />
    );
  }

  return (
    <ReaderContent
      storyTitle={story.title}
      storyId={storyId}
      pages={pages}
      currentPage={currentPage}
      styles={styles}
      onPageChange={setCurrentPage}
      onComplete={() => {
        saveProgress(storyId, pages.length);
        markCompleted(storyId);
        setIsCompleted(true);
      }}
      onBackToStory={goToStoryDetails}
    />
  );
}

type ReaderContentProps = {
  storyTitle: string;
  storyId: string;
  pages: StoryPage[];
  currentPage: number;
  styles: ReturnType<typeof createStyles>;
  onPageChange: (page: number) => void;
  onComplete: () => void;
  onBackToStory: () => void;
};

function ReaderContent({
  storyTitle,
  storyId,
  pages,
  currentPage,
  styles,
  onPageChange,
  onComplete,
  onBackToStory,
}: ReaderContentProps) {
  const page =
    pages.find((item) => item.pageNumber === currentPage) ?? pages[0];
  const pageIndex = page.pageNumber;
  const isFirstPage = pageIndex <= 1;
  const isLastPage = pageIndex >= pages.length;
  const pageImage = useStoryImageSource(page.imageUrl);

  const goToPage = (nextPage: number) => {
    const clampedPage = Math.min(Math.max(nextPage, 1), pages.length);
    onPageChange(clampedPage);
    saveProgress(storyId, clampedPage);
  };

  const handlePrevious = () => {
    if (isFirstPage) {
      return;
    }

    goToPage(pageIndex - 1);
  };

  const handleNext = () => {
    if (isLastPage) {
      onComplete();
      return;
    }

    goToPage(pageIndex + 1);
  };

  return (
    <AppScreen padded={false} style={styles.screen}>
      <View style={styles.container}>
        <AppText
          variant="caption"
          color="secondary"
          numberOfLines={1}
          style={styles.storyTitle}
        >
          {storyTitle}
        </AppText>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AppImage
            source={pageImage.source}
            fallbackLabel="Ілюстрація"
            height={180}
            collapseWhenUnavailable={pageImage.type === 'missing'}
            style={styles.pageImage}
          />

          <AppText variant="reader" style={styles.pageText}>
            {page.text}
          </AppText>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.progressBlock}>
            <AppProgress
              variant="dots"
              total={pages.length}
              current={pageIndex}
            />
            <AppText variant="caption" color="muted" style={styles.progressText}>
              Сторінка {pageIndex} з {pages.length}
            </AppText>
          </View>

          <View style={styles.controlsRow}>
            <AppButton
              label="Назад"
              variant="secondary"
              disabled={isFirstPage}
              onPress={handlePrevious}
              style={styles.controlButton}
            />
            <AppButton
              label={isLastPage ? 'Завершити' : 'Далі'}
              variant={isLastPage ? 'primary' : 'secondary'}
              onPress={handleNext}
              style={styles.controlButton}
            />
          </View>

          <AppButton
            label="До казки"
            variant="secondary"
            onPress={onBackToStory}
          />
        </View>
      </View>
    </AppScreen>
  );
}

type ReaderCompletedViewProps = {
  storyTitle: string;
  styles: ReturnType<typeof createStyles>;
  onBackToStory: () => void;
};

function ReaderCompletedView({
  storyTitle,
  styles,
  onBackToStory,
}: ReaderCompletedViewProps) {
  return (
    <AppScreen padded={false} style={styles.screen}>
      <View style={styles.completedContainer}>
        <AppText
          variant="caption"
          color="secondary"
          numberOfLines={1}
          style={styles.storyTitle}
        >
          {storyTitle}
        </AppText>

        <View style={styles.completedBody}>
          <AppText variant="h3" style={styles.completedTitle}>
            Казку прочитано
          </AppText>
          <AppText variant="body" color="secondary" style={styles.completedMessage}>
            Дякуємо за спокійне читання разом.
          </AppText>
        </View>

        <AppButton label="До казки" onPress={onBackToStory} />
      </View>
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    screen: {
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      paddingHorizontal: theme.layout.readerHorizontalPadding,
      paddingTop: theme.spacing.space_4,
      paddingBottom: theme.spacing.space_6,
    },
    storyTitle: {
      textAlign: 'center',
      marginBottom: theme.spacing.space_4,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: theme.spacing.space_6,
      gap: theme.spacing.space_6,
    },
    pageImage: {
      maxHeight: 220,
      borderRadius: theme.radius.radius_lg,
    },
    pageText: {
      color: theme.colors.textPrimary,
    },
    footer: {
      gap: theme.spacing.space_4,
      paddingTop: theme.spacing.space_4,
    },
    progressBlock: {
      alignItems: 'center',
      gap: theme.spacing.space_3,
    },
    progressText: {
      textAlign: 'center',
    },
    controlsRow: {
      flexDirection: 'row',
      gap: theme.spacing.space_3,
    },
    controlButton: {
      flex: 1,
    },
    completedContainer: {
      flex: 1,
      paddingHorizontal: theme.layout.readerHorizontalPadding,
      paddingVertical: theme.layout.readerVerticalPadding,
      justifyContent: 'space-between',
    },
    completedBody: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.spacing.space_4,
      paddingHorizontal: theme.spacing.space_4,
    },
    completedTitle: {
      textAlign: 'center',
    },
    completedMessage: {
      textAlign: 'center',
    },
  });
}
