import type { Story, StoryPage } from '../../../types/story';
import { demoStories, demoStoryPages } from '../content/demoContent';

/** Active stories only — mirrors future Firestore catalog filter. */
export function getMockStories(): Story[] {
  return demoStories.filter((story) => story.status === 'active');
}

export function getMockStoryById(id: string): Story | undefined {
  return getMockStories().find((story) => story.id === id);
}

export function getMockStoryPages(storyId: string): StoryPage[] {
  return demoStoryPages
    .filter((page) => page.storyId === storyId)
    .sort((a, b) => a.pageNumber - b.pageNumber);
}
