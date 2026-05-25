/** Catalog visibility — MVP reads `active` only (TECHNICAL_PASSPORT §17). */
export type StoryStatus = 'draft' | 'active';

export type StoryAgeGroup = '4+' | '5+' | '6+';

export type StoryCategory =
  | 'folk'
  | 'fairy'
  | 'bedtime'
  | 'animals'
  | 'nature';

/** Ritual modes supported for demo/catalog metadata (Reader `readingMode` uses a parallel set). */
export type StoryRitualMode =
  | 'night'
  | 'day'
  | 'quiet'
  | 'travel'
  | 'readTogether';

export type StoryIllustrationProfile = 'minimal' | 'standard' | 'rich';

export type Story = {
  id: string;
  slug: string;
  title: string;
  description: string;
  ageGroup: StoryAgeGroup;
  category: StoryCategory;
  coverImage: string;
  pageCount: number;
  status: StoryStatus;
  createdAt: string;
  updatedAt: string;
  /** Suggested rituals for this story (demo content). */
  readingModes?: StoryRitualMode[];
  contentWarnings?: string[];
  estimatedReadingMinutes?: number;
  recommendedRitual?: StoryRitualMode;
  illustrationProfile?: StoryIllustrationProfile;
};

export type StoryPage = {
  id: string;
  storyId: string;
  pageNumber: number;
  text: string;
  imageUrl: string | null;
  createdAt: string;
  imageAlt?: string;
  phoneImageUrl?: string;
  tabletImageUrl?: string;
  textOnlySafe?: boolean;
};
