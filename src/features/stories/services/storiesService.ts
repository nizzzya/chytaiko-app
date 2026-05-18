import type { Story, StoryPage } from '../../../types/story';

import {
  getMockStories,
  getMockStoryById,
  getMockStoryPages,
} from './storyMockService';

/**
 * Stories catalog API — screens import this module only.
 * Firestore implementation will replace mock delegation later.
 */

export function getStories(): Story[] {
  return getMockStories();
}

export function getStoryById(id: string): Story | undefined {
  return getMockStoryById(id);
}

export function getStoryPages(storyId: string): StoryPage[] {
  return getMockStoryPages(storyId);
}
