import type { ImageSourcePropType } from 'react-native';

import { resolveStorageImageUrl } from './storyStorageImageService';

export type StoryImageSourceType = 'local' | 'remote' | 'missing';

export type StoryImageSource = {
  type: StoryImageSourceType;
  source: ImageSourcePropType | null;
};

/**
 * Maps mock/Firestore asset path strings to bundled local WEBP assets.
 * Metro requires static require() per file — add new entries when stories are added.
 */
const STORY_ASSET_SOURCES: Record<string, ImageSourcePropType> = {
  'assets/stories/kolobok/cover.webp': require('../../../../assets/stories/kolobok/cover.webp'),
  'assets/stories/kolobok/page-001.webp': require('../../../../assets/stories/kolobok/page-001.webp'),
  'assets/stories/kolobok/page-002.webp': require('../../../../assets/stories/kolobok/page-002.webp'),
  'assets/stories/kolobok/page-003.webp': require('../../../../assets/stories/kolobok/page-003.webp'),
  'assets/stories/fox-crane/cover.webp': require('../../../../assets/stories/fox-crane/cover.webp'),
  'assets/stories/fox-crane/page-001.webp': require('../../../../assets/stories/fox-crane/page-001.webp'),
  'assets/stories/fox-crane/page-002.webp': require('../../../../assets/stories/fox-crane/page-002.webp'),
  'assets/stories/fox-crane/page-003.webp': require('../../../../assets/stories/fox-crane/page-003.webp'),
  'assets/stories/koza-dereza/cover.webp': require('../../../../assets/stories/koza-dereza/cover.webp'),
  'assets/stories/koza-dereza/page-001.webp': require('../../../../assets/stories/koza-dereza/page-001.webp'),
  'assets/stories/koza-dereza/page-002.webp': require('../../../../assets/stories/koza-dereza/page-002.webp'),
  'assets/stories/koza-dereza/page-003.webp': require('../../../../assets/stories/koza-dereza/page-003.webp'),
};

function isRemoteImagePath(imagePath: string): boolean {
  return /^https?:\/\//i.test(imagePath);
}

/** Firebase Storage object path (§20): stories/{slug}/cover.webp, page-001.webp, … */
function isFirebaseStoragePath(imagePath: string): boolean {
  const normalized = imagePath.trim().replace(/^\/+/, '');

  if (!normalized || normalized.includes('..')) {
    return false;
  }

  return /^stories\/[^/]+\/.+/i.test(normalized);
}

/**
 * Sync resolver for bundled local assets and direct http(s) URLs.
 * Storage paths (stories/…) resolve as missing until screens adopt async resolver.
 */
export function resolveStoryImageSource(
  imagePath: string | null | undefined,
): StoryImageSource {
  if (!imagePath?.trim()) {
    return { type: 'missing', source: null };
  }

  const normalizedPath = imagePath.trim();

  if (isRemoteImagePath(normalizedPath)) {
    return { type: 'remote', source: { uri: normalizedPath } };
  }

  const localSource = STORY_ASSET_SOURCES[normalizedPath];

  if (localSource) {
    return { type: 'local', source: localSource };
  }

  return { type: 'missing', source: null };
}

/**
 * Async resolver: local registry → http(s) → Firebase Storage download URL → missing.
 */
export async function resolveStoryImageSourceAsync(
  imagePath: string | null | undefined,
): Promise<StoryImageSource> {
  if (!imagePath?.trim()) {
    return { type: 'missing', source: null };
  }

  const normalizedPath = imagePath.trim();

  const localSource = STORY_ASSET_SOURCES[normalizedPath];

  if (localSource) {
    return { type: 'local', source: localSource };
  }

  if (isRemoteImagePath(normalizedPath)) {
    return { type: 'remote', source: { uri: normalizedPath } };
  }

  if (isFirebaseStoragePath(normalizedPath)) {
    const storageResult = await resolveStorageImageUrl(normalizedPath);

    if (storageResult.success) {
      return { type: 'remote', source: { uri: storageResult.url } };
    }

    return { type: 'missing', source: null };
  }

  return { type: 'missing', source: null };
}

/** @deprecated Prefer resolveStoryImageSource for typed local/remote/missing handling. */
export function resolveStoryAsset(
  assetPath: string | null | undefined,
): ImageSourcePropType | null {
  return resolveStoryImageSource(assetPath).source;
}

export function hasStoryAsset(assetPath: string | null | undefined): boolean {
  return resolveStoryImageSource(assetPath).type !== 'missing';
}
