import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppButton,
  AppEmptyState,
  AppProgress,
  AppScreen,
  AppText,
} from '../../components/ui';
import { getMockStoryById, getMockStoryPages } from '../../features/stories';
import type { RootStackParamList } from '../../navigation/types';
import { useAppTheme, type AppTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Reader'>;

export function ReaderScreen({ navigation, route }: Props) {
  const { storyId } = route.params;
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const story = getMockStoryById(storyId);
  const pages = getMockStoryPages(storyId);
  const [currentPage, setCurrentPage] = useState(1);

  if (!story || pages.length === 0) {
    return (
      <AppScreen>
        <AppEmptyState
          title="Немає сторінок"
          message="Ця казка ще не готова до читання."
          actionLabel="Назад"
          onAction={() => navigation.goBack()}
        />
      </AppScreen>
    );
  }

  const page = pages.find((item) => item.pageNumber === currentPage) ?? pages[0];
  const isFirstPage = page.pageNumber <= 1;
  const isLastPage = page.pageNumber >= pages.length;

  return (
    <AppScreen>
      <View style={styles.container}>
        <View style={styles.textArea}>
          <AppText variant="reader" style={styles.pageText}>
            {page.text}
          </AppText>
        </View>

        <View style={styles.footer}>
          <AppProgress
            variant="dots"
            total={pages.length}
            current={page.pageNumber}
          />
          <View style={styles.controls}>
            <AppButton
              label="Назад"
              variant="secondary"
              disabled={isFirstPage}
              onPress={() =>
                setCurrentPage((value) => Math.max(1, value - 1))
              }
              style={styles.controlButton}
            />
            <AppButton
              label="Далі"
              variant="secondary"
              disabled={isLastPage}
              onPress={() =>
                setCurrentPage((value) =>
                  Math.min(pages.length, value + 1),
                )
              }
              style={styles.controlButton}
            />
          </View>
        </View>
      </View>
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.layout.readerHorizontalPadding,
      paddingVertical: theme.layout.readerVerticalPadding,
    },
    textArea: {
      flex: 1,
      justifyContent: 'center',
    },
    pageText: {
      color: theme.colors.textPrimary,
    },
    footer: {
      gap: theme.spacing.space_6,
      paddingBottom: theme.spacing.space_4,
    },
    controls: {
      flexDirection: 'row',
      gap: theme.spacing.space_3,
    },
    controlButton: {
      flex: 1,
    },
  });
}
