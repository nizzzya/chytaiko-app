import { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
import { recordLibraryStoryOpen } from '../../features/library';
import {
  clearReaderSession,
  getProgress,
  getReaderModePresentation,
  getReaderSettings,
  markCompleted,
  READER_MODE_OPTIONS,
  saveProgress,
  saveReaderSession,
  saveReaderSettings,
  subscribeReaderSettings,
  useReaderLayout,
  type ReadingMode,
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
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => subscribeHydration(() => setHydrationReady(true)), []);

  const restoreProgress = useCallback(() => {
    const result = getProgress(storyId);

    if (!result.success || !result.data) {
      setIsCompleted(false);
      saveReaderSession(storyId, 1);
      return;
    }

    const lastPage = Math.min(
      Math.max(result.data.lastPage, 1),
      Math.max(pages.length, 1),
    );

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

  return (
    <ReaderContent
      storyTitle={story.title}
      storyId={storyId}
      pages={pages}
      isCompleted={isCompleted}
      styles={styles}
      onMarkCompleted={() => setIsCompleted(true)}
      onBackToStory={goToStoryDetails}
    />
  );
}

type ReaderContentProps = {
  storyTitle: string;
  storyId: string;
  pages: StoryPage[];
  isCompleted: boolean;
  styles: ReturnType<typeof createStyles>;
  onMarkCompleted: () => void;
  onBackToStory: () => void;
};

function ReaderContent({
  storyTitle,
  storyId,
  pages,
  isCompleted,
  styles,
  onMarkCompleted,
  onBackToStory,
}: ReaderContentProps) {
  const { theme } = useAppTheme();
  const readerLayout = useReaderLayout();
  const [readerSettings, setReaderSettings] = useState(getReaderSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { showIllustrations, readingMode } = readerSettings;

  useEffect(
    () => subscribeReaderSettings((settings) => setReaderSettings(settings)),
    [],
  );

  useEffect(() => {
    recordLibraryStoryOpen(storyId, readingMode);
  }, [storyId, readingMode]);

  const modePresentation = useMemo(
    () =>
      getReaderModePresentation(
        readingMode,
        {
          space_2: theme.spacing.space_2,
          space_3: theme.spacing.space_3,
          space_4: theme.spacing.space_4,
          space_5: theme.spacing.space_5,
          space_6: theme.spacing.space_6,
          space_8: theme.spacing.space_8,
        },
        theme.colors,
      ),
    [readingMode, theme.colors, theme.spacing],
  );

  const pageImageHeight = Math.round(
    readerLayout.imageHeight * modePresentation.imageHeightScale,
  );

  const shouldShowIllustrations = showIllustrations;

  const shouldPrioritizeText =
    !readerLayout.isTablet ||
    !shouldShowIllustrations ||
    modePresentation.prioritizeText;

  const handleToggleIllustrations = () => {
    saveReaderSettings({
      ...getReaderSettings(),
      showIllustrations: !showIllustrations,
    });
  };

  const handleSelectReadingMode = (mode: ReadingMode) => {
    saveReaderSettings({
      ...getReaderSettings(),
      readingMode: mode,
    });
  };

  const handleReturnToStory = () => {
    if (!isCompleted) {
      saveProgress(storyId, pages.length);
      markCompleted(storyId);
      clearReaderSession();
      onMarkCompleted();
    }

    onBackToStory();
  };

  return (
    <AppScreen
      padded={false}
      style={[
        styles.screen,
        { backgroundColor: modePresentation.readerBackground },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            paddingHorizontal: readerLayout.contentPadding,
            paddingTop: modePresentation.containerPaddingTop,
            paddingBottom: modePresentation.containerPaddingBottom,
          },
        ]}
      >
        <AppText
          variant="caption"
          color={modePresentation.storyTitleColor}
          numberOfLines={1}
          style={[
            styles.storyTitle,
            { marginBottom: modePresentation.storyTitleMarginBottom },
          ]}
        >
          {storyTitle}
        </AppText>

        <AppButton
          label="Режим читання"
          variant="secondary"
          onPress={() => setIsSettingsOpen(true)}
          style={[
            styles.readerSettingsButton,
            {
              marginBottom:
                modePresentation.modeRowPaddingBottom +
                modePresentation.illustrationToggleMarginBottom,
            },
          ]}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              gap: modePresentation.scrollGap,
              paddingBottom: modePresentation.scrollContentPaddingBottom,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {pages.map((page) => (
            <ReaderFlowSection
              key={page.id}
              page={page}
              pageImageHeight={pageImageHeight}
              shouldShowIllustrations={shouldShowIllustrations}
              shouldPrioritizeText={shouldPrioritizeText}
              imageFrameBackground={modePresentation.imageFrameBackground}
              textMaxWidth={readerLayout.textMaxWidth}
              styles={styles}
            />
          ))}

          <View style={styles.completionSection}>
            <AppText variant="body" color="secondary" style={styles.completionNote}>
              {isCompleted ? 'Казку прочитано.' : 'Дякуємо за спокійне читання разом.'}
            </AppText>
            <AppButton
              label="Повернутись до казки"
              variant="secondary"
              onPress={handleReturnToStory}
              style={styles.backToStoryButton}
            />
          </View>
        </ScrollView>
      </View>

      <Modal
        visible={isSettingsOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setIsSettingsOpen(false)}
      >
        <View style={styles.settingsOverlay}>
          <Pressable
            style={styles.settingsBackdrop}
            onPress={() => setIsSettingsOpen(false)}
          />
          <View style={styles.settingsSheet}>
            <AppText variant="h3">Режим читання</AppText>
            <View style={styles.settingsList}>
              {READER_MODE_OPTIONS.map((option) => {
                const isCurrentMode = option.mode === readingMode;

                return (
                  <Pressable
                    key={option.mode}
                    style={({ pressed }) => [
                      styles.settingsItem,
                      isCurrentMode && styles.settingsItemSelected,
                      pressed && styles.settingsItemPressed,
                    ]}
                    onPress={() => {
                      handleSelectReadingMode(option.mode);
                      setIsSettingsOpen(false);
                    }}
                  >
                    <AppText
                      variant="body"
                      color={isCurrentMode ? 'primary' : 'secondary'}
                    >
                      {option.label}
                    </AppText>
                    {isCurrentMode ? (
                      <AppText variant="caption" color="primary">
                        Поточний
                      </AppText>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.settingsItem,
                pressed && styles.settingsItemPressed,
              ]}
              onPress={handleToggleIllustrations}
            >
              <AppText variant="body" color="secondary">
                Показувати ілюстрації
              </AppText>
              <AppText variant="caption" color={showIllustrations ? 'primary' : 'muted'}>
                {showIllustrations ? 'Увімкнено' : 'Вимкнено'}
              </AppText>
            </Pressable>

            <AppButton
              label="Закрити"
              variant="secondary"
              onPress={() => setIsSettingsOpen(false)}
              style={styles.settingsCloseButton}
            />
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}

type ReaderFlowSectionProps = {
  page: StoryPage;
  pageImageHeight: number;
  shouldShowIllustrations: boolean;
  shouldPrioritizeText: boolean;
  imageFrameBackground: string | null;
  textMaxWidth: number;
  styles: ReturnType<typeof createStyles>;
};

function ReaderFlowSection({
  page,
  pageImageHeight,
  shouldShowIllustrations,
  shouldPrioritizeText,
  imageFrameBackground,
  textMaxWidth,
  styles,
}: ReaderFlowSectionProps) {
  const pageImage = useStoryImageSource(page.imageUrl);

  return (
    <View style={styles.flowSection}>
      {shouldShowIllustrations ? (
        imageFrameBackground ? (
          <View
            style={[
              styles.pageImageFrame,
              { backgroundColor: imageFrameBackground },
            ]}
          >
            <AppImage
              source={pageImage.source}
              fallbackLabel="Ілюстрація"
              height={pageImageHeight}
              collapseWhenUnavailable={pageImage.type === 'missing'}
              style={[styles.pageImage, { maxHeight: pageImageHeight }]}
            />
          </View>
        ) : (
          <AppImage
            source={pageImage.source}
            fallbackLabel="Ілюстрація"
            height={pageImageHeight}
            collapseWhenUnavailable={pageImage.type === 'missing'}
            style={[styles.pageImage, { maxHeight: pageImageHeight }]}
          />
        )
      ) : null}

      <View
        style={[
          styles.textBlock,
          shouldPrioritizeText && styles.textBlockPhone,
          { maxWidth: textMaxWidth },
        ]}
      >
        <AppText variant="reader" style={styles.pageText}>
          {page.text}
        </AppText>
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    screen: {
      flex: 1,
    },
    container: {
      flex: 1,
    },
    storyTitle: {
      textAlign: 'center',
      opacity: theme.opacity.pressed,
    },
    readerSettingsButton: {
      alignSelf: 'flex-start',
      minHeight: 40,
      paddingVertical: theme.spacing.space_2,
      paddingHorizontal: theme.spacing.space_4,
    },
    settingsOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    settingsBackdrop: {
      flex: 1,
      backgroundColor: theme.colors.textPrimary,
      opacity: 0.15,
    },
    settingsSheet: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.radius.radius_lg,
      borderTopRightRadius: theme.radius.radius_lg,
      paddingHorizontal: theme.spacing.space_4,
      paddingTop: theme.spacing.space_4,
      paddingBottom: theme.spacing.space_5,
      gap: theme.spacing.space_3,
    },
    settingsList: {
      gap: theme.spacing.space_2,
    },
    settingsItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.radius_md,
      paddingHorizontal: theme.spacing.space_4,
      paddingVertical: theme.spacing.space_3,
    },
    settingsItemSelected: {
      backgroundColor: theme.colors.primarySoft,
      borderColor: theme.colors.primary,
    },
    settingsItemPressed: {
      opacity: theme.opacity.pressed,
    },
    settingsCloseButton: {
      marginTop: theme.spacing.space_1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    flowSection: {
      gap: theme.spacing.space_5,
    },
    pageImageFrame: {
      width: '98%',
      alignSelf: 'center',
      padding: theme.spacing.space_1,
      borderRadius: theme.radius.radius_lg,
    },
    pageImage: {
      width: '100%',
      borderRadius: theme.radius.radius_lg,
    },
    textBlock: {
      width: '100%',
      alignSelf: 'center',
      paddingHorizontal: theme.spacing.space_2,
    },
    textBlockPhone: {
      flexGrow: 1,
    },
    pageText: {
      color: theme.colors.textPrimary,
      width: '100%',
      textAlign: 'left',
    },
    completionSection: {
      marginTop: theme.spacing.space_6,
      gap: theme.spacing.space_3,
      alignItems: 'center',
      paddingHorizontal: theme.spacing.space_2,
    },
    completionNote: {
      textAlign: 'center',
      opacity: 0.78,
    },
    backToStoryButton: {
      alignSelf: 'center',
      minHeight: 40,
      paddingVertical: theme.spacing.space_2,
      paddingHorizontal: theme.spacing.space_5,
    },
  });
}
