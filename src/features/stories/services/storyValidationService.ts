import type {
  Story,
  StoryCategory,
  StoryIllustrationProfile,
  StoryPage,
  StoryRitualMode,
} from '../../../types/story';

import { STORY_CATEGORY_LABELS } from '../constants';

export type StoryValidationResult = {
  valid: boolean;
  warnings: string[];
};

const STORY_CATEGORIES = Object.keys(
  STORY_CATEGORY_LABELS,
) as StoryCategory[];

const STORY_RITUAL_MODES: StoryRitualMode[] = [
  'night',
  'day',
  'quiet',
  'travel',
  'readTogether',
];

const ILLUSTRATION_PROFILES: StoryIllustrationProfile[] = [
  'minimal',
  'standard',
  'rich',
];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isStoryCategory(value: unknown): value is StoryCategory {
  return (
    typeof value === 'string' &&
    (STORY_CATEGORIES as string[]).includes(value)
  );
}

function isStoryRitualMode(value: unknown): value is StoryRitualMode {
  return (
    typeof value === 'string' &&
    (STORY_RITUAL_MODES as string[]).includes(value)
  );
}

function isIllustrationProfile(
  value: unknown,
): value is StoryIllustrationProfile {
  return (
    typeof value === 'string' &&
    (ILLUSTRATION_PROFILES as string[]).includes(value)
  );
}

function pageHasAnyImage(page: StoryPage): boolean {
  return (
    (typeof page.imageUrl === 'string' && page.imageUrl.trim().length > 0) ||
    (typeof page.phoneImageUrl === 'string' &&
      page.phoneImageUrl.trim().length > 0) ||
    (typeof page.tabletImageUrl === 'string' &&
      page.tabletImageUrl.trim().length > 0)
  );
}

export function validateStory(story: Story): StoryValidationResult {
  const warnings: string[] = [];
  let valid = true;

  if (!isNonEmptyString(story.title)) {
    valid = false;
    warnings.push('Story title is required.');
  }

  if (!isStoryCategory(story.category)) {
    valid = false;
    warnings.push('Story category is required and must be a known category.');
  }

  if (typeof story.pageCount !== 'number' || story.pageCount <= 0) {
    valid = false;
    warnings.push('Story pageCount must be greater than zero.');
  }

  if (story.estimatedReadingMinutes !== undefined) {
    if (
      typeof story.estimatedReadingMinutes !== 'number' ||
      story.estimatedReadingMinutes < 0
    ) {
      valid = false;
      warnings.push('estimatedReadingMinutes must be zero or greater when set.');
    }
  }

  if (story.recommendedRitual !== undefined && !isStoryRitualMode(story.recommendedRitual)) {
    valid = false;
    warnings.push('recommendedRitual must be a supported StoryRitualMode value.');
  }

  if (
    story.illustrationProfile !== undefined &&
    !isIllustrationProfile(story.illustrationProfile)
  ) {
    valid = false;
    warnings.push(
      'illustrationProfile must be one of: minimal, standard, rich.',
    );
  }

  if (story.readingModes !== undefined) {
    if (!Array.isArray(story.readingModes) || story.readingModes.length === 0) {
      warnings.push('readingModes should be a non-empty array when provided.');
    } else {
      for (const mode of story.readingModes) {
        if (!isStoryRitualMode(mode)) {
          valid = false;
          warnings.push(`readingModes contains unsupported value: ${String(mode)}`);
        }
      }
    }
  }

  if (story.contentWarnings !== undefined) {
    if (!Array.isArray(story.contentWarnings)) {
      warnings.push('contentWarnings should be an array when provided.');
    } else {
      for (const warning of story.contentWarnings) {
        if (!isNonEmptyString(warning)) {
          warnings.push('contentWarnings entries should be non-empty strings.');
        }
      }
    }
  }

  return { valid, warnings };
}

export function validateStoryPages(storyPages: StoryPage[]): StoryValidationResult {
  const warnings: string[] = [];
  let valid = true;

  if (!Array.isArray(storyPages) || storyPages.length === 0) {
    return {
      valid: false,
      warnings: ['At least one story page is required.'],
    };
  }

  const pageNumbers = new Set<number>();

  for (const page of storyPages) {
    if (!isNonEmptyString(page.id)) {
      valid = false;
      warnings.push('Each page must have an id.');
    }

    if (!isNonEmptyString(page.storyId)) {
      valid = false;
      warnings.push('Each page must have a storyId.');
    }

    if (typeof page.pageNumber !== 'number' || page.pageNumber < 1) {
      valid = false;
      warnings.push(`Page ${page.id ?? '(unknown)'}: pageNumber must be at least 1.`);
    } else if (pageNumbers.has(page.pageNumber)) {
      warnings.push(`Duplicate pageNumber ${page.pageNumber} in story pages.`);
    } else {
      pageNumbers.add(page.pageNumber);
    }

    if (!isNonEmptyString(page.text)) {
      valid = false;
      warnings.push(`Page ${page.pageNumber}: text is required.`);
    }

    if (page.textOnlySafe === true) {
      continue;
    }

    if (!pageHasAnyImage(page)) {
      warnings.push(
        `Page ${page.pageNumber}: missing imageUrl, phoneImageUrl, and tabletImageUrl (set textOnlySafe to allow text-only).`,
      );
    }

    if (
      typeof page.phoneImageUrl === 'string' &&
      page.phoneImageUrl.trim().length > 0 &&
      typeof page.tabletImageUrl === 'string' &&
      page.tabletImageUrl.trim().length > 0 &&
      page.phoneImageUrl === page.tabletImageUrl
    ) {
      warnings.push(
        `Page ${page.pageNumber}: phoneImageUrl and tabletImageUrl are identical (independent URLs are preferred).`,
      );
    }

    if (page.imageAlt !== undefined && !isNonEmptyString(page.imageAlt)) {
      warnings.push(`Page ${page.pageNumber}: imageAlt should be non-empty when provided.`);
    }
  }

  return { valid, warnings };
}

export function validateStoryWithPages(
  story: Story,
  pages: StoryPage[],
): StoryValidationResult {
  const storyResult = validateStory(story);
  const pagesResult = validateStoryPages(pages);
  const warnings = [...storyResult.warnings, ...pagesResult.warnings];

  if (typeof story.pageCount === 'number' && pages.length !== story.pageCount) {
    warnings.push(
      `story.pageCount (${story.pageCount}) does not match pages.length (${pages.length}).`,
    );
  }

  for (const page of pages) {
    if (page.storyId !== story.id) {
      warnings.push(
        `Page ${page.pageNumber}: storyId "${page.storyId}" does not match story.id "${story.id}".`,
      );
    }
  }

  return {
    valid: storyResult.valid && pagesResult.valid,
    warnings,
  };
}
