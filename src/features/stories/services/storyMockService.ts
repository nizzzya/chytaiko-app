import type { Story, StoryPage } from '../../../types/story';
import { mockStories, mockStoryPages } from '../data/mockStories';

/** Active stories only — mirrors future Firestore catalog filter. */
export function getMockStories(): Story[] {
  return mockStories.filter((story) => story.status === 'active');
}

export function getMockStoryById(id: string): Story | undefined {
  return getMockStories().find((story) => story.id === id);
}

export function getMockStoryPages(storyId: string): StoryPage[] {
  return mockStoryPages
    .filter((page) => page.storyId === storyId)
    .sort((a, b) => a.pageNumber - b.pageNumber);
}
