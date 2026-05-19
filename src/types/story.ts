/** Catalog visibility — MVP reads `active` only (TECHNICAL_PASSPORT §17). */
export type StoryStatus = 'draft' | 'active';

export type StoryAgeGroup = '4+' | '5+' | '6+';

export type StoryCategory =
  | 'folk'
  | 'fairy'
  | 'bedtime'
  | 'animals'
  | 'nature';

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
};

export type StoryPage = {
  id: string;
  storyId: string;
  pageNumber: number;
  text: string;
  imageUrl: string | null;
  createdAt: string;
};
