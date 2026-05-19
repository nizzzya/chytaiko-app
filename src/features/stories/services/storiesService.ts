import type { Story, StoryPage } from '../../../types/story';

import {
  getFirestoreStories,
  getFirestoreStoryPages,
} from './storiesFirestoreService';
import {
  getMockStories,
  getMockStoryById,
  getMockStoryPages,
} from './storyMockService';

/**
 * Stories catalog API — screens import this module only.
 */

type StoriesDataSource = 'mock' | 'firestore';

const STORIES_SOURCE_ENV = 'EXPO_PUBLIC_STORIES_SOURCE';

let catalogCache: Story[] | null = null;
let storyByIdCache = new Map<string, Story>();
let pagesByStoryIdCache = new Map<string, StoryPage[]>();
let useMockFallback = false;
let initializationPromise: Promise<void> | null = null;

function resolveStoriesDataSource(): StoriesDataSource {
  const value = process.env[STORIES_SOURCE_ENV]?.trim().toLowerCase();

  if (value === 'firestore') {
    return 'firestore';
  }

  return 'mock';
}

function shouldUseMockData(): boolean {
  return resolveStoriesDataSource() === 'mock' || useMockFallback;
}

async function loadFirestoreCatalog(): Promise<void> {
  const storiesResult = await getFirestoreStories();

  if (!storiesResult.success) {
    useMockFallback = true;
    catalogCache = null;
    storyByIdCache.clear();
    pagesByStoryIdCache.clear();
    return;
  }

  catalogCache = storiesResult.data;
  storyByIdCache = new Map(storiesResult.data.map((story) => [story.id, story]));
  pagesByStoryIdCache.clear();

  await Promise.all(
    storiesResult.data.map(async (story) => {
      const pagesResult = await getFirestoreStoryPages(story.id);

      if (pagesResult.success) {
        pagesByStoryIdCache.set(story.id, pagesResult.data);
      }
    }),
  );
}

async function initializeStoriesDataInternal(): Promise<void> {
  if (resolveStoriesDataSource() === 'mock') {
    useMockFallback = false;
    catalogCache = null;
    storyByIdCache.clear();
    pagesByStoryIdCache.clear();
    return;
  }

  useMockFallback = false;
  await loadFirestoreCatalog();
}

/** Preloads Firestore catalog when configured; safe no-op for mock source. */
export function initializeStoriesData(): Promise<void> {
  if (!initializationPromise) {
    initializationPromise = initializeStoriesDataInternal();
  }

  return initializationPromise;
}

export function getStories(): Story[] {
  if (shouldUseMockData()) {
    return getMockStories();
  }

  return catalogCache ?? getMockStories();
}

export function getStoryById(id: string): Story | undefined {
  if (shouldUseMockData()) {
    return getMockStoryById(id);
  }

  const cachedStory = storyByIdCache.get(id);

  if (cachedStory) {
    return cachedStory;
  }

  return getMockStoryById(id);
}

export function getStoryPages(storyId: string): StoryPage[] {
  if (shouldUseMockData()) {
    return getMockStoryPages(storyId);
  }

  const cachedPages = pagesByStoryIdCache.get(storyId);

  if (cachedPages) {
    return cachedPages;
  }

  return getMockStoryPages(storyId);
}
