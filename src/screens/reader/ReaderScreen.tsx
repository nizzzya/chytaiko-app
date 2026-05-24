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
  clearReaderSession,
  getProgress,
  getReaderSettings,
  markCompleted,
  saveProgress,
  saveReaderSession,
  saveReaderSettings,
  subscribeReaderSettings,
  useReaderLayout,
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
      saveReaderSession(storyId, 1);
      return;
    }

    const lastPage = Math.min(
      Math.max(result.data.lastPage, 1),
      Math.max(pages.length, 1),
    );

    setCurrentPage(lastPage);
    setIsCompleted(result.data.completed);
    saveReaderSession(storyId, lastPage);
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
        clearReaderSession();
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
  const readerLayout = useReaderLayout();
  const [showIllustrations, setShowIllustrations] = useState(
    () => getReaderSettings().showIllustrations,
  );
  const page =
    pages.find((item) => item.pageNumber === currentPage) ?? pages[0];
  const pageIndex = page.pageNumber;
  const isFirstPage = pageIndex <= 1;
  const isLastPage = pageIndex >= pages.length;
  const pageImage = useStoryImageSource(page.imageUrl);

  useEffect(
    () =>
      subscribeReaderSettings((settings) => {
        setShowIllustrations(settings.showIllustrations);
      }),
    [],
  );

  const handleToggleIllustrations = () => {
    saveReaderSettings({ showIllustrations: !showIllustrations });
  };

  const goToPage = (nextPage: number) => {
    const clampedPage = Math.min(Math.max(nextPage, 1), pages.length);
    onPageChange(clampedPage);
    saveProgress(storyId, clampedPage);
    saveReaderSession(storyId, clampedPage);
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
      <View
        style={[
          styles.container,
          { paddingHorizontal: readerLayout.contentPadding },
        ]}
      >
        <AppText
          variant="caption"
          color="secondary"
          numberOfLines={1}
          style={styles.storyTitle}
        >
          {storyTitle}
        </AppText>

        <AppButton
          label={
            showIllustrations ? 'Сховати ілюстрації' : 'Показувати ілюстрації'
          }
          variant="secondary"
          onPress={handleToggleIllustrations}
          style={styles.illustrationToggle}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {showIllustrations ? (
            <AppImage
              source={pageImage.source}
              fallbackLabel="Ілюстрація"
              height={readerLayout.imageHeight}
              collapseWhenUnavailable={pageImage.type === 'missing'}
              style={[
                styles.pageImage,
                { maxHeight: readerLayout.imageHeight },
              ]}
            />
          ) : null}

          <View
            style={[
              styles.textBlock,
              (!readerLayout.isTablet || !showIllustrations) &&
                styles.textBlockPhone,
              { maxWidth: readerLayout.textMaxWidth },
            ]}
          >
            <AppText variant="reader" style={styles.pageText}>
              {page.text}
            </AppText>
          </View>
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
  const readerLayout = useReaderLayout();

  return (
    <AppScreen padded={false} style={styles.screen}>
      <View
        style={[
          styles.completedContainer,
          { paddingHorizontal: readerLayout.contentPadding },
        ]}
      >
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
      paddingTop: theme.spacing.space_4,
      paddingBottom: theme.spacing.space_6,
    },
    storyTitle: {
      textAlign: 'center',
      marginBottom: theme.spacing.space_3,
    },
    illustrationToggle: {
      marginBottom: theme.spacing.space_4,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: theme.spacing.space_6,
      gap: theme.spacing.space_6,
    },
    pageImage: {
      width: '100%',
      borderRadius: theme.radius.radius_lg,
    },
    textBlock: {
      width: '100%',
      alignSelf: 'center',
    },
    textBlockPhone: {
      flexGrow: 1,
    },
    pageText: {
      color: theme.colors.textPrimary,
      width: '100%',
      textAlign: 'left',
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
