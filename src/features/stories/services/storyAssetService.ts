import type { ImageSourcePropType } from 'react-native';

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

/** @deprecated Prefer resolveStoryImageSource for typed local/remote/missing handling. */
export function resolveStoryAsset(
  assetPath: string | null | undefined,
): ImageSourcePropType | null {
  return resolveStoryImageSource(assetPath).source;
}

export function hasStoryAsset(assetPath: string | null | undefined): boolean {
  return resolveStoryImageSource(assetPath).type !== 'missing';
}
